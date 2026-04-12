export interface CreateStoreInput {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface UpdateStoreInput {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface StoreResponse {
  id: string;
  merchantId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}
