import { ApiProperty } from "@nestjs/swagger";

export class GetOrderResponseDto {
  @ApiProperty({description : "Order ID", type: 'string'})
  orderId : string;

  @ApiProperty({description: "Store ID where the order was ordered", type : 'string'})
  storeId: string;

  @ApiProperty({description: "Driver ID taking this order", required: false, type: 'string'})
  driverId: string | null;

  @ApiProperty({description: "Customer's name", type: 'string'})
  customerName: string;

  @ApiProperty({description: "Customer's phone number", type: 'string'})
  customerPhone: string;

  @ApiProperty({description: "Customer's address", type: 'string'})
  dropOffAddress: string;

  @ApiProperty({description: "Date created", type: 'string'})
  createdAt: Date;

  @ApiProperty({description: "Date accepted", type: 'string', required: false, nullable: true})
  acceptedAt: Date | null;

  @ApiProperty({description: "Date picked up", type: 'string', required: false, nullable: true})
  pickedUpAt: Date | null;

  @ApiProperty({description: "Date delivered", type: 'string', required: false, nullable: true})
  deliveredAt: Date | null;

  @ApiProperty({description: "Date cancelled", type: 'string', required: false, nullable: true})
  cancelledAt: Date | null;

  @ApiProperty({description: "Current status", type: 'string'})
  status: string;

}