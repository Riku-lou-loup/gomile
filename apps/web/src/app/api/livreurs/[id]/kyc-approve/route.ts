import { NextRequest } from "next/server";

import { forwardAuthenticatedRequest } from "@/lib/backend-proxy";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return forwardAuthenticatedRequest(request, `/livreurs/${id}/kyc-approve`);
}
