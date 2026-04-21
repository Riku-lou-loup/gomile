export const STORE_ERRORS = {
  STORE_NAME_ALREADY_USED: {
    statusCode: 409,
    message: 'Store name already in use',
  },
  STORE_NOT_FOUND: {
    statusCode: 404,
    message: 'Store not found',
  },
  NOT_OWNER: {
    statusCode: 403,
    message: 'You are not the owner of this resource',
  },
  DOMAIN_REQUIRED_WITH_PROVIDER: {
    statusCode: 400,
    message: 'A domain is required when a provider is specified',
  },
  STORE_HAS_ACTIVE_ORDERS: {
    statusCode: 409,
    message: 'Store has active orders, deletion is not possible',
  },
} as const;

export type StoreApiErrorCode = keyof typeof STORE_ERRORS;
