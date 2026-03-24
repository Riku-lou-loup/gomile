import type { ApiErrorPayload } from "../../../../shared/api-errors";
import type {
  DriverKycStatus,
  KycActionResponse,
  RejectKycInput,
} from "../../../../shared/kyc-contracts";

export type {
  DriverKycStatus,
  KycActionResponse,
  RejectKycInput,
};

async function parseError(response: Response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const payload = (await response.json()) as Partial<ApiErrorPayload>;
    return payload.message ?? payload.code ?? "Request failed";
  }

  const text = await response.text();
  return text || "Request failed";
}

async function requestKyc<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function getMyKycStatus() {
  return requestKyc<DriverKycStatus>("/api/livreurs/me/kyc", {
    method: "GET",
  });
}

export function approveDriverKyc(id: string) {
  return requestKyc<KycActionResponse>(`/api/livreurs/${id}/kyc-approve`, {
    method: "PUT",
  });
}

export function rejectDriverKyc(id: string, rejectionReason: string) {
  return requestKyc<KycActionResponse>(`/api/livreurs/${id}/kyc-reject`, {
    method: "PUT",
    body: JSON.stringify({ rejectionReason } satisfies RejectKycInput),
  });
}
