"use client";

import { QueryClient } from "@tanstack/react-query";
import { http, createConfig, injected } from "wagmi";
import { sepolia } from "wagmi/chains";
import type { Chain } from "viem";

export const anvil: Chain = {
  id: 31337,
  name: "Anvil",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH"
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"]
    }
  },
  blockExplorers: {
    default: {
      name: "Local EVM",
      url: "http://localhost:8545"
    }
  }
};

const configuredChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? anvil.id);
const configuredRpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
const configuredExplorerUrl = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL;

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
