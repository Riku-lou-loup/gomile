import { NextRequest, NextResponse } from "next/server";
import { createApiError } from "../../../../shared/api-errors";
import { authCookies } from "./auth-proxy";

const API_BASE_URL = "http://localhost:3000";

function getApiBaseUrl() {
  return process.env.API_BASE_URL ?? API_BASE_URL;
}

async function forwardRequest(
  request: NextRequest,
  backendPath: string,
  token: string,
): Promise<NextResponse> {
  const url = new URL(backendPath, getApiBaseUrl());

  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const headers = new Headers();
  headers.set("authorization", `Bearer ${token}`);
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const method = request.method;
  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? await request.text() : undefined;

  try {
    const backendResponse = await fetch(url.toString(), {
      method,
      headers,
      body,
      cache: "no-store",
    });

    const responseText = await backendResponse.text();
    const responseHeaders = new Headers();
    const resContentType = backendResponse.headers.get("content-type");
    if (resContentType) responseHeaders.set("content-type", resContentType);

    return new NextResponse(responseText || null, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch {
    const error = createApiError("BACKEND_UNREACHABLE");
    return NextResponse.json(error, { status: error.statusCode });
  }
}

export async function proxyApiRequest(
  request: NextRequest,
  backendPath: string,
): Promise<NextResponse> {
  const accessToken = request.cookies.get(authCookies.accessToken)?.value;

  if (!accessToken) {
    const error = createApiError("AUTH_TOKEN_MISSING");
    return NextResponse.json(error, { status: error.statusCode });
  }

  return forwardRequest(request, backendPath, accessToken);
}


