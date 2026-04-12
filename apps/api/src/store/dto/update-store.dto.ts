import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsOptional, IsNumber, IsString, ValidateNested, IsNotEmpty } from "class-validator";


export class UpdateStoreDto {
    @ApiProperty({ description: "The name of the store" , example: "Riku's pet shop", type: 'string'})
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty({ description: "The description of the store", required: false, type: 'string' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: "Address of the store", example: "25 boulevard Clémenceau, 38100 Grenoblel" , type: 'string'})
    @IsString()
    @IsOptional()
    address: string;

    @ApiProperty({ description: "The latitude of the store's location", example: 45.188529 , type: 'number'})
    @IsNumber()
    @IsOptional()
    latitude: number;

    @ApiProperty({ description: "The longitude of the store's location", example: 5.724524 , type: 'number'})
    @IsNumber()
    @IsOptional()
    longitude: number;
}