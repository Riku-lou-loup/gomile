import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeliveryEstimateDto } from './dto/delivery-estimate.dto';
import { DeliveryPricingService } from './delivery-pricing.service';
import { OpenRouteService } from './openrouteservice.service';

@ApiTags('delivery-pricing')
@Controller()
export class DeliveryPricingController {
  constructor(
    private readonly openRouteService: OpenRouteService,
    private readonly deliveryPricingService: DeliveryPricingService,
  ) {}

  @ApiOperation({ summary: 'Estimate delivery cost' })
  @ApiOkResponse({ description: 'Delivery estimate calculated successfully' })
  @Post('delivery-estimates')
  async estimate(@Body() dto: DeliveryEstimateDto) {
    // call api resolving addresses to retrieve lattitude et longitude
    const pickup = await this.openRouteService.resolveAddress(dto.pickupAddress);
    const dropoff = await this.openRouteService.resolveAddress(dto.dropoffAddress);

    // call api to resolve distance
    const route = await this.openRouteService.getDrivingRoute(pickup, dropoff);

    return this.deliveryPricingService.calculate({
      distanceMeters: route.distanceMeters,
      durationSeconds: route.durationSeconds,
      weightGrams: dto.weightGrams,
    });
  }
}
