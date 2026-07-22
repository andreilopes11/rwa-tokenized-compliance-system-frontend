"use client";

import { QueryClient } from "@tanstack/react-query";
import { http, createConfig, injected } from "wagmi";
import { sepolia } from "wagmi/chains";
import type { Chain } from "viem";
import { publicRuntime } from "@/shared/config/publicRuntime";

const configuredChainId = publicRuntime.chainId;
const configuredRpcUrl = publicRuntime.rpcUrl;
const configuredExplorerUrl = publicRuntime.blockExplorerUrl;
const isLocalRpc =
  configuredRpcUrl.includes("127.0.0.1") || configuredRpcUrl.includes("localhost");

/**
 * Single active chain avoids Anvil/Sepolia id collision (both may use 11155111).
 * Local RPC → Anvil-labelled chain; remote HTTPS → Sepolia with configured RPC/explorer.
 */
export const activeChain: Chain = isLocalRpc
  ? {
      id: configuredChainId,
      name: "Anvil",
      nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
      rpcUrls: { default: { http: [configuredRpcUrl] } },
      blockExplorers: {
        default: { name: "Local EVM", url: configuredRpcUrl }
      }
    }
  : {
      ...sepolia,
      id: configuredChainId || sepolia.id,
      rpcUrls: { default: { http: [configuredRpcUrl || sepolia.rpcUrls.default.http[0]] } },
      blockExplorers: {
        default: {
          name: "Etherscan",
          url: configuredExplorerUrl || sepolia.blockExplorers?.default.url || "https://sepolia.etherscan.io"
        }
      }
    };

/** @deprecated Prefer activeChain — kept for gradual migration. */
export const anvil = activeChain;

export const supportedChains = [activeChain] as const;

export const blockExplorerUrl =
  configuredExplorerUrl
  || activeChain.blockExplorers?.default.url
  || "";

export const wagmiConfig = createConfig({
  chains: supportedChains,
  connectors: [injected()],
  ssr: true,
  transports: {
    [activeChain.id]: http(configuredRpcUrl)
  }
});

export const queryClient = new QueryClient();

export function explorerLink(type: "address" | "tx", value: string | null | undefined): string {
  if (!value || !blockExplorerUrl || isLocalRpc) {
    return "";
  }
  return `${blockExplorerUrl.replace(/\/$/, "")}/${type}/${value}`;
}
