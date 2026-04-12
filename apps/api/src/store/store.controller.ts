import {
  Body,
  UseGuards,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Patch,
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { StoreService } from './store.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateStoreDto } from './dto/create-store.dto';
import { CreateStoreResponseDto } from './dto/create-store-response.dto';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateStoreDto } from './dto/update-store.dto';
import { UpdateStoreResponseDto } from './dto/update-store.response.dto';
@ApiTags('Store')
@Controller('merchants/:merchantId/stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {
  } 

  @ApiOperation({summary: 'Create a store for a given Marchant'})
  @ApiOkResponse({type: CreateStoreDto})
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.MERCHANT)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createStore(    
    @Param('merchantId') merchantId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateStoreDto
    ): Promise<CreateStoreResponseDto> {
      return await this.storeService.createStore(user, merchantId, dto);
  }

  @ApiOperation({summary: 'Update a store'})
  @ApiOkResponse({type: UpdateStoreDto})
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.MERCHANT)
  @Patch(':storeId')
  async updateStore(
    @Param('merchantId')  merchantId: string,
    @Param('storeId')  storeId: string,
    @CurrentUser() user : AuthenticatedUser,
    @Body() dto : UpdateStoreDto
  ) : Promise<UpdateStoreResponseDto>{
    return this.storeService.updateStore(user, merchantId, storeId, dto);
  }

  @ApiOperation({summary: 'Disable a store (no longer accepts services)'})
  @ApiOkResponse({type: UpdateStoreDto})
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.MERCHANT)
  @Post(':storeId/disable')
  @HttpCode(HttpStatus.OK)
  async disableStore(
    @Param('merchantId')  merchantId: string,
    @Param('storeId')  storeId: string,
    @CurrentUser() user : AuthenticatedUser,
  ) : Promise<UpdateStoreResponseDto>{
    return this.storeService.disableStore(user, merchantId, storeId);
  }

  @ApiOperation({summary: 'Re-enable a store'})
  @ApiOkResponse({type: UpdateStoreDto})
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.MERCHANT)
  @Post(':storeId/enable')
  @HttpCode(HttpStatus.OK)
  async enableStore(
    @Param('merchantId')  merchantId: string,
    @Param('storeId')  storeId: string,
    @CurrentUser() user : AuthenticatedUser,
  ) : Promise<UpdateStoreResponseDto>{
    return this.storeService.enableStore(user, merchantId, storeId);
  }

  @ApiOperation({summary: 'Delete a store'})
  @ApiOkResponse()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.MERCHANT)
  @Delete(':storeId')
  @HttpCode(HttpStatus.OK)
  async deleteStore(
    @Param('merchantId') merchantId: string,
    @Param('storeId') storeId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.storeService.deleteStore(user, merchantId, storeId);
  }

  @ApiOperation({summary: 'List all stores for a merchant'})
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiOkResponse()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.MERCHANT)
  @Get()
  @HttpCode(HttpStatus.OK)

  async listStores(
    @Param('merchantId') merchantId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Query('isActive') isActive?: string,
  ) {
    const filter = isActive === undefined ? undefined : isActive === 'true';
    return this.storeService.listStore(user, merchantId, filter);
  }

  @ApiOperation({summary: 'Retrieve a specific store'})
  @ApiOkResponse()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.MERCHANT)
  @Get(':storeId')
  @HttpCode(HttpStatus.OK)
  async getStore(
    @Param('merchantId') merchantId: string,
    @Param('storeId') storeId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.storeService.getStore(user, merchantId, storeId);
  }
}