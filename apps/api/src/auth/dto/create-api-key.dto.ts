import { ApiAcceptedResponse } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ApiOperation } from "@nestjs/swagger";
import { ApiHeader } from "@nestjs/swagger";



export class CreateApiKeyDto {
    @ApiProperty({ example: 'Magasin de Ousmanne' })
    @IsString()
    name: string;
}