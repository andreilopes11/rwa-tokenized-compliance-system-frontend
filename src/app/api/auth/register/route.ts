import { NextRequest, NextResponse } from "next/server";
import {
  buildPasswordChecks,
  isValidEmail,
  isValidWalletAddress,
  meetsPasswordPolicy
} from "@/features/auth/lib/validators";
import {
  encodeSession,
  sessionCookieName,
  sessionCookieOptions,
  type ComplianceSession,
  type SessionRole
} from "@/features/auth/server/session";

type RegisterRequest = {
  email?: string;
  password?: string;
  role?: SessionRole;
  walletAddress?: string;
};

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as RegisterRequest;
  const email = payload.email?.trim().toLowerCase() ?? "";
  const password = payload.password ?? "";
  const role = payload.role === "admin" ? "admin" : "investor";
  const walletAddress = payload.walletAddress?.trim() ?? "";

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
  }

  if (!meetsPasswordPolicy(buildPasswordChecks(password))) {
    return NextResponse.json(
      { message: "Password must include at least 8 characters, one uppercase letter, and one number." },
      { status: 400 }
    );
  }

  if (walletAddress && !isValidWalletAddress(walletAddress)) {
    return NextResponse.json({ message: "Enter a valid EVM wallet address." }, { status: 400 });
  }

  const session: ComplianceSession = {
    subject: email,
    provider: "email",
    role,
    walletAddress: walletAddress || undefined,
    mfaVerified: true,
    createdAt: new Date().toISOString()
  };

  const redirectTo = role === "admin" ? "/admin" : "/dashboard";
  const response = NextResponse.json(
    {
      message: "Account created. You are signed in.",
      autoLogin: true,
      redirectTo,
      nextLogin: `/login?registered=1&email=${encodeURIComponent(email)}&role=${role}`,
      user: {
        email,
        role,
        walletAddress: walletAddress || null
      },
      session
    },
    { status: 201 }
  );
  response.cookies.set(sessionCookieName(), encodeSession(session), sessionCookieOptions());
  return response;
}
