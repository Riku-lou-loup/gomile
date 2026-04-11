import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsDateString,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  IsPhoneNumber,
} from 'class-validator';
import { Gender, VehicleType } from '@prisma/client';

export class RegisterDriverDto {
  @ApiProperty({ example: 'driver@test.local' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8, example: 'Password123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Riku' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Loulou' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+33612345678' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ example: '1998-05-12' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ example: '22 boulevard Clemenceau, 38000 Grenoble' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Grenoble' })
  @IsString()
  deliveryCity: string;

  @ApiProperty({ example: 15 })
  @IsInt()
  @Min(1)
  deliveryRadius: number;

  @ApiProperty({ enum: VehicleType, example: VehicleType.BIKE })
  @IsEnum(VehicleType)
  transportType: VehicleType;

  
  @ApiProperty({ example: '12345678900012', required: false })
  @IsString()
  @IsOptional()
  siret?: string;
}
