import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class SubmitKycDto {
  @ApiProperty({ description: 'S3 URL of the uploaded KYC document', example: 'https://bucket.s3.region.amazonaws.com/uploads/uuid.pdf' })
  @IsUrl()
  documentUrl: string;
}
