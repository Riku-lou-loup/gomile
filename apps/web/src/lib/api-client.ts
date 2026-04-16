import type { ApiErrorPayload } from "../../../../shared/api-errors";
import { createApiError } from "../../../../shared/api-errors";
import type {
  CreateStoreInput,
  UpdateStoreInput,
  StoreResponse,
} from "../../../../shared/store-contracts";
import type {
  CreateOrderInput,
  CreateOrderResponse,
  ListMerchantOrdersItem,
  GetOrderResponse,
  CancelOrderResponse,
} from "../../../../shared/order-contracts";
import type {
  CreateApiKeyInput,
  UpdateApiKeyInput,
  CreateApiKeyResponse,
  ListApiKeysItem,
  GetApiKeyResponse,
  UpdateApiKeyResponse,
} from "../../../../shared/api-key-contracts";

// Re-export for convenience
export type {
  CreateStoreInput,
  UpdateStoreInput,
  StoreResponse,
  CreateOrderInput,
  CreateOrderResponse,
  ListMerchantOrdersItem,
  GetOrderResponse,
  CancelOrderResponse,
  CreateApiKeyInput,
  UpdateApiKeyInput,
  CreateApiKeyResponse,
  ListApiKeysItem,
  GetApiKeyResponse,
  UpdateApiKeyResponse,
};

async function parseError(response: Response): Promise<string> {
  const fallbackError = createApiError("REQUEST_FAILED");
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const payload = (await response.json()) as Partial<ApiErrorPayload>;
    return payload.message ?? payload.code ?? fallbackError.message;
  }

  const text = await response.text();
  return text || fallbackError.message;
}

// fetch wrapper, 
async function request<T>(path: string, init?: RequestInit): Promise<T> {
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

export function createStore(merchantId: string, input: CreateStoreInput) {
  return request<StoreResponse>(`/api/merchants/${merchantId}/stores`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listStores(merchantId: string, isActive?: boolean) {
  const query = isActive !== undefined ? `?isActive=${isActive}` : "";
  return request<StoreResponse[]>(`/api/merchants/${merchantId}/stores${query}`);
}

export function getStore(merchantId: string, storeId: string) {
  return request<StoreResponse>(`/api/merchants/${merchantId}/stores/${storeId}`);
}

export function updateStore(merchantId: string, storeId: string, input: UpdateStoreInput) {
  return request<StoreResponse>(`/api/merchants/${merchantId}/stores/${storeId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function disableStore(merchantId: string, storeId: string) {
  return request<StoreResponse>(`/api/merchants/${merchantId}/stores/${storeId}/disable`, {
    method: "POST",
  });
}

export function enableStore(merchantId: string, storeId: string) {
  return request<StoreResponse>(`/api/merchants/${merchantId}/stores/${storeId}/enable`, {
    method: "POST",
  });
}

export function deleteStore(merchantId: string, storeId: string) {
  return request<{ message: string }>(`/api/merchants/${merchantId}/stores/${storeId}`, {
    method: "DELETE",
  });
}

export function createOrder(merchantId: string, storeId: string, input: CreateOrderInput) {
  return request<CreateOrderResponse>(
    `/api/merchants/${merchantId}/stores/${storeId}/orders`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function listMerchantOrders(merchantId: string) {
  return request<ListMerchantOrdersItem[]>(`/api/merchants/${merchantId}/orders`);
}

export function getMerchantOrder(merchantId: string, orderId: string) {
  return request<GetOrderResponse>(`/api/merchants/${merchantId}/orders/${orderId}`);
}

export function cancelOrder(merchantId: string, orderId: string) {
  return request<CancelOrderResponse>(
    `/api/merchants/${merchantId}/orders/${orderId}/cancel`,
    { method: "POST" },
  );
}

export function createApiKey(merchantId: string, input: CreateApiKeyInput) {
  return request<CreateApiKeyResponse>(`/api/merchants/${merchantId}/api-keys`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listApiKeys(merchantId: string) {
  return request<ListApiKeysItem[]>(`/api/merchants/${merchantId}/api-keys`);
}

export function getApiKey(merchantId: string, apiKeyId: string) {
  return request<GetApiKeyResponse>(`/api/merchants/${merchantId}/api-keys/${apiKeyId}`);
}

export function updateApiKey(merchantId: string, apiKeyId: string, input: UpdateApiKeyInput) {
  return request<UpdateApiKeyResponse>(
    `/api/merchants/${merchantId}/api-keys/${apiKeyId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export function revokeApiKey(merchantId: string, apiKeyId: string) {
  return request<void>(`/api/merchants/${merchantId}/api-keys/${apiKeyId}/revoke`, {
    method: "POST",
  });
}
