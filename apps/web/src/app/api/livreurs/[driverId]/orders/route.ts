import { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/api-proxy";

type Params = { params: Promise<{ driverId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { driverId } = await params;
  return proxyApiRequest(request, `/livreurs/${driverId}/orders`);
}
