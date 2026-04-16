import { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/api-proxy";

type Params = { params: Promise<{ merchantId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { merchantId } = await params;
  return proxyApiRequest(request, `/merchants/${merchantId}/api-keys`);
}

export async function POST(request: NextRequest, { params }: Params) {
  const { merchantId } = await params;
  return proxyApiRequest(request, `/merchants/${merchantId}/api-keys`);
}
