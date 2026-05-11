import { NextResponse } from "next/server";
import { sessionCookieName } from "@/features/auth/server/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieName(), "", {
    maxAge: 0,
    path: "/"
  });
  return response;
}
