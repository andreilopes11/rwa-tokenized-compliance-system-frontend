import { NextRequest, NextResponse } from "next/server";
import { isValidEmail, isValidWalletAddress } from "@/lib/auth-validators";
import {
  encodeSession,
  sessionCookieName,
  sessionCookieOptions,
  type DemoSession,
  type SessionRole
} from "@/lib/server-auth";

type LoginRequest = {
  provider?: "google" | "wallet" | "demo";
  role?: SessionRole;
  subject?: string;
  walletAddress?: string;
  mfaCode?: string;
};

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as LoginRequest;
  const expectedCode = process.env.AUTH_MFA_CODE ?? "123456";
  const provider = payload.provider ?? "demo";
  const role = payload.role === "admin" ? "admin" : "investor";
  const subject = (payload.subject || payload.walletAddress || "demo-investor@portfolio.local").trim();
  const walletAddress = payload.walletAddress?.trim();

  if (payload.mfaCode?.trim() !== expectedCode) {
    return NextResponse.json({ message: "Invalid MFA code." }, { status: 401 });
  }

  if (provider === "wallet" && !isValidWalletAddress(subject)) {
    return NextResponse.json({ message: "Wallet sign-in requires a valid EVM address." }, { status: 400 });
  }

  if (provider !== "wallet" && !isValidEmail(subject)) {
    return NextResponse.json({ message: "Email sign-in requires a valid email address." }, { status: 400 });
  }

  const session: DemoSession = {
    subject,
    provider,
    role,
    walletAddress: provider === "wallet" ? subject : walletAddress,
    mfaVerified: true,
    createdAt: new Date().toISOString()
  };

  const response = NextResponse.json({ session });
  response.cookies.set(sessionCookieName(), encodeSession(session), sessionCookieOptions());
  return response;
}
