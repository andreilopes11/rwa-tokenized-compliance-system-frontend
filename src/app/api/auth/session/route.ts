import { NextResponse } from "next/server";
import { readSession } from "@/features/auth/server/session";

export async function GET() {
  const session = await readSession();
  return NextResponse.json({
    session,
    providers: {
      google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      wallet: true,
      demo: true
    },
    mfaEnabled: true
  });
}
