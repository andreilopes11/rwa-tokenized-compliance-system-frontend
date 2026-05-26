import { NextRequest, NextResponse } from "next/server";
import {
  clearAuthCookies,
  ensureSession,
  getAuthorizedBackendHeaders
} from "@/features/auth/server/session";

type RouteContext = {
  params: Promise<{ path: string[] }> | { path: string[] };
};

const GATEWAY_UNAVAILABLE_BODY = {
  message:
    "Compliance API is temporarily unavailable. Ensure the Spring Boot backend is running on BACKEND_API_BASE_URL, then retry.",
  messages: [
    "Compliance API is temporarily unavailable. Ensure the Spring Boot backend is running on BACKEND_API_BASE_URL, then retry."
  ]
};

export async function GET(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

async function proxy(request: NextRequest, context: RouteContext) {
  const session = await ensureSession();
  if (!session) {
    const response = NextResponse.json({ messages: ["Authentication required."] }, { status: 401 });
    clearAuthCookies(response);
    return response;
  }

  const params = await context.params;
  const path = params.path.join("/");
  const isAdminRoute = path.startsWith("api/admin/");
  if (isAdminRoute && session.role !== "admin") {
    return NextResponse.json({ messages: ["Admin session required."] }, { status: 403 });
  }

  const backendBaseUrl = process.env.BACKEND_API_BASE_URL ?? "http://localhost:8080";
  const target = new URL(`${backendBaseUrl.replace(/\/$/, "")}/${path}`);
  target.search = request.nextUrl.search;

  let authHeaders: HeadersInit;
  try {
    authHeaders = await getAuthorizedBackendHeaders(session);
  } catch {
    const response = NextResponse.json({ messages: ["Session expired. Sign in again."] }, { status: 401 });
    clearAuthCookies(response);
    return response;
  }

  const headers = new Headers(authHeaders);
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }

  let response: Response;
  try {
    response = await fetch(target, {
      body: request.method === "GET" ? undefined : await request.text(),
      cache: "no-store",
      headers,
      method: request.method
    });
  } catch {
    return NextResponse.json(GATEWAY_UNAVAILABLE_BODY, { status: 502 });
  }

  if (response.status === 401 || response.status === 403) {
    const body = await response.text();
    const proxyResponse = new NextResponse(body, {
      headers: {
        "content-type": response.headers.get("content-type") ?? "application/json"
      },
      status: response.status
    });
    if (response.status === 401) {
      clearAuthCookies(proxyResponse);
    }
    return proxyResponse;
  }

  if (response.status >= 502) {
    const body = await response.text();
    if (!body) {
      return NextResponse.json(GATEWAY_UNAVAILABLE_BODY, { status: 502 });
    }
  }

  const body = await response.text();
  return new NextResponse(body, {
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/json"
    },
    status: response.status
  });
}
