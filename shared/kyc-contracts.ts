export interface DriverKycSubmission {
    id: string;
    status: string;
    documentUrl: string;
    rejectionReason: string | null;
    createdAt: string;
}
export interface DriverKycStatus{
    status: string;
    latestSubmission: DriverKycSubmission | null;
}

export interface KycActionResponse {
    message : string;
}

export interface RejectKycInput {
    rejectionReason: string;
}