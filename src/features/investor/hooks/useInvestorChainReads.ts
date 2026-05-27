"use client";

import { formatUnits } from "viem";
import { useReadContract } from "wagmi";

const erc20BalanceAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  }
] as const;

const identityRegistryAbi = [
  {
    type: "function",
    name: "isVerified",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "bool" }]
  }
] as const;

const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}` | undefined;
const registryAddress = process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS as `0x${string}` | undefined;

export function useInvestorChainReads(walletAddress: string | undefined, recipientAddress?: string) {
  const investor = walletAddress as `0x${string}` | undefined;
  const recipient = recipientAddress as `0x${string}` | undefined;
  const enabled = Boolean(investor && /^0x[a-fA-F0-9]{40}$/.test(investor));
  const recipientEnabled = Boolean(recipient && /^0x[a-fA-F0-9]{40}$/.test(recipient));

  const balanceRead = useReadContract({
    address: tokenAddress,
    abi: erc20BalanceAbi,
    functionName: "balanceOf",
    args: investor ? [investor] : undefined,
    query: { enabled: enabled && Boolean(tokenAddress) }
  });

  const verifiedRead = useReadContract({
    address: registryAddress,
    abi: identityRegistryAbi,
    functionName: "isVerified",
    args: investor ? [investor] : undefined,
    query: { enabled: enabled && Boolean(registryAddress) }
  });

  const recipientVerifiedRead = useReadContract({
    address: registryAddress,
    abi: identityRegistryAbi,
    functionName: "isVerified",
    args: recipient ? [recipient] : undefined,
    query: { enabled: recipientEnabled && Boolean(registryAddress) }
  });

  const tokenBalanceFormatted =
    balanceRead.data !== undefined ? formatUnits(balanceRead.data, 18) : null;

  return {
    chainReadsEnabled: enabled && Boolean(tokenAddress || registryAddress),
    tokenBalanceFormatted,
    registryVerifiedOnChain: verifiedRead.data,
    recipientVerifiedOnChain: recipientVerifiedRead.data,
    balanceLoading: balanceRead.isFetching,
    verifiedLoading: verifiedRead.isFetching,
    recipientVerifiedLoading: recipientVerifiedRead.isFetching
  };
}
