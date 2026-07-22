/**
 * Server-only runtime config. Import only from Route Handlers / Server Components.
 * Never import this module from Client Components (keeps secrets out of the browser bundle).
 */
import "server-only";

function envString(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.length > 0 ? value : fallback;
}

const backendApiBaseUrl = envString("BACKEND_API_BASE_URL", "http://127.0.0.1:8080");

if (process.env.NODE_ENV === "production") {
  if (!process.env.BACKEND_API_BASE_URL) {
    console.error(
      "[config] BACKEND_API_BASE_URL is required in production (Elastic Beanstalk HTTPS origin)."
    );
  } else if (backendApiBaseUrl.startsWith("http://") && !backendApiBaseUrl.includes("127.0.0.1")) {
    console.warn(
      "[config] BACKEND_API_BASE_URL uses HTTP. Prefer HTTPS on EB so Bearer tokens are not sent in cleartext."
    );
  }
}

export const serverRuntime = {
  /** Absolute Spring API origin (EB). Used by BFF and auth session proxy. */
  backendApiBaseUrl,
  googleClientId: envString("GOOGLE_CLIENT_ID", ""),
  googleClientSecret: envString("GOOGLE_CLIENT_SECRET", "")
} as const;
