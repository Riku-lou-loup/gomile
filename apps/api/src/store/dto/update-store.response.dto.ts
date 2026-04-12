import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";


export class UpdateStoreResponseDto {
  @ApiProperty({description: 'Name of the store updated', type: 'string'})
  @IsString()
  name: string

  @ApiProperty({description: 'Identifiant of the store', type: 'string'})
  @IsString()
  id: string

  @ApiProperty({description: 'Message', type: 'string'})
  @IsString()
  message: string
}