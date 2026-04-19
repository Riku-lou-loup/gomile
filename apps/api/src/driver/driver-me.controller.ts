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
import { Role, VehicleType } from "@prisma/client";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { OrderLivreursService } from "../order/livreurs/order-livreurs.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/auth.types";
import { HandshakeDto } from "../order/dto/handshake.dto";
import { DriverMeService } from "./driver-me.service";
import { DriverPositionDto } from "./dto/driver-position.dto";
import { DriverProfileResponseDto } from "./dto/driver-profile-response.dto";
import { UpdateDriverProfileDto } from "./dto/update-driver-profile.dto";
import { SessionVehicleDto } from "./dto/session-vehicle.dto";
import { KycService } from "../kyc/kyc.service";
import { SubmitKycDto } from "../kyc/dto/submit-kyc.dto";

@ApiTags('[Mobile] Driver')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DRIVER)
@Controller('driver/me')
export class DriverMeController {
  constructor(
    private readonly orderLivreursService: OrderLivreursService,
    private readonly driverMeService: DriverMeService,
    private readonly kycService: KycService,
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

  @ApiOperation({ summary: "Update driver status", description: "If the driver was available, update the driver status to offline and vice versa. A driver with an ongoing order (busy) cannot change its status." })
  @ApiOkResponse({ description: 'Current status of the driver after the toggle', schema: { properties: { message : { type: 'string' } } } })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT'})
  @ApiConflictResponse({ description: 'Driver with ongoing orders cannot change its status'})
  @Patch('availability')
  @HttpCode(HttpStatus.OK)
  async toggleDriverStatus(
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.driverMeService.toggleDriverAvailability(user)
  }

  @ApiOperation({ summary: "Get active missions", description: "Returns missions currently in DRIVER_ACCEPTED or PICKED_UP status." })
  @ApiOkResponse({ description: 'List of active missions' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT' })
  @ApiNotFoundResponse({ description: 'Driver not found' })
  @Get('missions/active')
  @HttpCode(HttpStatus.OK)
  async getActiveMissions(@CurrentUser() user: AuthenticatedUser) {
    return this.driverMeService.getActiveOrders(user);
  }

  @ApiOperation({ summary: "Get missions history", description: "Returns missions in DELIVERED or CANCELLED status." })
  @ApiOkResponse({ description: 'List of past missions' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT' })
  @ApiNotFoundResponse({ description: 'Driver not found' })
  @Get('missions/history')
  @HttpCode(HttpStatus.OK)
  async getMissionsHistory(@CurrentUser() user: AuthenticatedUser) {
    return this.driverMeService.getPastOrders(user);
  }

  @ApiOperation({ summary: "Get driver profile" })
  @ApiOkResponse({ type: DriverProfileResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT' })
  @ApiNotFoundResponse({ description: 'Driver not found' })
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.driverMeService.getDriverProfile(user);
  }

  @ApiOperation({ summary: "Update driver profile", description: "Changing address fields will reset KYC status to NOT_SUBMITTED." })
  @ApiOkResponse({ schema: { properties: { message: { type: 'string' } } } })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT' })
  @ApiNotFoundResponse({ description: 'Driver not found' })
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Body() dto: UpdateDriverProfileDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.driverMeService.updateDriverProfile(user, dto);
  }

  @ApiOperation({ summary: "Update driver session vehicle "})
  @ApiOkResponse({ schema: { properties: { activeVehicle: {type: 'string', enum: Object.values(VehicleType)}}}})
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT' })
  @ApiNotFoundResponse({ description: 'Driver not found' })
  @Patch('session-vehicle')
  @HttpCode(HttpStatus.OK)
  async updateSessionVehicle(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SessionVehicleDto
  ) {
    return this.driverMeService.updateSessionVehicle(user, dto);
  }

  @ApiOperation({ summary: "Submit KYC documents", description: "Driver submits a document URL for KYC review. Sets kycStatus to PENDING. Rejected if a submission is already pending." })
  @ApiOkResponse({ schema: { properties: { message: { type: 'string' } } } })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT' })
  @ApiNotFoundResponse({ description: 'Driver not found' })
  @ApiConflictResponse({ description: 'A KYC submission is already pending review' })
  @Post('kyc')
  @HttpCode(HttpStatus.OK)
  async submitKyc(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SubmitKycDto,
  ) {
    return this.kycService.submitKyc(user.id, dto.documentUrl);
  }
}
