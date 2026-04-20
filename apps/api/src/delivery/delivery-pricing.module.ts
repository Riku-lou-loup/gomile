import { Module } from '@nestjs/common';
import { DeliveryPricingController } from './delivery-pricing.controller';
import { DeliveryPricingService } from './delivery-pricing.service';
import { OpenRouteService } from './openrouteservice.service';
import { ApiKeyService } from '../auth/api-key.service';

@Module({
  controllers: [DeliveryPricingController],
  providers: [DeliveryPricingService, OpenRouteService, ApiKeyService],
  exports: [DeliveryPricingService, OpenRouteService],
})
export class DeliveryPricingModule {}
