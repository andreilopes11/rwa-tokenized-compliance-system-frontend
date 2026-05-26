import { NextRequest, NextResponse } from "next/server";
import {
  applyAuthCookies,
  backendAuthRequest,
  type BackendAuthSession
} from "@/features/auth/server/session";
import {
  buildPasswordChecks,
  isValidEmail,
  isValidWalletAddress,
  meetsPasswordPolicy
} from "@/features/auth/lib/validators";

type RegisterRequest = {
  email?: string;
  password?: string;
  role?: "investor" | "admin";
  walletAddress?: string;
  inviteCode?: string;
};

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as RegisterRequest;
  const email = payload.email?.trim().toLowerCase() ?? "";
  const password = payload.password ?? "";
  const role = payload.role === "admin" ? "admin" : "investor";
  const walletAddress = payload.walletAddress?.trim() ?? "";
  const inviteCode = payload.inviteCode?.trim() ?? "";

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

  const path =
    role === "admin"
      ? "/api/auth/admin/register"
      : "/api/auth/investor/register";

  const body =
    role === "admin"
      ? { email, password, inviteCode }
      : { email, password, walletAddress: walletAddress || undefined };

  if (role === "admin" && !inviteCode) {
    return NextResponse.json({ message: "Admin invite code is required." }, { status: 400 });
  }

  const result = await backendAuthRequest<BackendAuthSession>(path, {
    method: "POST",
    body: JSON.stringify(body)
  });

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  const redirectTo = role === "admin" ? "/admin" : "/dashboard";
  const response = NextResponse.json(
    {
      message: "Account created. You are signed in.",
      autoLogin: true,
      redirectTo,
      user: {
        email: result.data.user.email,
        role,
        walletAddress: result.data.user.walletAddress ?? null
      }
    },
    { status: 201 }
  );
  applyAuthCookies(response, result.data);
  return response;
}
