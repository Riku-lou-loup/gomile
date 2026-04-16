export interface CreateApiKeyInput {
  name: string;
  storeId: string;
  expiresAt?: string;
}

export interface UpdateApiKeyInput {
  name?: string;
  expiresAt?: string;
}

export interface CreateApiKeyResponse {
  id: string;
  name: string;
  /** Raw key — only returned once, store it securely */
  apiKey: string;
  createdAt: string;
}

export interface ListApiKeysItem {
  id: string;
  name: string;
  storeId: string;
  createdAt: string;
  revokedAt: string | null;
  expiresAt: string | null;
}

export interface ApiKeyStoreInfo {
  name: string;
  domain: string | null;
  provider: string | null;
}

export interface GetApiKeyResponse {
  id: string;
  name: string;
  storeId: string;
  createdAt: string;
  revokedAt: string | null;
  expiresAt: string | null;
  store: ApiKeyStoreInfo;
}

export interface UpdateApiKeyResponse {
  id: string;
  name: string;
  storeId: string;
  createdAt: string;
  expiresAt: string | null;
  revokedAt: string | null;
}
