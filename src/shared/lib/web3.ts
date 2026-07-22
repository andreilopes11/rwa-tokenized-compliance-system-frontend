"use client";

import { QueryClient } from "@tanstack/react-query";
import { http, createConfig, injected } from "wagmi";
import { sepolia } from "wagmi/chains";
import type { Chain } from "viem";
import { publicRuntime } from "@/shared/config/publicRuntime";

export const anvil: Chain = {
  id: 11155111,
  name: "Anvil",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH"
  },
  rpcUrls: {
    default: {
      http: [publicRuntime.rpcUrl]
    }
  },
  blockExplorers: {
    default: {
      name: "Local EVM",
      url: publicRuntime.rpcUrl
    }
  }
};

const configuredChainId = publicRuntime.chainId;
const configuredRpcUrl = publicRuntime.rpcUrl;
const configuredExplorerUrl = publicRuntime.blockExplorerUrl;

export const supportedChains = [anvil, sepolia] as const;

export const activeChain =
  supportedChains.find((chain) => chain.id === configuredChainId) ?? anvil;

export const blockExplorerUrl =
  configuredExplorerUrl ?? activeChain.blockExplorers?.default.url ?? "";

export const wagmiConfig = createConfig({
  chains: supportedChains,
  connectors: [injected()],
  ssr: true,
  transports: {
    [anvil.id]: http(configuredChainId === anvil.id ? configuredRpcUrl : undefined),
    [sepolia.id]: http(configuredChainId === sepolia.id ? configuredRpcUrl : undefined)
  }
});

export const queryClient = new QueryClient();

export function explorerLink(type: "address" | "tx", value: string | null | undefined): string {
  if (!value || !blockExplorerUrl || activeChain.id === anvil.id) {
    return "";
  }
  return `${blockExplorerUrl.replace(/\/$/, "")}/${type}/${value}`;
}
