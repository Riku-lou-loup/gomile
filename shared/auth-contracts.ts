// Shared auth contracts reused by backend, web, and mobile clients.
export const APP_ROLES = [
  'ADMIN',
  'DRIVER',
  'CUSTOMER',
  'MERCHANT',
] as const;

export type Role = (typeof APP_ROLES)[number];

export const APP_GENDERS = [
  'MALE',
  'FEMALE',
    'UNDEFINED'
] as const;

export type Gender = (typeof APP_GENDERS)[number];

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

export interface AuthSession {
  user: AuthUser;
}

// Raw backend auth response before a platform-specific client stores tokens.
export interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface LogoutResponse {
  message: string;
}

export interface RegisterMerchantInput {
  email: string;
  password: string;
  name: string;
}

export interface RegisterDriverInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  gender: Gender;
  phone: string;
  documentUrl?: string; // optional, perhaps, user can submit kyc later
  dateOfBirth: string;
  address: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
