import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateStoreDto {
    @ApiProperty({ description: "The name of the store" , example: "Riku's pet shop", type: 'string'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: "The description of the store", required: false , type: 'string'})
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: "Address of the store", example: "25 boulevard Clémenceau, 38100 Grenoblel", type:'string'})
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ description: "The latitude of the store's location", example: 45.188529, type: 'number'})
    @IsNumber()
    @IsNotEmpty()
    latitude: number;

    @ApiProperty({ description: "The longitude of the store's location", example: 5.724524, type: 'number'})
    @IsNumber()
    @IsNotEmpty()
    longitude: number;
}