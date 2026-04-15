import { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/api-proxy";

type Params = { params: Promise<{ merchantId: string; orderId: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { merchantId, orderId } = await params;
  return proxyApiRequest(request, `/merchants/${merchantId}/orders/${orderId}/cancel`);
}
