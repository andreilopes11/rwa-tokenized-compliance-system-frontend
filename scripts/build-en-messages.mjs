import fs from "node:fs";

const copy = fs.readFileSync("src/shared/lib/copy.ts", "utf8");
const body = copy.replace("export const copy = ", "export const en = ");
const extra = `  nav: {
    primary: "Primary navigation",
    home: "Home",
    signIn: "Sign in",
    signUp: "Create account",
    terms: "Terms of use",
    privacy: "Privacy policy",
    useCases: "Use cases",
    product: "Product",
    howItWorks: "How it works",
    platform: "Platform",
    trust: "Trust",
    language: "Language",
    openMenu: "Open menu"
  },
  wallet: {
    connect: "Connect wallet",
    connecting: "Connecting wallet...",
    switchToChain: "Switch to {chainName}",
    disconnectedNotice:
      "Wallet disconnected. You can still paste a wallet address for API status checks.",
    noWalletFound: "No injected wallet was found. Install or enable a browser wallet to continue.",
    noConnector: "No injected wallet connector is available.",
    connectionFailed: "Wallet connection failed.",
    manualMode: "Manual wallet mode"
  },
  errors: {
    apiUnavailable:
      "Compliance API is temporarily unavailable. Ensure the Spring Boot backend is running, then retry.",
    authRequired: "Authentication required.",
    sessionExpired: "Session expired. Sign in again.",
    adminSessionRequired: "Admin session required.",
    investorSessionRequired:
      "Investor session required. Sign in as an investor to use this endpoint.",
    authApiNotFound:
      "Auth API not found. Restart the Spring Boot backend (port 8080) with the latest code.",
    backendNotFound:
      "Backend endpoint not found. Ensure the compliance service is running on port 8080.",
    authenticationFailed: "Authentication request failed.",
    signOutFailed: "Unable to sign out.",
    requestFailed: "Request failed."
  },
`;
const patched = body.replace("  common: {", `${extra}  common: {`);
fs.mkdirSync("src/shared/i18n/messages", { recursive: true });
fs.writeFileSync("src/shared/i18n/messages/en.ts", patched);
