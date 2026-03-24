import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

describe('KycController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  async function createAdminAccessToken() {
    const email = `riku_le_admin${Date.now()}@test.local`;
    const password = 'Password123!';
    const passwordHash = await bcrypt.hash(password, 10); // db do not store fresh pwd but rather hashed ones

    // here I'm just simulating the creation of an admin
    await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        role: 'ADMIN',
      },
    });
    // admin login
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(HttpStatus.OK);

    return (loginResponse.body as AuthTokensResponse).accessToken;
  }

  // registering a driver with Kyc option
  async function registerDriverWithKyc() {
    const email = `driver_${Date.now()}@test.local`;
    const response = await request(app.getHttpServer())
      .post('/auth/register/driver')
      .send({
        email,
        password: 'Password123!',
        firstName: 'Kyc',
        lastName: 'Driver',
        avatarUrl: 'https://example.test/avatar/kyc-driver.jpg',
        gender: 'MALE',
        phone: '0612345678',
        documentUrl: 'https://example.test/kyc/kyc-driver-id.jpg',
        dateOfBirth: '2000-01-02',
        address: '22 boulevard Clemenceau, 38100 Grenoble',
      })
      .expect(HttpStatus.CREATED);

    const auth = response.body as AuthTokensResponse;
    const driver = await prisma.driver.findUnique({
      where: { userId: auth.user.id },
      include: {
        kycSubmissions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    // driver registration already tested, we just do a failsave here
    expect(driver).not.toBeNull();

    return {
      auth,
      driver: driver!,
      submission: driver!.kycSubmissions[0],
    };
  }

  it('allows a driver to read their own KYC status', async () => {
    const { auth, submission } = await registerDriverWithKyc();
    // after registration, driver can check the kyc status
    const response = await request(app.getHttpServer())
      .get('/livreurs/me/kyc')
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(HttpStatus.OK);

    // should be pending, and should match
    expect(response.body.status).toBe('PENDING');
    expect(response.body.latestSubmission).toMatchObject({
      id: submission.id,
      status: 'PENDING',
      documentUrl: 'https://example.test/kyc/kyc-driver-id.jpg',
      rejectionReason: null,
    });
  });

  // now Riku the admin will approve the kyc
  it('allows an admin to approve a driver KYC submission', async () => {
    const adminAccessToken = await createAdminAccessToken();
    const { driver, submission } = await registerDriverWithKyc();

    // Calling backend API to approve
    await request(app.getHttpServer())
      .put(`/livreurs/${driver.id}/kyc-approve`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(HttpStatus.OK)
      .expect({ message: 'KYC approved' });

    const updatedDriver = await prisma.driver.findUnique({
      where: { id: driver.id },
    });
    const updatedSubmission = await prisma.kycSubmission.findUnique({
      where: { id: submission.id },
    });

    // kyc approve should change the kyc status
    expect(updatedDriver?.kycStatus).toBe('ACCEPTED');
    expect(updatedSubmission?.status).toBe('ACCEPTED');
    expect(updatedSubmission?.rejectionReason).toBeNull();
  });

  // same, but now we reject
  it('allows an admin to reject a driver KYC submission', async () => {
    const adminAccessToken = await createAdminAccessToken();
    const { driver, submission } = await registerDriverWithKyc();
    const rejectionReason = 'Document is unreadable';

    await request(app.getHttpServer())
      .put(`/livreurs/${driver.id}/kyc-reject`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ rejectionReason })
      .expect(HttpStatus.OK)
      .expect({ message: 'KYC rejected' });

    const updatedDriver = await prisma.driver.findUnique({
      where: { id: driver.id },
    });
    const updatedSubmission = await prisma.kycSubmission.findUnique({
      where: { id: submission.id },
    });

    expect(updatedDriver?.kycStatus).toBe('REJECTED');
    expect(updatedSubmission?.status).toBe('REJECTED');
    expect(updatedSubmission?.rejectionReason).toBe(rejectionReason);
  });

  // Non admin should not be able to call this api
  it('forbids a merchant from approving KYC', async () => {
    const merchantEmail = `merchant_${Date.now()}@test.local`;
    const merchantResponse = await request(app.getHttpServer())
      .post('/auth/register/merchant')
      .send({
        email: merchantEmail,
        password: 'Password123!',
        name: 'Test Merchant',
      })
      .expect(HttpStatus.CREATED);

    const merchantAuth = merchantResponse.body as AuthTokensResponse;
    const { driver } = await registerDriverWithKyc();

    await request(app.getHttpServer())
      .put(`/livreurs/${driver.id}/kyc-approve`)
      .set('Authorization', `Bearer ${merchantAuth.accessToken}`)
      .expect(HttpStatus.FORBIDDEN);
  });
});
