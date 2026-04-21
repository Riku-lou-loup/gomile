import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateWithdrawalDto {
  @ApiProperty({ enum: ['COMPLETED', 'CANCELLED'] })
  @IsEnum(['COMPLETED', 'CANCELLED'])
  status: 'COMPLETED' | 'CANCELLED';
}
