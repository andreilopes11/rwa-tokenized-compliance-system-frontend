/**
 * Client-safe runtime config (safe to import from Client Components).
 * Only NEXT_PUBLIC_* values and non-secret defaults.
 */
import { generatedContracts } from "@/shared/config/contracts.generated";

function envString(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.length > 0 ? value : fallback;
}

function envNumber(name: string, fallback: number): number {
  const value = process.env[name];
  if (value === undefined || value.length === 0) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const ZERO = "0x0000000000000000000000000000000000000000";

function isRealAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value) && value.toLowerCase() !== ZERO.toLowerCase();
}

function resolveContractAddress(envName: string, generated: string): string {
  const fromEnv = envString(envName, "");
  if (isRealAddress(fromEnv)) return fromEnv;
  if (isRealAddress(generated)) return generated;
  return "";
}

const chainId = envNumber("NEXT_PUBLIC_CHAIN_ID", 11155111);
const isProdBuild = process.env.NODE_ENV === "production";
const identityRegistryAddress = resolveContractAddress(
  "NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS",
  generatedContracts.identityRegistryAddress
);
const tokenAddress = resolveContractAddress(
  "NEXT_PUBLIC_TOKEN_ADDRESS",
  generatedContracts.tokenAddress
);
const rpcUrl = envString("NEXT_PUBLIC_RPC_URL", "http://127.0.0.1:8545");

if (isProdBuild) {
  const problems: string[] = [];
  if (chainId === 11155111) {
    problems.push("NEXT_PUBLIC_CHAIN_ID is still 11155111 (set Sepolia 11155111)");
  }
  if (
    !identityRegistryAddress
    || identityRegistryAddress === generatedContracts.identityRegistryAddress
  ) {
    problems.push(
      "NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS must be set to the Sepolia IR (do not use Anvil fallback)"
    );
  }
  if (!tokenAddress || tokenAddress === generatedContracts.tokenAddress) {
    problems.push(
      "NEXT_PUBLIC_TOKEN_ADDRESS must be set to the Sepolia token (do not use Anvil fallback)"
    );
  }
  if (rpcUrl.includes("127.0.0.1") || rpcUrl.includes("localhost")) {
    problems.push("NEXT_PUBLIC_RPC_URL must be a public HTTPS Sepolia RPC");
  }
  if (problems.length > 0) {
    console.error(`[config] Production build misconfigured:\n- ${problems.join("\n- ")}`);
  }
}

export const publicRuntime = {
  apiBaseUrl: envString("NEXT_PUBLIC_API_BASE_URL", "/api/backend"),
  chainId,
  rpcUrl,
  blockExplorerUrl: envString("NEXT_PUBLIC_BLOCK_EXPLORER_URL", ""),
  gaMeasurementId: envString("NEXT_PUBLIC_GA_MEASUREMENT_ID", ""),
  identityRegistryAddress,
  tokenAddress
} as const;

/** @deprecated Prefer publicRuntime — kept for gradual migration. */
export const runtimeConfig = publicRuntime;
