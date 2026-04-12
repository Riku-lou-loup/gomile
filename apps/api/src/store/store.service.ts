import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { createApiError } from '../common/api-error';
import { STORE_ERRORS } from './store-errors';
import { AUTH_ERRORS } from '../auth/auth-errors';
import { UpdateStoreResponseDto } from './dto/update-store.response.dto';
import { STORE_MESSAGES } from './store-messages';
import { CreateStoreResponseDto } from './dto/create-store-response.dto';
import { DeleteStoreResponseDto } from './dto/delete-store-response.dto';
import { AuthenticatedUser } from '../auth/auth.types';

@Injectable()
export class StoreService {
    constructor(private prisma: PrismaService) {}

  // Verify existant of the merchant
  private async existsMerchant(merchantId: string) {
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
  private async existsStore(storeId: string) {
    const store = await this.prisma.store.findUnique({
      where: {
        id: storeId,
      },
    });
    if (!store) {
      throw new NotFoundException(createApiError('STORE_NOT_FOUND', STORE_ERRORS));
    };
  }

  // Verify ownership of a merchant over a store
  private async verifyOwnership(merchantId: string, storeId: string) {
    await this.existsStore(storeId);
    const response = await this.prisma.store.findFirst({
      where: { id: storeId, merchantId },
    });
    if (!response) {
      throw new ForbiddenException(createApiError('NOT_OWNER', STORE_ERRORS));
    }
    return response;
  }

  // Create stores 
  async createStore(user: AuthenticatedUser, merchantId: string, dto: CreateStoreDto): Promise<CreateStoreResponseDto> {
    if (user.id !== merchantId) {
      throw new ForbiddenException(createApiError('NOT_OWNER', AUTH_ERRORS))
    }

    await this.existsMerchant(merchantId);
    const store = await this.prisma.store.create({
      data : {
        name: dto.name,
        description: dto.description,
        merchantId: merchantId,
        address: dto.address,
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
    });

    return {name: dto.name, id: store.id};
  }

  // Update store
  async updateStore(user: AuthenticatedUser, merchantId: string, storeId: string, dto: UpdateStoreDto): Promise<UpdateStoreResponseDto> {
    if (user.id !== merchantId) {
      throw new ForbiddenException(createApiError('NOT_OWNER', AUTH_ERRORS))
    }
    await this.verifyOwnership(merchantId, storeId);
    const response = await this.prisma.store.update ({
      where: {id : storeId},
      data: {
        name: dto.name,
        description: dto.description,
        address: dto.address,
        latitude: dto.latitude,
        longitude: dto.longitude
      },
    });
    return {name: response.name, id: response.id, message: STORE_MESSAGES.STORE_UPDATED}
  }

  // Disable store
  async disableStore(user: AuthenticatedUser, merchantId : string, storeId :string): Promise<UpdateStoreResponseDto> {
    if (user.id !== merchantId) {
      throw new ForbiddenException(createApiError('NOT_OWNER', AUTH_ERRORS))
    }
    await this.verifyOwnership(merchantId, storeId);
    const response = await this.prisma.store.update ({
      where: {
        id: storeId
      },
      data: {
        isActive: false
      }
    })
    return {name: response.name, id: storeId, message: STORE_MESSAGES.STORE_DISABLED}
  }

  // Enable store
  async enableStore(user: AuthenticatedUser, merchantId: string, storeId: string): Promise<UpdateStoreResponseDto> {
    if (user.id !== merchantId) {
      throw new ForbiddenException(createApiError('NOT_OWNER', AUTH_ERRORS))
    }
    await this.verifyOwnership(merchantId, storeId);
    const response = await this.prisma.store.update({
      where: {
        id: storeId
      },
      data: {
        isActive: true
      }
    })
    return {name: response.name, id: storeId, message: STORE_MESSAGES.STORE_ENABLED}
  }

  // Delete store
  async deleteStore(user: AuthenticatedUser, merchantId: string, storeId: string): Promise<DeleteStoreResponseDto> {
    if (user.id !== merchantId) {
      throw new ForbiddenException(createApiError('NOT_OWNER', AUTH_ERRORS))
    }
    await this.verifyOwnership(merchantId, storeId);
    await this.prisma.store.delete({
      where: {
        id: storeId
      }
    })
    return {message: STORE_MESSAGES.STORE_DELETED}
  }

  // List stores
  async listStore(user: AuthenticatedUser, merchantId: string, isActive?: boolean) {
    if (user.id !== merchantId) {
      throw new ForbiddenException(createApiError('NOT_OWNER', AUTH_ERRORS))
    }
    await this.existsMerchant(merchantId);
    return this.prisma.store.findMany({
      where: {
        merchantId,
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        _count: { select: { orders: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Get store
  async getStore(user: AuthenticatedUser, merchantId: string, storeId: string) {
    if (user.id !== merchantId) {
      throw new ForbiddenException(createApiError('NOT_OWNER', AUTH_ERRORS));
    }
    return this.verifyOwnership(merchantId, storeId);
  }
}