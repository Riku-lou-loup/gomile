import { 
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Param,
  Body,

 } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiHeader, ApiOkResponse } from "@nestjs/swagger";
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { ApiKeyGuard } from "../../auth/guards/api-key.guard"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CreateOrderDto } from "../dto/create-order.dto";
import { CreateOrderResponseDto } from "../dto/create-order-response";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "@prisma/client";
import type { AuthenticatedUser } from "../../auth/auth.types";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { OrderService } from "./order-merchants.service";
import { JwtOrApiKeyGuard } from "../../auth/guards/jwt-or-api-key.guard";
import { GetOrderResponseDto } from "../dto/get-order-response.dto";
import { ListMerchantOrdersResponseDto } from "../dto/list-merchant-orders-response";

@ApiTags('Order/Merchant')
@Controller('/merchants/:merchantId')
export class OrderMerchantsController {

  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({summary: 'Create an order'})
  @ApiBody({type: CreateOrderDto})
  @ApiCreatedResponse({type: CreateOrderResponseDto})
  @UseGuards(JwtOrApiKeyGuard, RolesGuard)
  @Roles(Role.MERCHANT)
  @Post('/stores/:storeId/orders')
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @Param('storeId') storeId: string,
    @Param('merchantId') merchantId: string,
    @Body() dto: CreateOrderDto,
    @CurrentUser() user : AuthenticatedUser
  ) {
    return this.orderService.createOrder(user, storeId, merchantId, dto);
  }

  @ApiOperation({summary: 'Retrieve all orders from a given merchant'})
  @ApiOkResponse({type: ListMerchantOrdersResponseDto, isArray: true})
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.MERCHANT, Role.ADMIN)
  @Get('/orders')
  @HttpCode(HttpStatus.OK)
  async listOrders(
    @Param('merchantId') merchantId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.orderService.getMerchantOrders(user, merchantId);
  }

  @ApiOperation({summary: 'Retrieve a specific order from a given merchant'})
  @ApiOkResponse({type: GetOrderResponseDto})
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.MERCHANT)
  @Get('/orders/:orderId')
  @HttpCode(HttpStatus.OK)
  async getOrder(
    @Param('merchantId') merchantId: string,
    @Param('orderId') orderId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.orderService.getOrder(user, merchantId, orderId);
  }

  @ApiOperation({summary: 'Cancel a specific order from a given merchant'})
  @ApiOkResponse({type: GetOrderResponseDto})
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(Role.MERCHANT)
  @Post('/orders/:orderId/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelOrder(
    @Param('merchantId') merchantId: string,
    @Param('orderId') orderId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.orderService.cancelOrder(user, merchantId, orderId);
  }

}
