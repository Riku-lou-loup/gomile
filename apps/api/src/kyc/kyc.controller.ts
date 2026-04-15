import {
  Body,
  Controller, Get,
  Param,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RejectKycDto } from './dto/reject-kyc.dto';
import { KycService } from './kyc.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser} from "../auth/auth.types";

@ApiTags('kyc')
@Controller('livreurs')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @ApiOperation({ summary: 'Approve a driver KYC submission' })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'KYC approved' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Access token invalide' })
  @ApiForbiddenResponse({ description: 'Role insuffisant' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id/kyc-approve')
  approveDriverKyc(@Param('id', new ParseUUIDPipe()) driverId: string) {
    return this.kycService.approveDriverKyc(driverId);
  }

  @ApiOperation({ summary: 'Reject a driver KYC submission' })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'KYC rejected' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Access token invalide' })
  @ApiForbiddenResponse({ description: 'Role insuffisant' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id/kyc-reject')
  rejectDriverKyc(
    @Param('id', new ParseUUIDPipe()) driverId: string,
    @Body() dto: RejectKycDto,
  ) {
    return this.kycService.rejectDriverKyc(driverId, dto.rejectionReason);
  }

  @ApiOperation({ summary: 'Get the current driver KYC status'})
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'PENDING' },
        latestSubmission: {
          type: 'object',
          nullable: true,
          properties: {
            id: { type: 'string' },
            status: { type: 'string' },
            documentUrl: { type: 'string' },
            rejectionReason: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time'}
          }
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Access token invalide' })
  @ApiForbiddenResponse({ description: 'Role insuffisant' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DRIVER)
  @Get('me/kyc')
  getMyKycStatus(@CurrentUser() user: AuthenticatedUser) {
    return this.kycService.getMyKycStatus(user.id);
  }
}
