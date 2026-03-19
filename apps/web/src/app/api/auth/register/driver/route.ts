import { NextRequest } from "next/server";

import { proxySessionCreation } from "@/lib/auth-proxy";

export async function POST(request: NextRequest) {
  return proxySessionCreation(request, "/auth/register/driver");
}
