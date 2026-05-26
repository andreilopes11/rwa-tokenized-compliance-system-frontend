import { NextResponse } from "next/server";
import { clearAuthCookies, readCookieValues, backendAuthRequest } from "@/features/auth/server/session";

export async function POST() {
  const { refreshToken } = await readCookieValues();

  if (refreshToken) {
    await backendAuthRequest("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken })
    });
  }

  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
}
