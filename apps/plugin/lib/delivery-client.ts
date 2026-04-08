import type {
    DeliveryEstimateInput,
    DeliveryEstimateResponse,
} from '../../../shared/delivery-contracts'

export class DeliveryClient {
    constructor (private readonly baseUrl: string, private readonly apiKey: string) {}

    async estimate(input: DeliveryEstimateInput): Promise<DeliveryEstimateResponse> {
        const response = await fetch(`${this.baseUrl}/delivery-estimates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
            },
            body: JSON.stringify(input),
        });
        
        if (!response.ok) {
            throw new Error(`Failed to get delivery estimate: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    }
}