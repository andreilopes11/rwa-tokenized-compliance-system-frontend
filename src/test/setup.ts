import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";

vi.mock("@/shared/providers/ThemeProvider", () => ({
  ThemeProvider: ({ children }: { children: unknown }) => children,
  useTheme: () => ({
    theme: "light" as const,
    setTheme: vi.fn(),
    toggleTheme: vi.fn()
  })
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn()
  }),
  usePathname: () => "/governance",
  useSearchParams: () => new URLSearchParams()
}));

vi.mock("next/dynamic", () => ({
  default: () => {
    function DynamicMock() {
      return null;
    }
    return DynamicMock;
  }
}));

const defaultSessionResponse = {
  authenticated: false,
  session: null,
  expiresAt: null,
  providers: { google: false, wallet: false, email: true },
  mfaEnabled: false
};

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/api/auth/session")) {
        return new Response(JSON.stringify(defaultSessionResponse), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      if (url.includes("/api/auth/logout") || url.includes("/api/auth/refresh")) {
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      return new Response(JSON.stringify({}), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    })
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
