import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderResponseDto {
  @ApiProperty({description : 'Order ID', type: 'string'})
  orderId: string;

  @ApiProperty({description: 'Handshake pickup code to show to merchant', type: 'string'})
  pickupCode: string;

  @ApiProperty({description: 'Delivery code to send to customer', type: 'string'})
  deliveryCode: string;

  @ApiProperty({description : 'Message', type: 'string'})
  message: string;
}