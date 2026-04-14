import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Param,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiNotFoundResponse, ApiForbiddenResponse, ApiUnauthorizedResponse, ApiConflictResponse } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../auth/auth.types";
import { OrderLivreursService } from "./order-livreurs.service";
import { ListDriverOrdersResponseDto } from "../dto/list-livreurs-orders-response";

@ApiTags('Order/Livreurs')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/livreurs/:driverId')
export class OrderLivreursController {
  constructor(private readonly orderLivreursService: OrderLivreursService) {}

  @ApiOperation({ summary: "List orders for a driver", description: "Filter by status group: active (accepted/picked up), finished (delivered), or cancelled. Returns all orders if no filter provided." })
  @ApiQuery({ name: 'filter', required: false, enum: ['active', 'finished', 'cancelled'], description: 'Filter orders by status group' })
  @ApiOkResponse({ type: ListDriverOrdersResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT' })
  @ApiForbiddenResponse({ description: 'Authenticated user does not own this driver account' })
  @ApiNotFoundResponse({ description: 'Driver not found' })
  @Roles(Role.DRIVER, Role.ADMIN)
  @Get('/orders')
  @HttpCode(HttpStatus.OK)
  async listOrders(
    @Param('driverId') driverId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Query('filter') filter?: 'active' | 'finished' | 'cancelled',
  ) {
    return this.orderLivreursService.listDriverOrders(user, driverId, filter);
  }

  @ApiOperation({ summary: "Accept an available order", description: "Atomically claims an order in SEARCHING_DRIVER status. Returns 409 if another driver accepted it first." })
  @ApiOkResponse({ description: 'Order accepted successfully', schema: { properties: { message: { type: 'string' } } } })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT' })
  @ApiForbiddenResponse({ description: 'Authenticated user does not own this driver account' })
  @ApiNotFoundResponse({ description: 'Driver or order not found' })
  @ApiConflictResponse({ description: 'Order was already accepted by another driver' })
  @Roles(Role.DRIVER)
  @Post('/orders/:orderId/accept')
  @HttpCode(HttpStatus.OK)
  async acceptOrder(
    @Param('driverId') driverId: string,
    @Param('orderId') orderId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.orderLivreursService.acceptOrder(user, driverId, orderId);
  }
}
