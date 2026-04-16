import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString } from "class-validator";

export class CreateOrderDto {
  @ApiProperty ({
    description: 'Customer name',
    type : 'string',
    example: 'Dang Khoa'
  })
  @IsString()
  customerName: string;

  @ApiProperty ({
    description: 'Customer phone number',
    type : 'string',
    example: '+33 633051129'
  })
  @IsPhoneNumber()
  customerPhone: string;

  @ApiProperty({
    description: 'Customer dropoff address',
    type: 'string',
    example: '25 boulevard Clemenceau, 38100 Grenoble'
  })
  @IsString()
  dropOffAddress: string
}