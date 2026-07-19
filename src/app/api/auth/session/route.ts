import { NextResponse } from "next/server";
import { clearAuthCookies, readSession } from "@/features/auth/server/session";
import { serverRuntime } from "@/shared/config/serverRuntime";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
}

export async function GET() {
  const session = await readSession();
  return NextResponse.json({
    session,
    authenticated: Boolean(session),
    providers: {
      google: Boolean(serverRuntime.googleClientId && serverRuntime.googleClientSecret),
      wallet: false,
      email: true
    },
    mfaEnabled: false
  });
}
