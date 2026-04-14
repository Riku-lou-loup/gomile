import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, OrderStatus, Role } from "@prisma/client";
import { AuthenticatedUser } from "../../auth/auth.types";
import { createApiError } from "../../common/api-error";
import { PrismaService } from "../../prisma/prisma.service";
import { AUTH_ERRORS } from "../../auth/auth-errors";
import { ORDER_ERRORS } from "../order-errors";
import { ListDriverOrdersResponseDto } from "../dto/list-livreurs-orders-response";

@Injectable()
export class OrderLivreursService {
  constructor(private prisma: PrismaService) {}

  private async existsDriver(driverId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { userId: driverId },
    });
    if (!driver) {
      throw new NotFoundException(createApiError('DRIVER_NOT_FOUND', AUTH_ERRORS));
    }
    return driver;
  }

  private async existsOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException(createApiError('ORDER_NOT_FOUND', ORDER_ERRORS));
    }
    return order;
  }

  async listDriverOrders(
    user: AuthenticatedUser,
    driverId: string,
    filter?: 'active' | 'finished' | 'cancelled',
  ): Promise<ListDriverOrdersResponseDto[]> {
    await this.existsDriver(driverId);
    if (user.id !== driverId && user.role !== Role.ADMIN) {
      throw new ForbiddenException(createApiError('NOT_OWNER', ORDER_ERRORS));
    }

    const where: Prisma.OrderWhereInput = { driverId };
    switch (filter) {
      case 'active':
        where.status = { in: [OrderStatus.DRIVER_ACCEPTED, OrderStatus.PICKED_UP] };
        break;
      case 'finished':
        where.status = OrderStatus.DELIVERED;
        break;
      case 'cancelled':
        where.status = OrderStatus.CANCELLED;
        break;
    }

    return this.prisma.order.findMany({
      where,
      select: {
        id: true,
        storeId: true,
        merchantId: true,
        customerName: true,
        dropOffAddress: true,
        status: true,
        createdAt: true,
        acceptedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }) as Promise<ListDriverOrdersResponseDto[]>;
  }

  async acceptOrder(user: AuthenticatedUser, driverId: string, orderId: string) {
    await this.existsDriver(driverId);
    if (user.id !== driverId) {
      throw new ForbiddenException(createApiError('NOT_OWNER', ORDER_ERRORS));
    }

    const result = await this.prisma.order.updateMany({
      where: {
        id: orderId,
        status: OrderStatus.SEARCHING_DRIVER,
        driverId: null,
      },
      data: {
        driverId,
        status: OrderStatus.DRIVER_ACCEPTED,
        acceptedAt: new Date(),
      },
    });

    if (result.count === 0) {
      await this.existsOrder(orderId);
      throw new ConflictException(createApiError('ORDER_ALREADY_TAKEN', ORDER_ERRORS));
    }

    return { message: "Commande acceptee avec succes" };
  }
}
