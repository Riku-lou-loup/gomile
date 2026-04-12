import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";


export class CreateStoreResponseDto {
  @ApiProperty({description: 'Name of the store created', type: 'string', example: 'M&M Grenoble'})
  @IsString()
  name: string

  @ApiProperty({description: 'Identifiant of the store', type: 'string', example: 'e12dq2fad-fe123edf2-dfasd132'})
  @IsString()
  id: string
}