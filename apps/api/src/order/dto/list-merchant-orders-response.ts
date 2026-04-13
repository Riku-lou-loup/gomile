import { ApiProperty } from "@nestjs/swagger";

export class ListMerchantOrdersResponseDto {

  @ApiProperty({ description: "Order ID", type: 'string' })
  id: string;

  @ApiProperty({description: "Store ID where the order was placed", type : 'string'})
  storeId: string;

  @ApiProperty({description: "Driver ID taking this order", required: false, type: 'string'})
  driverId: string | null;

  @ApiProperty({description: "Customer's name", type: 'string'})
  customerName: string;

  @ApiProperty({description: "Customer's address", type: 'string'})
  dropOffAddress: string;

  @ApiProperty({description: "Date created", type: 'string'})
  createdAt: Date;

  @ApiProperty({description: "Current status", type: 'string'})
  status: string;

}