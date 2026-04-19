import { NotFoundException, Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthenticatedUser } from "../auth/auth.types";
import { AUTH_ERRORS } from "../auth/auth-errors";
import { createApiError } from "../common/api-error";
import { DRIVER_MESSAGES } from "./driver-me.message";
import { DriverPositionDto } from "./dto/driver-position.dto";
import { DriverStatus, WalletEntryStatus, WalletEntryType } from "@prisma/client";
import { DRIVER_ERROR } from "./driver-me.error";
import { OrderStatus } from "@prisma/client";
import { DriverProfileResponseDto } from "./dto/driver-profile-response.dto";
import { UpdateDriverProfileDto } from "./dto/update-driver-profile.dto";
import { KycStatus } from "@prisma/client";
import { UploadService } from "../upload/upload.service";
import { SessionVehicleDto } from "./dto/session-vehicle.dto";
import { DashboardResponseDto } from "./dto/dashboard-response.dto";

@Injectable()
export class DriverMeService {
  constructor (
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  // update postgis location manually
  private async updatePostGisDriver (driverId: string, latitude: number, longitude: number) {
    await this.prisma.$executeRaw `
    UPDATE "Driver"
    SET location = ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)
    WHERE "userId" = ${driverId}
    `
  }

  // Check driver exists
  async existsDriver(user: AuthenticatedUser) {
    const driver = await this.prisma.driver.findUnique({
      where: {
        userId: user.id
      }
    });
    if (!driver) {
      throw new NotFoundException(createApiError('DRIVER_NOT_FOUND', AUTH_ERRORS));
    }
    return driver;
  }

  // update driver position using earth coordinates
  async updateDriverPosition(user: AuthenticatedUser, latitude: number, longitude: number) {
    const driver = await this.existsDriver(user);

    await this.prisma.driver.update({
      where: {
       userId: user.id 
      },
      data: {
        lastKnownLatitude: latitude,
        lastKnownLongitude: longitude
      }
    });
    await this.updatePostGisDriver(user.id, latitude, longitude)

    return {
      message: DRIVER_MESSAGES.DRIVER_LOCATION_UPDATED
    }
  }

  // Check available orders using postgis
  async availableOrders(user: AuthenticatedUser) {
    return this.prisma.$queryRaw `
    select o.* from "Order" o
    join "Store" s on s.id = o."storeId"
    join "Driver" d on d."userId" = ${user.id}
    where o.status = 'SEARCHING_DRIVER'
    and ST_DWithin(
      s.location::geography,
      d."lastKnownLocation"::geography,
      d."deliveryRadius" * 1000
    )
    `
  }

  // Toggle driver's availabitlity (if a driver is accepting order or not
  async toggleDriverAvailability(user: AuthenticatedUser) {
    const driver = await this.existsDriver(user);

    if (driver.status === DriverStatus.BUSY) {
      throw new ConflictException(createApiError('DRIVER_BUSY', DRIVER_ERROR));
    }

    // If driver is not occupied and available, toggle to offline and vice versa
    const newStatus = driver.status === DriverStatus.AVAILABLE ? DriverStatus.OFFLINE : DriverStatus.AVAILABLE;

    const response = await this.prisma.driver.update({
      where: {
        userId: user.id
      },
      data: {
        status : newStatus,
      }
    })
    return { 
      status : newStatus // returning the current status of the driver after the toggle
    }
  }

  // Get active orders (ongoing ones)
  async getActiveOrders(user: AuthenticatedUser) {
    const driver = await this.existsDriver(user);

    return await this.prisma.order.findMany({
      where: {
        driverId: user.id,
        status: {
          in : [OrderStatus.DRIVER_ACCEPTED, OrderStatus.PICKED_UP]
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  // Get past orders
  async getPastOrders(user: AuthenticatedUser) {
    const driver = await this.existsDriver(user);

    return await this.prisma.order.findMany ({
      where: {
        driverId: user.id,
        status: {
          in: [OrderStatus.DELIVERED, OrderStatus.CANCELLED]
        }
      },
      orderBy : {
        createdAt: 'desc'
      }
    });
  }

  async getDriverProfile(user: AuthenticatedUser): Promise<DriverProfileResponseDto> {
    const driver = await this.prisma.driver.findUnique({
      where: { userId: user.id },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        rating: true,
        totalTrips: true,
        activeVehicle: true,
        gomileCode: true,
        status: true,
        user: {
          select: {
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!driver) {
      throw new NotFoundException(createApiError('DRIVER_NOT_FOUND', AUTH_ERRORS));
    }

    return {
      id: driver.userId,
      firstName: driver.firstName,
      lastName: driver.lastName,
      avatarUrl: driver.avatarUrl,
      email: driver.user.email,
      phone: driver.user.phone,
      rating: driver.rating,
      totalTrips: driver.totalTrips,
      activeVehicle: driver.activeVehicle,
      gomileCode: driver.gomileCode,
      status: driver.status,
    };
  }

  async updateDriverProfile(user: AuthenticatedUser, dto: UpdateDriverProfileDto) {
    const driver = await this.prisma.driver.findUnique({
      where: { userId: user.id },
    });

    if (!driver) {
      throw new NotFoundException(createApiError('DRIVER_NOT_FOUND', AUTH_ERRORS));
    }

    const addressChanged = dto.address !== undefined || dto.city !== undefined || dto.zipCode !== undefined || dto.street !== undefined;
    // Uploading avatar must first erase the existing one on the S3 database
    if (dto.avatarUrl !== undefined && driver.avatarUrl) {
      await this.uploadService.deleteFile(driver.avatarUrl);
    }

    // Any address or identity related update will unvalidate KYC status. Driver must then resubmit KYC documents
    await this.prisma.driver.update({
      where: { userId: user.id },
      data: {
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.city !== undefined && { city: dto.city }),
        ...(dto.zipCode !== undefined && { zipCode: dto.zipCode }),
        ...(dto.street !== undefined && { street: dto.street }),
        ...(dto.deliveryCity !== undefined && { deliveryCity: dto.deliveryCity }),
        ...(dto.deliveryRadius !== undefined && { deliveryRadius: dto.deliveryRadius }),
        ...(dto.transportType !== undefined && { transportType: dto.transportType }),
        ...(dto.equipments !== undefined && { equipments: dto.equipments }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
        ...(addressChanged && { kycStatus: KycStatus.NOT_SUBMITTED }),
      },
    });

    if (dto.phone !== undefined) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { phone: dto.phone },
      });
    }

    return { message: DRIVER_MESSAGES.DRIVER_PROFILE_UPDATED };
  }

  // update session vehicle
  async updateSessionVehicle(user: AuthenticatedUser, dto: SessionVehicleDto) {
    const driver = await this.existsDriver(user);
    await this.prisma.driver.update({
      where: {
        userId: user.id
      },
      data: {
        activeVehicle: dto.vehicleType
      }
    })
    return { activeVehicle: dto.vehicleType}
  }

  // gett dashboard
  async getDashboard(user: AuthenticatedUser): Promise<DashboardResponseDto> {
    const driver = await this.existsDriver(user);
    const today = new Date();
    today.setHours(0,0,0,0);

    const todayTrips = await this.prisma.order.count ({
      where: {
        driverId: user.id,
        status: OrderStatus.DELIVERED,
        updatedAt: {gte: today}
      },
    });

    const totalIncome = await this.prisma.walletEntry.aggregate({
      where: {
        wallet: {
          driverId: user.id
        },
        type: WalletEntryType.CREDIT,
        status: WalletEntryStatus.COMPLETED,
        createdAt: {
          gte: today
        },
      },
      _sum: {amount: true}
    });

    return {
      isOnline: driver.status === DriverStatus.AVAILABLE,
      todayEarnings: totalIncome._sum.amount ?? 0,
      todayTrips: todayTrips,
      currentLocation: {
        latitude: driver.lastKnownLatitude,
        longitude: driver.lastKnownLongitude,
      },
      coverageRadiusMeters: driver.deliveryRadius * 1000
    }
  }

}