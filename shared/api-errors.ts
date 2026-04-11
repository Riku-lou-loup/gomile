export const API_ERRORS = {
  // Auth
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
  AUTH_TOKEN_MISSING: {
    statusCode: 401,
    message: "Jeton d'authentification manquant",
  },
  INVALID_API_KEY: {
    statusCode: 401,
    message: 'Clef API invalide',
  },
  API_KEY_REVOKED: {
    statusCode: 403,
    message: 'Clef API revokee',
  },
  API_KEY_NOT_FOUND: {
    statusCode: 404,
    message: 'Clef API non trouvee',
  },
  MERCHANT_NOT_FOUND: {
    statusCode: 404,
    message: 'Marchand non trouve',
  },
  NOT_OWNER: {
    statusCode: 403,
    message: "Vous n'etes pas le proprietaire de cette ressource",
  },
  // Store
  STORE_NOT_FOUND: {
    statusCode: 404,
    message: 'Magasin non trouve',
  },
  STORE_NAME_ALREADY_USED: {
    statusCode: 409,
    message: 'Nom de magasin deja utilise',
  },
  // Generic
  BACKEND_UNREACHABLE: {
    statusCode: 502,
    message: 'API backend inaccessible',
  },
  REQUEST_FAILED: {
    statusCode: 500,
    message: 'La requete a echoue',
  },
} as const;

export type ApiErrorCode = keyof typeof API_ERRORS;

export interface ApiErrorPayload {
  code: ApiErrorCode;
  message: string;
  statusCode: number;
}

export function createApiError(code: ApiErrorCode): ApiErrorPayload {
  const definition = API_ERRORS[code];

  return {
    code,
    message: definition.message,
    statusCode: definition.statusCode,
  };
}
