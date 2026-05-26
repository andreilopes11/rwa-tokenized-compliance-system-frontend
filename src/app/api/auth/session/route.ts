import { NextResponse } from "next/server";
import { clearAuthCookies, readSession } from "@/features/auth/server/session";

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
      google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      wallet: false,
      email: true
    },
    mfaEnabled: true
  });
}
