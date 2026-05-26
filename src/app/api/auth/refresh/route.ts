import { NextResponse } from "next/server";
import {
  applyAuthCookies,
  clearAuthCookies,
  readCookieValues,
  refreshAuthSession
} from "@/features/auth/server/session";

export async function POST() {
  const { refreshToken } = await readCookieValues();
  if (!refreshToken) {
    return NextResponse.json({ message: "Refresh token missing." }, { status: 401 });
  }

  const session = await refreshAuthSession(refreshToken);
  if (!session) {
    const response = NextResponse.json({ message: "Session refresh failed." }, { status: 401 });
    clearAuthCookies(response);
    return response;
  }

  const response = NextResponse.json({ ok: true });
  applyAuthCookies(response, session);
  return response;
}
