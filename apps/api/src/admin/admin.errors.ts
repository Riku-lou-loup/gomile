export const ADMIN_ERRORS = {
  WITHDRAWAL_NOT_FOUND: {
    statusCode: 404,
    message: 'Withdrawal entry not found',
  },
  WITHDRAWAL_NOT_PENDING: {
    statusCode: 409,
    message: 'Withdrawal has already been processed',
  },
} as const;
