export const AUTH_ERRORS = {
  INVALID_EMAIL: {
    statusCode: 400,
    message: 'Email invalide',
  },
  EMAIL_ALREADY_USED: {
    statusCode: 409,
    message: 'Email deja utilise',
  },
  PHONE_ALREADY_USED: {
    statusCode: 409,
    message: 'Numero de telephone deja utilise',
  },
  INVALID_CREDENTIALS: {
    statusCode: 401,
    message: 'Identifiants invalides',
  },
  INVALID_ACCESS_TOKEN: {
    statusCode: 401,
    message: "Jeton d'acces invalide",
  },
  INVALID_REFRESH_TOKEN: {
    statusCode: 401,
    message: 'Jeton de rafraichissement invalide',
  },
  INVALID_API_KEY: {
    statusCode: 401,
    message: 'Clef API invalide',
  },
  API_KEY_REVOKED: {
    statusCode: 403,
    message: 'Clef API revokee',
  },
  MERCHANT_NOT_FOUND: {
    statusCode: 404,
    message: 'Marchand non trouve',
  },
  NOT_OWNER: {
    statusCode: 403,
    message: "Vous n'etes pas le proprietaire de cette ressource",
  },
  API_KEY_NOT_FOUND: {
    statusCode: 404,
    message: 'Clef API non trouvee',
  },
  USER_NOT_FOUND: {
    statusCode: 404,
    message: 'Utilisateur non existant'
  },
  API_KEY_EXPIRED: {
    statusCode: 401,
    message: 'Clef API expiree'
  }
} as const;

export type AuthApiErrorCode = keyof typeof AUTH_ERRORS;

