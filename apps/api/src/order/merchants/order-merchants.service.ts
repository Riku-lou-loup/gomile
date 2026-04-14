import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateOrderDto } from '../dto/create-order.dto'
import { AuthenticatedUser } from '../../auth/auth.types'
import { createApiError } from '../../common/api-error'
import { STORE_ERRORS } from '../../store/store-errors'
import { CreateOrderResponseDto } from '../dto/create-order-response'
import { ORDER_MESSAGE } from '../order-messages'
import { AUTH_ERRORS } from '../../auth/auth-errors'
import { ORDER_ERRORS } from '../order-errors'
import { GetOrderResponseDto } from '../dto/get-order-response.dto'
import { Merchant, Order, Store } from '@prisma/client'
import { Role } from '@prisma/client'
import { ListMerchantOrdersResponseDto } from '../dto/list-merchant-orders-response'
import { HandshakeType, OrderStatus } from '@prisma/client'
import { CancelOrderResponseDto } from '../dto/cancel-order-response'
import { randomInt } from 'crypto'

@Injectable()
export class OrderService  {
  constructor(private prisma: PrismaService) {
  }

  // Verify existant of the merchant
  private async existsMerchant(merchantId: string): Promise<Merchant> {
    const merchant = await this.prisma.merchant.findUnique({
      where: {
        userId : merchantId
      }
    })
    if (!merchant) {
      throw new NotFoundException(createApiError('MERCHANT_NOT_FOUND', AUTH_ERRORS))
    }
    return merchant;
  }

  // Verify existant of the store
  private async existsStore(storeId: string): Promise<Store> {
    const store = await this.prisma.store.findUnique({
      where: {
        id: storeId,
      },
    });
    if (!store) {
      throw new NotFoundException(createApiError('STORE_NOT_FOUND', STORE_ERRORS));
    };
    return store;
  }

  // Verify existant of the order
  private async existsOrder(orderId: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId
      }
    })
    if (!order) {
      throw new NotFoundException(createApiError('ORDER_NOT_FOUND', ORDER_ERRORS));
    }
    return order;
  }

  // Verify ownership of a merchant over a store
  private async verifyStoreOwnership(merchantId: string, storeId: string) {
    const response = await this.prisma.store.findFirst({
      where: { id: storeId, merchantId },
    });
    if (!response) {
      throw new ForbiddenException(createApiError('NOT_OWNER', STORE_ERRORS));
    }
    return response;
  }

  // Verify ownership of a merchant over his orders
  private async verifyOrderOwnership(merchantId: string, orderId: string) {
    const response = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        merchantId: merchantId
      }
    })
    if (!response) {
      throw new ForbiddenException(createApiError('NOT_OWNER', ORDER_ERRORS));
    }
    return response;
  }

  async createOrder(user: AuthenticatedUser | null, storeId: string, merchantId: string, dto: CreateOrderDto): Promise<CreateOrderResponseDto> {
    await this.existsMerchant(merchantId);
    if (user && user.id !== merchantId) {
      throw new ForbiddenException(createApiError('NOT_OWNER', ORDER_ERRORS));
    }
    await this.existsStore(storeId);
    await this.verifyStoreOwnership(merchantId, storeId);
    const pickupCode = randomInt(0, 1000000).toString().padStart(6, '0');
    const deliveryCode = randomInt(0, 1000000).toString().padStart(6, '0');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const order = await this.prisma.order.create({
      data: {
        merchantId,
        storeId,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        dropOffAddress: dto.dropOffAddress,
        handshakes: {
          createMany: {
            data: [
              { type: HandshakeType.A, code: pickupCode, expiresAt },
              { type: HandshakeType.B, code: deliveryCode, expiresAt },
            ],
          },
        },
      },
    });
    return {
      orderId: order.id,
      pickupCode,
      deliveryCode,
      message: ORDER_MESSAGE.ORDER_CREATED,
    };
  }

  async getMerchantOrders(user: AuthenticatedUser, merchantId: string): Promise<ListMerchantOrdersResponseDto[]> {
    await this.existsMerchant(merchantId)
    if (user.id !== merchantId && user.role !== Role.ADMIN) {
      throw new ForbiddenException(createApiError('NOT_OWNER', ORDER_ERRORS));
    }
    return await this.prisma.order.findMany({
      where: { merchantId },
      select : {
        id: true,
        storeId: true,
        status: true,
        customerName : true,
        dropOffAddress: true,
        createdAt : true,
        driverId: true
      },
      orderBy: { createdAt: 'desc' },
    }) as ListMerchantOrdersResponseDto[]
  }

  async getOrder(user: AuthenticatedUser | null, merchantId: string, orderId: string): Promise<GetOrderResponseDto> {
    await this.existsMerchant(merchantId);
    if (user && user.id !== merchantId && user.role !== Role.ADMIN) {
      throw new ForbiddenException(createApiError('NOT_OWNER', ORDER_ERRORS));
    }
    const order = await this.verifyOrderOwnership(merchantId, orderId);
    return {
      orderId: order.id,
      storeId: order.storeId,
      driverId: order.driverId,
      status: order.status,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      dropOffAddress: order.dropOffAddress,
      createdAt: order.createdAt,
      acceptedAt: order.acceptedAt,
      pickedUpAt: order.pickedUpAt,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
    };
  }

  async cancelOrder(user: AuthenticatedUser | null, merchantId: string, orderId: string): Promise<CancelOrderResponseDto> {
    await this.existsMerchant(merchantId);

    if (user && user.id !== merchantId && user.role !== Role.ADMIN) {
      throw new ForbiddenException(createApiError('NOT_OWNER', ORDER_ERRORS));
    }

    const order = await this.verifyOrderOwnership(merchantId, orderId);
    if (order.status === OrderStatus.CANCELLED) {
      throw new ConflictException(createApiError('ORDER_ALREADY_CANCELLED', ORDER_ERRORS));
    }
    if (order.status === OrderStatus.PICKED_UP || order.status === OrderStatus.DELIVERED) {
      throw new ConflictException(createApiError('ORDER_ALREADY_PICKED_UP', ORDER_ERRORS));
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });
    return {message: ORDER_MESSAGE.ORDER_CANCELLED}
  }
}