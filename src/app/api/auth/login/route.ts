import { NextRequest, NextResponse } from "next/server";
import {
  applyAuthCookies,
  backendAuthRequest,
  extractErrorMessage,
  type BackendAuthSession
} from "@/features/auth/server/session";

type LoginRequest = {
  email?: string;
  password?: string;
  role?: "investor" | "compliance" | "governance" | "audit";
  mfaCode?: string;
};

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as LoginRequest;
  const email = payload.email?.trim().toLowerCase() ?? "";
  const password = payload.password ?? "";
  const role =
    payload.role === "compliance"
      ? "COMPLIANCE_OFFICER"
      : payload.role === "audit"
        ? "AUDITOR"
        : payload.role === "governance"
          ? "SUPER_ADMIN"
          : "INVESTOR";
  const mfaCode = payload.mfaCode?.trim() ?? "";

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }

  if (!/^\d{6}$/.test(mfaCode)) {
    return NextResponse.json({ message: "Enter a valid 6-digit MFA code." }, { status: 400 });
  }

  const result = await backendAuthRequest<BackendAuthSession>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, role, mfaCode })
  });

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  const response = NextResponse.json({
    user: {
      email: result.data.user.email,
        role:
          result.data.user.role === "INVESTOR"
            ? "investor"
            : result.data.user.role === "COMPLIANCE_OFFICER"
              ? "compliance"
              : result.data.user.role === "AUDITOR"
                ? "audit"
                : "governance",
      walletAddress: result.data.user.walletAddress
    }
  });
  applyAuthCookies(response, result.data);
  return response;
}
