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

const chainId = envNumber("NEXT_PUBLIC_CHAIN_ID", 31337);
const isProdBuild = process.env.NODE_ENV === "production";

if (isProdBuild && chainId === 31337) {
  console.warn(
    "[config] NEXT_PUBLIC_CHAIN_ID is still 31337 in a production build. Set Sepolia (11155111) or mainnet on Vercel."
  );
}

export const publicRuntime = {
  apiBaseUrl: envString("NEXT_PUBLIC_API_BASE_URL", "/api/backend"),
  chainId,
  rpcUrl: envString("NEXT_PUBLIC_RPC_URL", "http://127.0.0.1:8545"),
  blockExplorerUrl: envString("NEXT_PUBLIC_BLOCK_EXPLORER_URL", ""),
  gaMeasurementId: envString("NEXT_PUBLIC_GA_MEASUREMENT_ID", ""),
  identityRegistryAddress: resolveContractAddress(
    "NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS",
    generatedContracts.identityRegistryAddress
  ),
  tokenAddress: resolveContractAddress(
    "NEXT_PUBLIC_TOKEN_ADDRESS",
    generatedContracts.tokenAddress
  )
} as const;

/** @deprecated Prefer publicRuntime — kept for gradual migration. */
export const runtimeConfig = publicRuntime;
