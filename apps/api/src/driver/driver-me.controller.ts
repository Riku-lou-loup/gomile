import {
  HttpCode,
  Post,
  Get,
  Patch,
  Controller,
  Param,
  HttpStatus,
  Body,
  UseGuards,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiTooManyRequestsResponse,
} from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { OrderLivreursService } from "../order/livreurs/order-livreurs.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/auth.types";
import { HandshakeDto } from "../order/dto/handshake.dto";
import { DriverMeService } from "./driver-me.service";
import { DriverPositionDto } from "./dto/driver-position.dto";

@ApiTags('[Mobile] Driver')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DRIVER)
@Controller('driver/me')
export class DriverMeController {
  constructor(
    private readonly orderLivreursService: OrderLivreursService,
    private readonly driverMeService: DriverMeService,
  ) {}

  @ApiOperation({ summary: "Get available missions nearby", description: "Returns orders in SEARCHING_DRIVER status within the driver's delivery radius using PostGIS." })
  @ApiOkResponse({ description: 'List of nearby available missions' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT' })
  @ApiNotFoundResponse({ description: 'Driver not found' })
  @Get('missions/available')
  @HttpCode(HttpStatus.OK)
  async availableMissions(@CurrentUser() user: AuthenticatedUser) {
    return this.driverMeService.availableOrders(user);
  }

  @ApiOperation({ summary: "Accept an available mission", description: "Atomically claims an order in SEARCHING_DRIVER status. Returns 409 if another driver accepted it first." })
  @ApiOkResponse({ description: 'Mission accepted successfully', schema: { properties: { message: { type: 'string' } } } })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT' })
  @ApiNotFoundResponse({ description: 'Mission not found' })
  @ApiConflictResponse({ description: 'Mission was already accepted by another driver' })
  @Post('missions/:missionId/accept')
  @HttpCode(HttpStatus.OK)
  async acceptMission(
    @Param('missionId') missionId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.orderLivreursService.acceptOrder(user, user.id, missionId);
  }

  @ApiOperation({ summary: "Pick up a mission (handshake A — merchant code)", description: "Merchant provides driver a code, driver must enter it to validate pick up. 3 attempts allowed." })
  @ApiOkResponse({ description: 'Mission picked up successfully', schema: { properties: { orderId: { type: 'string' }, message: { type: 'string' } } } })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT' })
  @ApiNotFoundResponse({ description: 'Mission not found' })
  @ApiConflictResponse({ description: 'Mission already picked up or cancelled' })
  @ApiInternalServerErrorResponse({ description: 'Bad order state' })
  @ApiTooManyRequestsResponse({ description: 'Too many incorrect code attempts (3 allowed)' })
  @Post('missions/:missionId/handshake/merchant/verify')
  @HttpCode(HttpStatus.OK)
  async pickupMission(
    @Param('missionId') missionId: string,
    @Body() dto: HandshakeDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.orderLivreursService.pickupOrder(user, user.id, missionId, dto.code);
  }

  @ApiOperation({ summary: "Deliver a mission (handshake B — customer code)", description: "Customer receives a code, driver must enter it to validate delivery." })
  @ApiOkResponse({ description: 'Mission delivered successfully', schema: { properties: { orderId: { type: 'string' }, message: { type: 'string' } } } })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT' })
  @ApiNotFoundResponse({ description: 'Mission not found' })
  @ApiConflictResponse({ description: 'Mission already delivered or cancelled' })
  @ApiInternalServerErrorResponse({ description: 'Bad order state' })
  @ApiTooManyRequestsResponse({ description: 'Too many incorrect code attempts (3 allowed)' })
  @Post('missions/:missionId/handshake/client/verify')
  @HttpCode(HttpStatus.OK)
  async deliverMission(
    @Param('missionId') missionId: string,
    @Body() dto: HandshakeDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.orderLivreursService.deliverOrder(user, user.id, missionId, dto.code);
  }

  @ApiOperation({ summary: "Update driver position", description: "Syncs driver lat/lng and PostGIS location. Should be called frequently while driver is online." })
  @ApiOkResponse({ description: 'Position updated', schema: { properties: { message: { type: 'string' } } } })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT' })
  @ApiNotFoundResponse({ description: 'Driver not found' })
  @Patch('location')
  @HttpCode(HttpStatus.OK)
  async updateLocation(
    @Body() dto: DriverPositionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.driverMeService.updateDriverPosition(user, dto.latitude, dto.longitude);
  }
}
