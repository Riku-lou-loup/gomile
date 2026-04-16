import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { KycStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

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
      throw new NotFoundException('Driver not found');
    }

    const submission = driver.kycSubmissions[0];
    // if there is no submission
    if (!submission) {
      throw new NotFoundException('No KYC submission found');
    }
    // front end shouldn't be able to call this if there is no kyc pending
    if (submission.status !== KycStatus.PENDING) {
      throw new ConflictException('KYC submission is not pending');
    }

    return { driver, submission };
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
      throw new NotFoundException('Driver profile not found');
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
