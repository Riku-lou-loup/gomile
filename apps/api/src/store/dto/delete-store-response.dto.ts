import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class DeleteStoreResponseDto {
  @ApiProperty({description: 'Message', type: 'string'})
  @IsString()
  message: string
}