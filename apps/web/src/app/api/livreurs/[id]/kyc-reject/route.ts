import { NextRequest } from "next/server";
import { forwardAuthenticatedRequest } from "@/lib/backend-proxy";

// receive request from brower, extract id and forwards to backend
export async function PUT(request: NextRequest,
{params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    return forwardAuthenticatedRequest(request, `/livreurs/${id}/kyc-reject`);
}
