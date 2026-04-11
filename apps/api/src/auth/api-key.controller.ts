import {
    Controller, 
    Post, 
    Body, 
    UseGuards,
    HttpCode,
    HttpStatus,
    Param,
    Get,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { CreateApiKeyResponseDto } from './dto/create-api-key-response.dto';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthService } from './auth.service';
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

        const newApiKey = await this.apiKeyService.createApiKey(user, merchantId, dto.name);
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
        @CurrentUser() user: AuthenticatedUser
    ) {
        return this.apiKeyService.listApiKeys(user, merchantId);
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
        @CurrentUser() user: AuthenticatedUser
    ) {
        await this.apiKeyService.revokeApiKey(apiKeyId, user, merchantId);
    }
}