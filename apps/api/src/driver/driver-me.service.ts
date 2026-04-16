import { NotFoundException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthenticatedUser } from "../auth/auth.types";
import { AUTH_ERRORS } from "../auth/auth-errors";
import { createApiError } from "../common/api-error";
import { DRIVER_MESSAGES } from "./driver-me.message";
import { DriverPositionDto } from "./dto/driver-position.dto";

@Injectable()
export class DriverMeService {
  constructor (private readonly prisma: PrismaService) {}

  // update postgis location manually
  private async updatePostGisDriver (driverId: string, latitude: number, longitude: number) {
    await this.prisma.$executeRaw `
    UPDATE "Driver"
    SET location = ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)
    WHERE "userId" = ${driverId}
    `
  }
  async updateDriverPosition(user: AuthenticatedUser, latitude: number, longitude: number) {
    const driver = await this.prisma.driver.findUnique({
      where: {
        userId: user.id
      }
    })

    if (!driver) {
      throw new NotFoundException(createApiError('DRIVER_NOT_FOUND', AUTH_ERRORS));
    }

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
}