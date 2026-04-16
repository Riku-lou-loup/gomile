import { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/api-proxy";

type Params = { params: Promise<{ merchantId: string; apiKeyId: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { merchantId, apiKeyId } = await params;
  return proxyApiRequest(request, `/merchants/${merchantId}/api-keys/${apiKeyId}/revoke`);
}
