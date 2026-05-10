import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/server-auth";

type RouteContext = {
  params: Promise<{ path: string[] }> | { path: string[] };
};

export async function GET(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

async function proxy(request: NextRequest, context: RouteContext) {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ messages: ["Authentication required."] }, { status: 401 });
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

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }
  if (isAdminRoute) {
    const adminToken = process.env.ADMIN_API_TOKEN ?? request.headers.get("X-Admin-Token");
    if (adminToken) {
      headers.set("X-Admin-Token", adminToken);
    }
  }

  const response = await fetch(target, {
    body: request.method === "GET" ? undefined : await request.text(),
    cache: "no-store",
    headers,
    method: request.method
  });

  const body = await response.text();
  return new NextResponse(body, {
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/json"
    },
    status: response.status
  });
}
