import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMimeType } from 'class-validator';

export class PresignRequestDto {
  @ApiProperty({ example: 'cni.jpg', description: 'Original filename' })
  @IsString()
  filename: string;

  @ApiProperty({ example: 'image/jpeg', description: 'MIME type of the file' })
  @IsMimeType()
  contentType: string;
}
