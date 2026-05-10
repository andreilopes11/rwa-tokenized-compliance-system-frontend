import { NextRequest, NextResponse } from "next/server";
import {
  buildPasswordChecks,
  isValidEmail,
  isValidWalletAddress,
  meetsPasswordPolicy
} from "@/lib/auth-validators";
import type { SessionRole } from "@/lib/server-auth";

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

  const nextLogin = `/login?registered=1&email=${encodeURIComponent(email)}&role=${role}`;

  return NextResponse.json(
    {
      message: "Demo-ready account created.",
      nextLogin,
      user: {
        email,
        role,
        walletAddress: walletAddress || null
      }
    },
    { status: 201 }
  );
}
