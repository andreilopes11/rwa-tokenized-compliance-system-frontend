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
  role?: "investor" | "compliance" | "governance" | "audit";
  walletAddress?: string;
};

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as RegisterRequest;
  const email = payload.email?.trim().toLowerCase() ?? "";
  const password = payload.password ?? "";
  const role =
    payload.role === "compliance" || payload.role === "governance" || payload.role === "audit"
      ? payload.role
      : "investor";
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

  const path = role === "investor" ? "/api/auth/investor/register" : "/api/auth/admin/register";

  const body =
    role === "investor"
      ? { email, password, walletAddress: walletAddress || undefined }
      : { email, password };

  const result = await backendAuthRequest<BackendAuthSession>(path, {
    method: "POST",
    body: JSON.stringify(body)
  });

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  const redirectTo =
    role === "investor" ? "/dashboard" : role === "compliance" ? "/compliance" : role === "audit" ? "/audit" : "/governance";
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
