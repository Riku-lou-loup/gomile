import { NextRequest } from "next/server";

import {forwardAuthenticatedRequest, forwardRequest} from "@/lib/backend-proxy";

export async function GET(request: NextRequest) {
  return forwardAuthenticatedRequest(request, "/");
}
