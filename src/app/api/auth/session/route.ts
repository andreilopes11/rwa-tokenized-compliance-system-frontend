import { NextResponse } from "next/server";
import {
  applyAuthCookies,
  clearAuthCookies,
  ensureSessionResult,
  type PublicSession
} from "@/features/auth/server/session";
import { serverRuntime } from "@/shared/config/serverRuntime";

function toPublicSession(session: NonNullable<Awaited<ReturnType<typeof ensureSessionResult>>["session"]>): PublicSession {
  const { accessToken: _accessToken, ...publicSession } = session;
  return publicSession;
}

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
}

export async function GET() {
  // Route Handler can persist rotated cookies — safe to refresh here.
  const ensured = await ensureSessionResult({ allowRefresh: true });
  const session = ensured.session ? toPublicSession(ensured.session) : null;
  const response = NextResponse.json({
    session,
    authenticated: Boolean(session),
    expiresAt: ensured.session?.expiresAt ?? null,
    providers: {
      google: Boolean(serverRuntime.googleClientId && serverRuntime.googleClientSecret),
      wallet: false,
      email: true
    },
    mfaEnabled: false
  });
  if (ensured.rotatedAuth) {
    applyAuthCookies(response, ensured.rotatedAuth);
  }
  return response;
}
