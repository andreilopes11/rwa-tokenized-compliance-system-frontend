import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InvestorDashboard } from "./InvestorDashboard";

const wallet = "0x1111111111111111111111111111111111111111";

const wagmiMock = vi.hoisted(() => ({
  account: {
    address: undefined as string | undefined,
    isConnected: false
  },
  chainId: 31337,
  connectAsync: vi.fn(),
  disconnect: vi.fn(),
  switchChainAsync: vi.fn(),
  connectors: [{ id: "injected", name: "Injected" }]
}));

vi.mock("wagmi", () => ({
  useAccount: () => wagmiMock.account,
  useChainId: () => wagmiMock.chainId,
  useConnect: () => ({
    connectors: wagmiMock.connectors,
    connectAsync: wagmiMock.connectAsync,
    isPending: false
  }),
  useDisconnect: () => ({
    disconnect: wagmiMock.disconnect
  }),
  useSwitchChain: () => ({
    switchChainAsync: wagmiMock.switchChainAsync,
    isPending: false
  })
}));

vi.mock("@/shared/lib/web3", () => ({
  activeChain: {
    id: 31337,
    name: "Anvil"
  },
  explorerLink: () => ""
}));

describe("InvestorDashboard", () => {
  beforeEach(() => {
    wagmiMock.account.address = undefined;
    wagmiMock.account.isConnected = false;
    wagmiMock.chainId = 31337;
    wagmiMock.connectors = [{ id: "injected", name: "Injected" }];
    wagmiMock.connectAsync.mockResolvedValue({ accounts: [wallet] });
    wagmiMock.disconnect.mockReset();
    wagmiMock.switchChainAsync.mockResolvedValue(undefined);
  });

  afterEach(() => {
    Object.defineProperty(window, "ethereum", {
      configurable: true,
      value: undefined
    });
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("shows a wallet-unavailable error when no injected provider exists", async () => {
    render(<InvestorDashboard />);

    fireEvent.click(screen.getByRole("button", { name: /connect wallet/i }));

    expect(await screen.findByText(/no injected wallet/i)).toBeInTheDocument();
  });

  it("submits a KYC request and renders pending status", async () => {
    vi.stubGlobal("fetch", vi.fn(mockFetch));
    Object.defineProperty(window, "ethereum", {
      configurable: true,
      value: {
        request: vi.fn().mockResolvedValue([wallet])
      }
    });

    render(<InvestorDashboard />);

    fireEvent.click(screen.getByRole("button", { name: /connect wallet/i }));
    await screen.findByText(/investor status refreshed/i);
    expect(wagmiMock.connectAsync).toHaveBeenCalledWith({
      connector: wagmiMock.connectors[0],
      chainId: 31337
    });

    fireEvent.change(screen.getByLabelText(/document reference/i), {
      target: { value: "passport://case-123" }
    });
    fireEvent.click(screen.getByRole("button", { name: /submit kyc/i }));

    await waitFor(() => {
      expect(screen.getAllByText("PENDING").length).toBeGreaterThan(0);
    });
    expect(screen.getByText(/only the document hash/i)).toBeInTheDocument();
    expect(screen.getByText("Lisbon Real Estate Income Fund")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /revoke/i })).not.toBeInTheDocument();
  });

  it("submits subscription and redemption lifecycle requests", async () => {
    const fetchMock = vi.fn(mockFetchApproved);
    vi.stubGlobal("fetch", fetchMock);
    Object.defineProperty(window, "ethereum", {
      configurable: true,
      value: {
        request: vi.fn().mockResolvedValue([wallet])
      }
    });

    render(<InvestorDashboard />);

    fireEvent.click(screen.getByRole("button", { name: /connect wallet/i }));
    await screen.findByText(/investor status refreshed/i);

    fireEvent.change(screen.getByLabelText(/subscription amount/i), {
      target: { value: "25" }
    });
    fireEvent.click(screen.getByRole("button", { name: /subscribe/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/assets/33333333-3333-4333-8333-333333333333/subscriptions"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ walletAddress: wallet, amount: 25 })
        })
      );
    });
    expect(await screen.findByText(/subscription request pending/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/redemption amount/i), {
      target: { value: "5" }
    });
    fireEvent.click(screen.getByRole("button", { name: /redeem/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/assets/33333333-3333-4333-8333-333333333333/redemptions"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ walletAddress: wallet, amount: 5 })
        })
      );
    });
    expect(await screen.findByText(/redemption request pending/i)).toBeInTheDocument();
  });
});

