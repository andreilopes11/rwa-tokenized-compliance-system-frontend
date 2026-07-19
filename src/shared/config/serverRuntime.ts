/**
 * Server-only runtime config. Import only from Route Handlers / Server Components.
 * Never import this module from Client Components (keeps secrets out of the browser bundle).
 */
import "server-only";

function envString(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.length > 0 ? value : fallback;
}

export const serverRuntime = {
  /** Absolute Spring API origin (EB). Used by BFF and auth session proxy. */
  backendApiBaseUrl: envString("BACKEND_API_BASE_URL", "http://127.0.0.1:8080"),
  googleClientId: envString("GOOGLE_CLIENT_ID", ""),
  googleClientSecret: envString("GOOGLE_CLIENT_SECRET", "")
} as const;
