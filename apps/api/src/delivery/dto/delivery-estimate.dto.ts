import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { AddressInputDto } from './address-input.dto';

export class DeliveryEstimateDto {
  @ApiProperty({ type: AddressInputDto })
  @ValidateNested()
  @Type(() => AddressInputDto)
  pickupAddress: AddressInputDto;

  @ApiProperty({ type: AddressInputDto })
  @ValidateNested()
  @Type(() => AddressInputDto)
  dropoffAddress: AddressInputDto;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  weightGrams: number;

  @ApiProperty({ required: false, example: 20 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  lengthCm?: number;

  @ApiProperty({ required: false, example: 10 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  widthCm?: number;

  @ApiProperty({ required: false, example: 8 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  heightCm?: number;
}
