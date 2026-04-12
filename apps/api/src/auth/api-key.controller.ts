import {
    Controller,
    Post,
    Patch,
    Body,
    UseGuards,
    HttpCode,
    HttpStatus,
    Param,
    Get,
    Query
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { CreateApiKeyResponseDto } from './dto/create-api-key-response.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthenticatedUser } from './auth.types';

@ApiTags('api-keys')
@Controller('merchants/:merchantId/api-keys')
export class ApiKeyController {
    constructor(
      private readonly apiKeyService: ApiKeyService,
      ) {}

    @ApiOperation({ summary: 'Create a new API key' })
    @ApiOkResponse({ type: CreateApiKeyResponseDto })
    @UseGuards(JwtAuthGuard,RolesGuard)
    @ApiBearerAuth('access-token')
    @Roles(Role.MERCHANT, Role.ADMIN) // Only merchants and admin can create API keys
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createApiKey(
        @Param('merchantId') merchantId: string,
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: CreateApiKeyDto,
    ): Promise<CreateApiKeyResponseDto> {

        const newApiKey = await this.apiKeyService.createApiKey(user, merchantId, dto.storeId, dto.name, dto.expiresAt);
        return {
            id: newApiKey.apiKeyId,
            name: dto.name,
            apiKey: newApiKey.apiKey,
            createdAt: newApiKey.createdAt,
        };
    };

    @ApiOperation({ summary: 'List all API keys for a merchant'})
    @ApiOkResponse({ description: 'List of API keys retrieved successfully' })
    @UseGuards(JwtAuthGuard,RolesGuard)
    @ApiBearerAuth('access-token')
    @Roles(Role.MERCHANT, Role.ADMIN) // Only merchants and admin can list API keys
    @Get()
    @HttpCode(HttpStatus.OK)
    async listApiKeys(
        @Param('merchantId') merchantId: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.apiKeyService.listApiKeys(user, merchantId);
    }

    @ApiOperation({ summary: 'Get a single API key detail' })
    @ApiOkResponse({ description: 'API key detail retrieved successfully' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth('access-token')
    @Roles(Role.MERCHANT, Role.ADMIN)
    @Get(':apiKeyId')
    @HttpCode(HttpStatus.OK)
    async getApiKey(
        @Param('merchantId') merchantId: string,
        @Param('apiKeyId') apiKeyId: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.apiKeyService.getApiKey(user, merchantId, apiKeyId);
    }

    @ApiOperation({ summary: 'Update an API key name or expiration' })
    @ApiOkResponse({ description: 'API key updated successfully' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth('access-token')
    @Roles(Role.MERCHANT, Role.ADMIN)
    @Patch(':apiKeyId')
    @HttpCode(HttpStatus.OK)
    async updateApiKey(
        @Param('merchantId') merchantId: string,
        @Param('apiKeyId') apiKeyId: string,
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: UpdateApiKeyDto,
    ) {
        return this.apiKeyService.updateApiKey(user, merchantId, apiKeyId, dto.name, dto.expiresAt);
    }

    @ApiOperation({ summary: 'Revoke an API key' })
    @ApiOkResponse({ description: 'API key revoked successfully' })
    @UseGuards(JwtAuthGuard,RolesGuard)
    @ApiBearerAuth('access-token')
    @Roles(Role.MERCHANT, Role.ADMIN) // Only merchants and admin can revoke API keys
    @Post(':apiKeyId/revoke')
    @HttpCode(HttpStatus.OK)
    async revokeApiKey(
        @Param('merchantId') merchantId: string,
        @Param('apiKeyId') apiKeyId: string, 
        @CurrentUser() user: AuthenticatedUser,
    ) {
        await this.apiKeyService.revokeApiKey(apiKeyId, user, merchantId);
    }
}