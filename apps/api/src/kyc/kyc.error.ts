export const KYC_ERRORS = {
  KYC_VERIFYING_IN_PROCESS: {
    statusCode: 409,
    message: "Admin is verifying uploaded documents, please come back later"
  },
  KYC_NO_PENDING_SUBMISSIONS: {
    statusCode: 409,
    message: "No pending KYC submissions"
  },
  KYC_SUBMISSION_NOT_FOUND: {
    statusCode: 404,
    message: "No KYC submission found"
  }

}