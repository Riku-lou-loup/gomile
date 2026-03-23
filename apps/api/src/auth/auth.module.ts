import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { RolesGuard } from "./guards/roles.guard";

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, RolesGuard], // adding guard provider for nest
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
