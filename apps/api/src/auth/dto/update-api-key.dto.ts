import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateApiKeyDto {
    @ApiProperty({ description: 'New name for the API key', example: 'Production Key', type: 'string', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ description: 'New expiration date (ISO 8601)', example: '2028-01-01T00:00:00.000Z', type: 'string', required: false })
    @IsDateString()
    @IsOptional()
    expiresAt?: string;
}
