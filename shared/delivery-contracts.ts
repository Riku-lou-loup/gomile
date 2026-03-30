export interface AddressInput {
    fullAddress: string;
    streetNumber?: string;
    streetName?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
}

export interface DeliveryEstimateInput{
    pickupAddress: string;
    dropoffAddress: string;
    weightGrams: number;
    lengthCm?: number;
    widthCm?: number;
    heightCm?: number;
}

export interface DeliveryEstimateResponse{
    serviceable: boolean;
    distanceMeters: number;
    durationSeconds: number;
    estimatedPriceCentimes: number;
    currency: string;
    breakdown: {
        baseFeeCentimes: number;
        distanceFeeCentimes: number;
        heavyParcelSurchargeCentimes: number;
    };
}
