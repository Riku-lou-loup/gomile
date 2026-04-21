import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterMerchantDto } from './dto/register-merchant.dto';
import { RegisterDriverDto } from './dto/register-driver.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, LogoutResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthenticatedUser, AuthResponse } from './auth.types';

@ApiTags('[auth]')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register a merchant account' })
  @ApiBody({ type: RegisterMerchantDto })
  @ApiCreatedResponse({ type: AuthResponseDto })
  @ApiConflictResponse({ description: 'Email déjà utilisé' })
  @Post('register/merchant')
  registerMerchant(@Body() dto: RegisterMerchantDto): Promise<AuthResponse> {
    return this.authService.registerMerchant(dto);
  }

  @ApiOperation({ summary: 'Register a driver account' })
  @ApiBody({ type: RegisterDriverDto })
  @ApiCreatedResponse({ type: AuthResponseDto })
  @ApiConflictResponse({ description: 'Email déjà utilisé' })
  @Post('register/driver')
  registerDriver(@Body() dto: RegisterDriverDto): Promise<AuthResponse> {
    return this.authService.registerDriver(dto);
  }

  @ApiOperation({ summary: 'Log in with email and password', description: 'Returns access and refresh tokens. On the web platform, tokens are stored as httpOnly cookies by the BFF, the response body only contains the user object. Mobile clients receive tokens directly in the response body.' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Identifiants invalides' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Refresh access and refresh tokens', description: 'On the web platform, the refresh token is read from an httpOnly cookie by the BFF — no Authorization header needed from the browser. Mobile clients must send the refresh token as a Bearer token.' })
  @ApiBearerAuth('refresh-token')
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Refresh token invalide' })
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@CurrentUser() user: AuthenticatedUser): Promise<AuthResponse> {
    return this.authService.refresh(user.id, user.email, user.role);
  }

  @ApiOperation({ summary: 'Log out the current user', description: 'On the web platform, the access token is read from an httpOnly cookie by the BFF and both cookies are cleared on response. Mobile clients must send the access token as a Bearer token.' })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: LogoutResponseDto })
  @ApiUnauthorizedResponse({ description: 'Access token invalide' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.logout(user.id);
  }
}
