import { Injectable } from '@nestjs/common';

type PricingInput = {
  distanceMeters: number;
  durationSeconds: number;
  weightGrams: number;
};

@Injectable()
export class DeliveryPricingService {
  calculate(input: PricingInput) {
    const baseFeeCents = 50; // base
    const perStartedKmCents = 10; // per km
    const maxDistanceMeters = 10000; // delivery limits at 10km

    const extraKg = Math.max(0, input.weightGrams - 5000); // heavy parcels are thosee that weights more than 5kg
    const heavyParcelSurchargeCents =
      extraKg > 0 ? 30 + Math.ceil(extraKg / 1000) * 15 : 0; // 30 cents surcharge and 15 cents per extra kg

    const serviceable = input.distanceMeters <= maxDistanceMeters;
    const distanceFeeCents =
      Math.ceil(input.distanceMeters / 1000) * perStartedKmCents;

    const estimatedPriceCents = serviceable
      ? baseFeeCents + distanceFeeCents + heavyParcelSurchargeCents
      : 0;

    return {
      serviceable,
      distanceMeters: Math.round(input.distanceMeters),
      durationSeconds: Math.round(input.durationSeconds),
      estimatedPriceCents,
      currency: 'EUR',
      breakdown: {
        baseFeeCents,
        distanceFeeCents,
        heavyParcelSurchargeCents,
      },
    };
  }
}
