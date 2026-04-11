import { ApiProperty } from '@nestjs/swagger';
import { AUTH_MESSAGES } from '../auth-messages';
import { format } from 'path';

export class CreateApiKeyResponseDto {
    @ApiProperty({
        format: 'uuid',
        example: '0f7b36cf-b12a-4d2b-9cb5-6d4d7f934112',
    })
    id: string;

    @ApiProperty({
        example: 'Magasin de Ousmanne',
    })
    name: string;

    @ApiProperty({ 
        example: 'my-api-key-123456'
    })
    apiKey: string;

    @ApiProperty({
        format: 'date-time',
        example: '2026-01-01T06:56:54.240Z',
    })
    createdAt: Date;
}