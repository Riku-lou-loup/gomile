import { NextRequest } from "next/server";

import { proxySessionLogout } from "@/lib/auth-proxy";

export async function POST(request: NextRequest) {
  return proxySessionLogout(request);
}
