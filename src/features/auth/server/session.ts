import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type SessionRole = "investor" | "admin";

export type ComplianceSession = {
  subject: string;
  provider: "google" | "wallet" | "email";
  role: SessionRole;
  walletAddress?: string;
  mfaVerified: boolean;
  createdAt: string;
};

const COOKIE_NAME = "rwa_compliance_session";
const MAX_AGE_SECONDS = 60 * 60 * 8;

export async function readSession(): Promise<ComplianceSession | null> {
  const cookieStore = await cookies();
  const encoded = cookieStore.get(COOKIE_NAME)?.value;
  if (!encoded) {
    return null;
  }
  try {
    const json = Buffer.from(encoded, "base64url").toString("utf8");
    const session = JSON.parse(json) as ComplianceSession;
    return session.mfaVerified ? session : null;
  } catch {
    return null;
  }
}

export async function requireSession(role?: SessionRole): Promise<ComplianceSession> {
  const session = await readSession();
  if (!session) {
    redirect("/login");
  }
  if (role && session.role !== role) {
    redirect(session.role === "admin" ? "/admin" : "/dashboard");
  }
  return session;
}

export function encodeSession(session: ComplianceSession): string {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    maxAge: MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production"
  };
}

export function sessionCookieName() {
  return COOKIE_NAME;
}
