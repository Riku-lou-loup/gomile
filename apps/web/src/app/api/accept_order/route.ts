import { NextRequest } from "next/server";

import {forwardAuthenticatedRequest, forwardRequest} from "@/lib/backend-proxy";

export async function POST(request: NextRequest) {
  return forwardAuthenticatedRequest(request, "/accept_order");
}
