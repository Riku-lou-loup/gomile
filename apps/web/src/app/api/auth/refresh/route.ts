import { NextRequest } from "next/server";

import { proxySessionRefresh } from "@/lib/auth-proxy";

export async function POST(request: NextRequest) {
  return proxySessionRefresh(request);
}
