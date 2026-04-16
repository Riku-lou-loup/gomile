import { Module } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';

@Module({
  controllers: [KycController],
  providers: [KycService, RolesGuard],
})
export class KycModule {}
