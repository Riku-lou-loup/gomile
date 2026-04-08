// Api key services for WooCommerce API authentication
// This service provides methods to create, revoke and validate API keys for merchants to access the WooCommerce API.

import { Injectable, ForbiddenException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { createApiError } from './auth-errors';

// Type representing the authenticated merchant using an API key
export interface MerchantApiPrincipal  {
    merchantId: string;
    apiKeyId: string;
};

@Injectable()
export class ApiKeyService {
    constructor(private readonly prisma: PrismaService) {
    }

    // Hash function
    private hash(value: string): string {
        return createHash('sha256').update(value).digest('hex');
    }

    // create a new API key for merchant
    async createApiKey(merchantId: string, name: string) : Promise<{ apiKey: string; apiKeyId: string }> {
        // Generate a random API key
        // Only store the hash of the API key in the database for security
        const apiKey = randomBytes(32).toString('hex');
        const keyHash = this.hash(apiKey);
        const newApiKey = await this.prisma.$transaction([
            this.prisma.merchantApiKey.create({
                data: {
                    merchantId,
                    name,
                    keyHash,
                },
            }),
        ]);
        return { apiKey, apiKeyId: newApiKey[0].id };
    }

    // Revoke an API key
    // This method marks an API key as revoked in the database, preventing further use.
    async revokeApiKey(apiKeyId: string) {
        await this.prisma.merchantApiKey.update({
            where: {id: apiKeyId},
            data: {revokedAt: new Date()}
        })
    }

    // Validate an API key
    // This method checks if the provided API key is valid and not revoked, and returns the associated merchant information if valid.
    async validateApiKey(rawKey: string): Promise<MerchantApiPrincipal> { 
        const keyHash = this.hash(rawKey.trim());
        
        const apiKeyRecord = await this.prisma.merchantApiKey.findFirst({
            where: {
                keyHash
            },
        });
        
        // If no record is found, the API key is invalid
        if (!apiKeyRecord) {
            throw new UnauthorizedException(createApiError('INVALID_API_KEY'));
        }
        
        // Same goes if the API key has been revoked
        if (apiKeyRecord.revokedAt) {
            throw new ForbiddenException(createApiError('API_KEY_REVOKED'));
        }

        return {
            merchantId: apiKeyRecord.merchantId,
            apiKeyId: apiKeyRecord.id,
        };
    }
}
