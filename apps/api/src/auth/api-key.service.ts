// Api key services for WooCommerce API authentication
// This service provides methods to create, revoke and validate API keys for merchants to access the WooCommerce API.

import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { createApiError } from '../common/api-error';
import { AuthenticatedUser } from './auth.types';
import { AUTH_ERRORS } from './auth-errors';

// Type representing the authenticated merchant using an API key
export interface MerchantApiPrincipal  {
    merchantId: string;
    apiKeyId: string;
};

export interface ApiKeyCreatePrincipal {
    apiKeyId: string;
    apiKey: string;
    createdAt: Date;
}

@Injectable()
export class ApiKeyService {
    constructor(private readonly prisma: PrismaService) {}

    // Hash function
    private hash(value: string): string {
        return createHash('sha256').update(value).digest('hex');
    }

    // create a new API key for merchant
    async createApiKey(user: AuthenticatedUser, merchantId: string, name: string) : Promise<ApiKeyCreatePrincipal> {
        if (user.id !== merchantId) {
            throw new ForbiddenException(createApiError('NOT_OWNER', AUTH_ERRORS));
        }
        // Maybe we define here number of API keys allowed per merchant 
        // ....

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
        return { apiKey, apiKeyId: newApiKey[0].id, createdAt: newApiKey[0].createdAt };
    }

    // Revoke an API key
    // This method marks an API key as revoked in the database, preventing further use.
    async revokeApiKey(apiKeyId: string, user: AuthenticatedUser, merchantId: string) {
        if (user.id !== merchantId) {
            throw new ForbiddenException(createApiError('NOT_OWNER', AUTH_ERRORS));
        }
      const revokedApiKey = await this.prisma.merchantApiKey.findUnique({
            where: {id: apiKeyId},
        });

        if (!revokedApiKey) {
            throw new NotFoundException(createApiError('API_KEY_NOT_FOUND', AUTH_ERRORS));
        }

        if (revokedApiKey.merchantId !== merchantId) {
            throw new ForbiddenException(createApiError('NOT_OWNER', AUTH_ERRORS));
        }

        await this.prisma.merchantApiKey.update({
            where: { id: apiKeyId },
            data: { revokedAt: new Date() },
        });
    }

    // Validate an API key
    // This method checks if the provided API key is valid and not revoked, returning the associated merchant information if valid.
    async validateApiKey(rawKey: string): Promise<MerchantApiPrincipal> { 
        const keyHash = this.hash(rawKey.trim());
        
        const apiKeyRecord = await this.prisma.merchantApiKey.findFirst({
            where: {
                keyHash
            },
        });
        
        // If no record is found, the API key is invalid
        if (!apiKeyRecord) {
            throw new UnauthorizedException(createApiError('INVALID_API_KEY', AUTH_ERRORS));
        }
        
        // Same goes if the API key has been revoked
        if (apiKeyRecord.revokedAt) {
            throw new ForbiddenException(createApiError('API_KEY_REVOKED', AUTH_ERRORS));
        }

        return {
            merchantId: apiKeyRecord.merchantId,
            apiKeyId: apiKeyRecord.id,
        };
    }

    // List all API keys for a merchant
    async listApiKeys(user: AuthenticatedUser, merchantId : string) {
        if (user.id !== merchantId) {
            throw new ForbiddenException(createApiError('NOT_OWNER', AUTH_ERRORS));
        }
        return await this.prisma.merchantApiKey.findMany({
            where: { merchantId },
            select: {
                id: true,
                name: true,
                createdAt: true,
                revokedAt: true,
            },
            orderBy: { createdAt: 'desc' }
        })
    }

}
