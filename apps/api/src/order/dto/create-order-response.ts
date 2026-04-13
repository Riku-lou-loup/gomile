import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderResponseDto {
  @ApiProperty({description : 'Order ID', type: 'string'})
  orderId: string;

  @ApiProperty({description : 'Message', type: 'string'})
  message: string;
}