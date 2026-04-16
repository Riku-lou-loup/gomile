import { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/api-proxy";

type Params = { params: Promise<{ driverId: string; orderId: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { driverId, orderId } = await params;
  return proxyApiRequest(request, `/livreurs/${driverId}/orders/${orderId}/accept`);
}
