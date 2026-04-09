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

        const user = await prisma.user.create( {
            data: {
                email,
                password: 'password',
                role: 'MERCHANT',
            },
        });

        const merchant = await prisma.merchant.create({
            data: {
                name: `Riku test merchant`,
                userId: user.id,
            },
        });

        const rawApiKey = `test_api_key${Date.now()}`;
        const revokedRawApiKey = `revoked_key${Date.now()}`;
        // create the API key in the database with the hashed value
        const apiKey = await prisma.merchantApiKey.create({
            data: {
                merchantId: merchant.id,
                name: 'Test API WooComMerce',
                keyHash: hashApiKey(rawApiKey),
            },
        });

        const revokedApiKey = await prisma.merchantApiKey.create({
            data: {
                merchantId: merchant.id,
                name: 'Revoked !',
                keyHash: hashApiKey(revokedRawApiKey),
                revokedAt: new Date(),
            },
        });

        return { user, merchant, apiKey, rawApiKey, revokedApiKey, revokedRawApiKey };
    };

    it('returns a delivery eestimate for a valid API key', async() => {
        const rawKey = (await createMerchantApiKey()).rawApiKey;

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
        const revokedRawKey = (await createMerchantApiKey()).revokedRawApiKey;
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
});

