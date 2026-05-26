import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

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
    refresh: vi.fn()
  })
}));

vi.mock("next/dynamic", () => ({
  default: () => {
    function DynamicMock() {
      return null;
    }
    return DynamicMock;
  }
}));