async function mockFetch(input: RequestInfo | URL) {
  const url = String(input);
  if (url.includes("/api/kyc/requests")) {
    return jsonResponse({
      requestId: "9b7a17cd-52da-4dd5-a235-c6ffda1f6cb7",
      walletAddress: wallet,
      identityHash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      status: "PENDING",
      transactionHash: null,
      submittedAt: "2026-05-03T00:00:00Z",
      updatedAt: "2026-05-03T00:00:01Z",
      message: "KYC request received."
    });
  }

  if (url.includes("/api/assets")) {
    return jsonResponse([
      {
        assetId: "33333333-3333-4333-8333-333333333333",
        name: "Lisbon Real Estate Income Fund",
        symbol: "LREIF",
        assetType: "REAL_ESTATE",
        jurisdiction: "PT",
        status: "ACTIVE",
        supplyCap: 1000000,
        navPrice: 100,
        issuerName: "Demo RWA Issuer",
        issuerMetadata: "Simulated portfolio asset backed by tokenized real estate shares.",
        tokenAddress: null,
        createdAt: "2026-05-03T00:00:00Z",
        updatedAt: "2026-05-03T00:00:00Z"
      }
    ]);
  }

  if (url.includes("/api/investors/") && url.includes("/positions")) {
    return jsonResponse([]);
  }

  return jsonResponse({
    walletAddress: wallet,
    status: "PENDING",
    onChainVerified: false,
    requestId: "9b7a17cd-52da-4dd5-a235-c6ffda1f6cb7",
    identityHash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    transactionHash: null,
    message: "KYC request received."
  });
}

async function mockFetchApproved(input: RequestInfo | URL) {
  const url = String(input);

  if (url.includes("/subscriptions")) {
    return jsonResponse({
      subscriptionId: "44444444-4444-4444-8444-444444444444",
      assetId: "33333333-3333-4333-8333-333333333333",
      walletAddress: wallet,
      amount: 25,
      status: "PENDING",
      transactionHash: null,
      decisionReason: null,
      requestedAt: "2026-05-03T00:00:00Z",
      updatedAt: "2026-05-03T00:00:00Z",
      approvedAt: null,
      rejectedAt: null,
      message: "Subscription request received."
    });
  }

  if (url.includes("/redemptions")) {
    return jsonResponse({
      redemptionId: "55555555-5555-4555-8555-555555555555",
      assetId: "33333333-3333-4333-8333-333333333333",
      walletAddress: wallet,
      amount: 5,
      status: "PENDING",
      transactionHash: null,
      decisionReason: null,
      requestedAt: "2026-05-03T00:00:00Z",
      updatedAt: "2026-05-03T00:00:00Z",
      approvedAt: null,
      rejectedAt: null,
      message: "Redemption request received."
    });
  }

  if (url.includes("/api/investors/") && url.includes("/positions")) {
    return jsonResponse([
      {
        positionId: "66666666-6666-4666-8666-666666666666",
        assetId: "33333333-3333-4333-8333-333333333333",
        walletAddress: wallet,
        balanceSnapshot: 40,
        lastChainSync: "2026-05-03T00:00:00Z",
        updatedAt: "2026-05-03T00:00:00Z"
      }
    ]);
  }

  if (url.includes("/api/assets")) {
    return jsonResponse([
      {
        assetId: "33333333-3333-4333-8333-333333333333",
        name: "Lisbon Real Estate Income Fund",
        symbol: "LREIF",
        assetType: "REAL_ESTATE",
        jurisdiction: "PT",
        status: "ACTIVE",
        supplyCap: 1000000,
        navPrice: 100,
        issuerName: "Demo RWA Issuer",
        issuerMetadata: "Simulated portfolio asset backed by tokenized real estate shares.",
        tokenAddress: null,
        createdAt: "2026-05-03T00:00:00Z",
        updatedAt: "2026-05-03T00:00:00Z"
      }
    ]);
  }

  return jsonResponse({
    walletAddress: wallet,
    status: "APPROVED",
    onChainVerified: true,
    requestId: "9b7a17cd-52da-4dd5-a235-c6ffda1f6cb7",
    identityHash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    transactionHash: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    message: "Investor approved and submitted to the identity registry."
  });
}

function jsonResponse(payload: unknown) {
  return {
    ok: true,
    json: async () => payload
  } as Response;
}
