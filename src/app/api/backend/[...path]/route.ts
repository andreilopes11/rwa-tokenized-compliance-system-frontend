import { NextRequest, NextResponse } from "next/server";
import {
  isInvestorOnlyBackendPath,
  isStaffSharedInvestorReadPath
} from "@/features/auth/lib/middleware-auth";
import {
  clearAuthCookies,
  ensureSession,
  getAuthorizedBackendHeaders
} from "@/features/auth/server/session";
import { LOCALE_COOKIE, normalizeLocale } from "@/shared/i18n/config";

type RouteContext = {
  params: Promise<{ path: string[] }> | { path: string[] };
};

const GATEWAY_UNAVAILABLE_BODY = {
  message: "errors.upstreamUnavailable",
  messages: ["errors.upstreamUnavailable"]
};

function localeFromRequest(request: NextRequest): string {
  return normalizeLocale(request.cookies.get(LOCALE_COOKIE)?.value);
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

async function proxy(request: NextRequest, context: RouteContext) {
  const session = await ensureSession();
  if (!session) {
    const response = NextResponse.json({ messages: ["errors.authRequired"] }, { status: 401 });
    clearAuthCookies(response);
    return response;
  }

  const params = await context.params;
  const path = params.path.join("/");
  const isComplianceRoute =
    path.startsWith("api/admin/kyc/")
    || path.startsWith("api/admin/identities/")
    || path.startsWith("api/admin/subscriptions/")
    || path.startsWith("api/admin/redemptions/")
    || path.startsWith("api/admin/investors/");
  const isGovernanceRoute =
    path.startsWith("api/admin/assets/")
    || path === "api/admin/assets"
    || path.startsWith("api/admin/force-sync/");
  const isAuditRoute =
    path.startsWith("api/admin/audit-events")
    || path.startsWith("api/admin/blockchain-transactions")
    || path.startsWith("api/admin/reports/");

  if (isComplianceRoute && session.role !== "compliance") {
    return NextResponse.json({ messages: ["errors.complianceSessionRequired"] }, { status: 403 });
  }
  if (isGovernanceRoute && session.role !== "governance") {
    return NextResponse.json({ messages: ["errors.governanceSessionRequired"] }, { status: 403 });
  }
  if (isAuditRoute && session.role !== "audit" && session.role !== "governance" && session.role !== "compliance") {
    return NextResponse.json({ messages: ["errors.auditSessionRequired"] }, { status: 403 });
  }
  if (path.startsWith("api/admin/") && session.role === "investor") {
    return NextResponse.json({ messages: ["errors.adminSessionRequired"] }, { status: 403 });
  }

  if (isInvestorOnlyBackendPath(path) && session.role !== "investor") {
    const staffRead =
      isStaffSharedInvestorReadPath(path, request.method) &&
      (session.role === "compliance" || session.role === "audit");
    if (!staffRead) {
      return NextResponse.json(
        { messages: ["errors.investorSessionRequired"] },
        { status: 403 }
      );
    }
  }

  const backendBaseUrl = process.env.BACKEND_API_BASE_URL ?? "http://localhost:8080";
  const target = new URL(`${backendBaseUrl.replace(/\/$/, "")}/${path}`);
  target.search = request.nextUrl.search;

  let authHeaders: HeadersInit;
  try {
    authHeaders = await getAuthorizedBackendHeaders(session);
  } catch {
    const response = NextResponse.json({ messages: ["errors.sessionExpired"] }, { status: 401 });
    clearAuthCookies(response);
    return response;
  }

  const headers = new Headers(authHeaders);
  if (session.role === "investor" && session.walletAddress) {
    headers.set("X-Investor-Wallet", session.walletAddress);
  }
  headers.set("Accept-Language", localeFromRequest(request));
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
    if (response.status === 403 && path.includes("/documents")) {
      return NextResponse.json({ messages: ["errors.documentForbidden"] }, { status: 403 });
    }
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
