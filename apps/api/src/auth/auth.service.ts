import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentType, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID, randomBytes } from 'crypto';
import { RegisterMerchantDto } from './dto/register-merchant.dto';
import { RegisterDriverDto } from './dto/register-driver.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './auth.types';
import { createApiError } from '../common/api-error';
import { AUTH_MESSAGES } from './auth-messages';
import { AUTH_ERRORS } from './auth-errors';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerMerchant(dto: RegisterMerchantDto): Promise<AuthResponse> {
    await this.checkEmailAvailable(dto.email);
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        password: hashedPassword,
        role: Role.MERCHANT,
        merchant: {
          create: { name: dto.name },
        },
      },
    });

    return this.generateAndSaveTokens(user.id, user.email, user.role);
  }

  async registerDriver(dto: RegisterDriverDto): Promise<AuthResponse> {
    await this.checkEmailAvailable(dto.email);
    await this.checkPhoneAvailable(dto.phone);
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const gomileCode = await this.generateUniqueGomileCode();

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        password: hashedPassword,
        role: Role.DRIVER,
        driver: {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            dateOfBirth: new Date(dto.dateOfBirth),
            gender: dto.gender,
            avatarUrl: dto.avatarUrl,
            address: dto.address,
            city: dto.city,
            zipCode: dto.zipCode,
            street: dto.street,
            equipments: dto.equipments ?? [],
            deliveryCity: dto.deliveryCity,
            deliveryRadius: dto.deliveryRadius,
            transportType: dto.transportType,
            siret: dto.siret,
            gomileCode,
          },
        },
      },
    });

    // Create DriverDocument records for any provided file URLs
    const documents: { type: DocumentType; url: string }[] = [];
    if (dto.cniFile) documents.push({ type: DocumentType.CNI, url: dto.cniFile });
    if (dto.justificatifFile) documents.push({ type: DocumentType.OTHER, url: dto.justificatifFile });
    if (dto.permisFile) documents.push({ type: DocumentType.DRIVING_LICENSE, url: dto.permisFile });
    if (dto.carteGriseFile) documents.push({ type: DocumentType.REGISTRATION_CARD, url: dto.carteGriseFile });
    if (dto.kbisFile) documents.push({ type: DocumentType.OTHER, url: dto.kbisFile });
    if (dto.ribFile) documents.push({ type: DocumentType.RIB, url: dto.ribFile });

    if (documents.length > 0) {
      await this.prisma.driverDocument.createMany({
        data: documents.map(doc => ({ ...doc, driverId: user.id })),
      });
    }

    return this.generateAndSaveTokens(user.id, user.email, user.role);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = this.isEmail(dto.identifier)
      ? await this.prisma.user.findUnique({
          where: { email: dto.identifier.toLowerCase() },
        })
      : await this.prisma.user.findUnique({
          where: { phone: dto.identifier },
        });

    if (!user)
      throw new UnauthorizedException(createApiError('INVALID_CREDENTIALS', AUTH_ERRORS));

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch)
      throw new UnauthorizedException(createApiError('INVALID_CREDENTIALS', AUTH_ERRORS));

    return this.generateAndSaveTokens(user.id, user.email, user.role);
  }

  async refresh(
    userId: string,
    email: string,
    role: Role,
  ): Promise<AuthResponse> {
    return this.generateAndSaveTokens(userId, email, role);
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { message: AUTH_MESSAGES.LOGOUT_SUCCESS };
  }

  // Check if the string is an email
  private isEmail(identifier: string):boolean {
    return identifier.includes('@');
  }
  // Check if email is available
  private async checkEmailAvailable(email: string) {
    if (!this.isEmail(email)) {
      throw new BadRequestException(createApiError('INVALID_EMAIL', AUTH_ERRORS));
    }
    const existing = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) throw new ConflictException(createApiError('EMAIL_ALREADY_USED', AUTH_ERRORS));
  }

  // Check if phone number is available
  private async checkPhoneAvailable(phone: string) {
    const existing = await this.prisma.user.findUnique({ where: { phone } });
    if (existing) throw new ConflictException(createApiError('PHONE_ALREADY_USED', AUTH_ERRORS));
  }

  private async generateUniqueGomileCode(): Promise<string> {
    const year = new Date().getFullYear();
    while (true) {
      const suffix = randomBytes(3).toString('hex').toUpperCase();
      const code = `GM-${suffix}-${year}`;
      const existing = await this.prisma.driver.findUnique({
        where: { gomileCode: code },
      });
      if (!existing) return code;
    }
  }

  private async generateAndSaveTokens(
    userId: string,
    email: string,
    role: Role,
  ): Promise<AuthResponse> {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
        jwtid: randomUUID(),
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
        jwtid: randomUUID(),
      }),
    ]);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: { id: userId, email, role },
    };
  }
}
