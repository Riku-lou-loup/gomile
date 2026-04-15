import { Body, Controller, Post } from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeliveryEstimateDto } from './dto/delivery-estimate.dto';
import { DeliveryPricingService } from './delivery-pricing.service';
import { OpenRouteService } from './openrouteservice.service';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { UseGuards } from '@nestjs/common';

@ApiTags('delivery-pricing')
@Controller()
export class DeliveryPricingController {
  constructor(
    private readonly openRouteService: OpenRouteService,
    private readonly deliveryPricingService: DeliveryPricingService,
  ) {}

  @ApiOperation({ summary: 'Estimate delivery cost' })
  @ApiHeader({ 
    name: 'x-api-key', 
    description: 'API key for authentication',
    required: true,
  })
  @ApiOkResponse({ description: 'Delivery estimate calculated successfully' })
  @UseGuards(ApiKeyGuard)
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
