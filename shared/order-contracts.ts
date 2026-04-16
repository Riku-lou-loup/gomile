export const ORDER_STATUSES = [
  'SEARCHING_DRIVER',
  'DRIVER_ACCEPTED',
  'PICKED_UP',
  'DELIVERED',
  'CANCELLED',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  dropOffAddress: string;
}

export interface HandshakeInput {
  code: string;
}


export interface CreateOrderResponse {
  orderId: string;
  pickupCode: string;
  deliveryCode: string;
  message: string;
}

export interface ListMerchantOrdersItem {
  id: string;
  storeId: string;
  driverId: string | null;
  customerName: string;
  dropOffAddress: string;
  status: OrderStatus;
  createdAt: string;
}

export interface GetOrderResponse {
  orderId: string;
  storeId: string;
  driverId: string | null;
  customerName: string;
  customerPhone: string;
  dropOffAddress: string;
  status: OrderStatus;
  createdAt: string;
  acceptedAt: string | null;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
}

export interface CancelOrderResponse {
  message: string;
}


export interface ListDriverOrdersItem {
  id: string;
  storeId: string;
  merchantId: string;
  customerName: string;
  dropOffAddress: string;
  status: OrderStatus;
  createdAt: string;
  acceptedAt: string | null;
}
