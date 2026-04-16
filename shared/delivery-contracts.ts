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
    pickupAddress: AddressInput;
    dropoffAddress: AddressInput;
    weightGrams: number;
    lengthCm?: number;
    widthCm?: number;
    heightCm?: number;
}

export interface DeliveryEstimateResponse{
    serviceable: boolean;
    distanceMeters: number;
    durationSeconds: number;
    estimatedPriceCents: number;
    currency: string;
    breakdown: {
        baseFeeCents: number;
        distanceFeeCents: number;
        heavyParcelSurchargeCents: number;
    };

}
