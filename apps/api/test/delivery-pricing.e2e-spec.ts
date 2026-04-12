import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { createHash } from 'crypto';
import { OpenRouteService } from '../src/delivery/openrouteservice.service';

function hashApiKey(rawKey: string): string {
    return createHash('sha256').update(rawKey).digest('hex');
}

describe('DeliveryPricingController', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    // create a mock for the OpenRouteService
    const openRouteServiceMock = {
        resolveAddress: jest.fn(),
        getDrivingRoute: jest.fn(),
    };

    beforeAll(async () => {
        // Mock the OpenRouteService methods
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            // Replace real ORS by the mock
            .overrideProvider(OpenRouteService)
            .useValue(openRouteServiceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        prisma = moduleFixture.get(PrismaService);
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () => {
        // Clear the database before each test
        jest.clearAllMocks();

        openRouteServiceMock.resolveAddress.mockResolvedValueOnce({
            latitude: 40,
            longitude: 74,
        });
        openRouteServiceMock.getDrivingRoute.mockResolvedValueOnce({
            distanceMeters: 2000, // 2 km
            durationSeconds: 900, // 15 minutes
        });
    });

    async function createMerchantApiKey() {
        const email = `Riku_Merchant_${Date.now()}@example.com`;
        console.log('Creating merchant with email:', email);
        const registerResponse = await request(app.getHttpServer())
            .post('/auth/register/merchant')
            .send({
                email,
                password: 'password',
                name: 'Riku Merchant',
            })
            .expect(HttpStatus.CREATED);
        
        const auth = registerResponse.body;
        const accessToken = registerResponse.body.accessToken;

        // create the API key in the database with the hashed value
        const apiKey1 = await request(app.getHttpServer())
            .post(`/merchants/${auth.user.id}/api-keys`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ name: 'Test API Key' })
            .expect(HttpStatus.CREATED);

        const apiKey2 = await request(app.getHttpServer())
            .post(`/merchants/${auth.user.id}/api-keys`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ name: 'Revoked API Key' })
            .expect(HttpStatus.CREATED);

        await request(app.getHttpServer())
            .post(`/merchants/${auth.user.id}/api-keys/${apiKey2.body.id}/revoke`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HttpStatus.OK);

        return {
            validKey: apiKey1.body.apiKey, // raw API key to use in tests
            validKeyId: apiKey1.body.id,   // ID needed for revocation
            revokedKey: apiKey2.body.apiKey, // revoked key
            merchant: auth.user,
            email,
            accessToken
        };
    };

    it('returns a delivery eestimate for a valid API key', async () => {
        const rawKey = (await createMerchantApiKey()).validKey;

        const response = await request(app.getHttpServer())
            .post('/delivery-estimates')
            .set('x-api-key', rawKey)
            .send({
                pickupAddress: {
                    fullAddress: '25 boulevard Clemenceau, 38100 Grenoble',
                },
                dropoffAddress: {
                    fullAddress: 'Allee Condillac, 38000 Grenoble',
                },
                weightGrams: 2500,
            }).expect(HttpStatus.CREATED);

        expect(response.body).toMatchObject({
            serviceable: true,
        }),

            // resolve pickup and dropoff addresses = 2, and 1 call of get driving route
            expect(openRouteServiceMock.resolveAddress).toHaveBeenCalledTimes(2);
        expect(openRouteServiceMock.getDrivingRoute).toHaveBeenCalledTimes(1);
    });

    // test that an invalid API key is rejected
    it(' rejects an invalid API key', async () => {
        await request(app.getHttpServer())
            .post('/delivery-estimates')
            .set('x-api-key', 'bla bla bla bla') // should refuse this
            .send({
                pickupAddress: {
                    fullAddress: '25 boulevard Clemenceau, 38100 Grenoble',
                },
                dropoffAddress: {
                    fullAddress: 'Allee Condillac, 38000 Grenoble',
                },
                weightGrams: 2500,
            })
            .expect(HttpStatus.UNAUTHORIZED);
    });

    // test that missing API key is rejected
    it('rejects missing API key', async () => {
        await request(app.getHttpServer())
            .post('/delivery-estimates')
            .send({
                pickupAddress: {
                    fullAddress: '25 boulevard Clemenceau, 38100 Grenoble',
                },
                dropoffAddress: {
                    fullAddress: 'Allee Condillac, 38000 Grenoble',
                },
                weightGrams: 2500,
            })
            .expect(HttpStatus.UNAUTHORIZED);
    });

    // test that revoked API key is rejected
    it('rejects revoked API key', async () => {
        const revokedRawKey = (await createMerchantApiKey()).revokedKey;
        await request(app.getHttpServer())
            .post('/delivery-estimates')
            .set('x-api-key', revokedRawKey) // should refuse this
            .send({
                pickupAddress: {
                    fullAddress: '25 boulevard Clemenceau, 38100 Grenoble',
                },
                dropoffAddress: {
                    fullAddress: 'Allee Condillac, 38000 Grenoble',
                },
                weightGrams: 2500,
            })
            .expect(HttpStatus.FORBIDDEN);
    });

    // test revoking an API key prevents it from being used
    it('revokes an API key', async () => {
        const session = await createMerchantApiKey();
        const email = session.email;
        const merchant = session.merchant;
        const validRawKey = session.validKey;
        const validKeyId = session.validKeyId;
        // login as the merchant
        console.log('Merchant email:', email);
        console.log('Merchant password: password');
        const auth = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                identifier: email,
                password: 'password',
            })
            .expect(HttpStatus.OK);

        // revoke the API key (the valid one)
        const accessToken = auth.body.accessToken;
        await request(app.getHttpServer())
            .post(`/merchants/${merchant.id}/api-keys/${validKeyId}/revoke`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HttpStatus.OK);

        // should be rejected after revocation
        await request(app.getHttpServer())
            .post('/delivery-estimates')
            .set('x-api-key', validRawKey) // should refuse this
            .send({
                pickupAddress: {
                    fullAddress: '25 boulevard Clemenceau, 38100 Grenoble',
                },
                dropoffAddress: {
                    fullAddress: 'Allee Condillac, 38000 Grenoble',
                },
                weightGrams: 2500,
            })
            .expect(HttpStatus.FORBIDDEN);
    });
});
