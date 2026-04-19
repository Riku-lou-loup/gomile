import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { KycStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AUTH_ERRORS } from '../auth/auth-errors';
import { KYC_MESSAGES } from './kyc.message';
import { createApiError } from 'src/common/api-error';
import { KYC_ERRORS } from './kyc.error';

@Injectable()
export class KycService {
  constructor(private readonly prisma: PrismaService) {}

  async approveDriverKyc(driverId: string) {
    const { driver, submission } = await this.findPendingSubmission(driverId);
    await this.prisma.$transaction([
      this.prisma.kycSubmission.update({
        where: { id: submission.id },
        data: {
          status: KycStatus.ACCEPTED,
          rejectionReason: null,
        },
      }),
      this.prisma.driver.update({
        where: { userId: driver.userId },
        data: { kycStatus: KycStatus.ACCEPTED },
      })
    ]);


    return { message: 'KYC approved' };
  }

  async rejectDriverKyc(driverId: string, rejectionReason: string) {
    const { driver, submission } = await this.findPendingSubmission(driverId);

    await this.prisma.$transaction([
      this.prisma.kycSubmission.update({
        where: { id: submission.id },
        data: {
          status: KycStatus.REJECTED,
          rejectionReason,
        },
      }),
      this.prisma.driver.update({
        where: { userId: driver.userId },
        data: { kycStatus: KycStatus.REJECTED },
      }),
    ])
    return { message: 'KYC rejected' };
  }

  // find submission
  private async findPendingSubmission(driverId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { userId: driverId },
      include: {
        kycSubmissions: {
          where: { status: KycStatus.PENDING },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!driver) {
      throw new NotFoundException(createApiError('DRIVER_NOT_FOUND', AUTH_ERRORS));
    }

    const submission = driver.kycSubmissions[0];
    // if there is no submission
    if (!submission) {
      throw new NotFoundException(createApiError('KYC_SUBMISSION_NOT_FOUND', KYC_ERRORS));
    }
    // front end shouldn't be able to call this if there is no kyc pending
    if (submission.status !== KycStatus.PENDING) {
      throw new ConflictException(createApiError('KYC_VERIFYING_IN_PROCESS', KYC_ERRORS));
    }

    return { driver, submission };
  }

  async submitKyc(userId: string, documentUrl: string) {
    const driver = await this.prisma.driver.findUnique({ where: { userId } });
    if (!driver) {
      throw new NotFoundException(createApiError('DRIVER_NOT_FOUND', AUTH_ERRORS));
    }
    if (driver.kycStatus === KycStatus.PENDING) {
      throw new ConflictException(createApiError('KYC_VERIFYING_IN_PROCESS', KYC_ERRORS));
    }

    await this.prisma.$transaction([
      this.prisma.kycSubmission.create({
        data: { driverId: userId, documentUrl, status: KycStatus.PENDING },
      }),
      this.prisma.driver.update({
        where: { userId },
        data: { kycStatus: KycStatus.PENDING },
      }),
    ]);

    return { message: KYC_MESSAGES.KYC_SUBMITTED };
  }

  // what is my current kyc status, if rejected, why ? and what was my last submission
  async getMyKycStatus(userId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { userId },
      include: {
        kycSubmissions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    if (!driver) {
      throw new NotFoundException(createApiError('KYC_SUBMISSION_NOT_FOUND',KYC_ERRORS));
    }

    const latestSubmission = driver.kycSubmissions[0] ?? null;

    return {
      status: driver.kycStatus,
      latestSubmission: latestSubmission
        ? {
            id: latestSubmission.id,
            status: latestSubmission.status,
            documentUrl: latestSubmission.documentUrl,
            rejectionReason: latestSubmission.rejectionReason,
            createdAt: latestSubmission.createdAt,
          }
        : null,
    };
  }
}
