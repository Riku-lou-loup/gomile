import type {
    DeliveryEstimateInput,
    DeliveryEstimateResponse
} from "../../../shared/delivery-contracts";

export class DeliveryClient {
    constructor(
        private readonly baseUrl: string,
        private readonly apiKey: string,
    ) {

    }

    async estimateDelivery (
        input: DeliveryEstimateInput,
    ): Promise<DeliveryEstimateResponse> {
        const response = await fetch(`${this.baseUrl}/estimateDelivery`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}`}:{}),
            },
            body: JSON.stringify({input})
        });

        if (!response.ok) {
            throw new Error(`${response.status} Delivery estimate failed`);
        }

        return response.json();
    }
}