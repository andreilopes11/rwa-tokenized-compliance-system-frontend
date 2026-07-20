import { fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/renderWithProviders";
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
  }),
  useReadContract: () => ({
    data: undefined,
    isFetching: false
  })
}));

vi.mock("@/features/investor/hooks/useInvestorChainReads", () => ({
  useInvestorChainReads: () => ({
    chainReadsEnabled: false,
    tokenBalanceFormatted: null,
    registryVerifiedOnChain: undefined,
    recipientVerifiedOnChain: undefined,
    tokenPausedOnChain: undefined,
    balanceLoading: false,
    verifiedLoading: false,
    recipientVerifiedLoading: false
  })
}));

vi.mock("next/dynamic", () => ({
  default: () => {
    function MockChart() {
      return <div data-testid="portfolio-chart">chart</div>;
    }
    return MockChart;
  }
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn()
  }),
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams()
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
    if ("ethereum" in window) {
      delete (window as Window & { ethereum?: unknown }).ethereum;
    }
  });

  afterEach(() => {
    Object.defineProperty(window, "ethereum", {
      configurable: true,
      value: undefined
    });
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it("blocks KYC when session wallet differs from submitted wallet", async () => {
    const sessionWallet = "0x2222222222222222222222222222222222222222";
    renderWithProviders(<InvestorDashboard sessionWalletAddress={sessionWallet} />);

    fireEvent.change(screen.getByLabelText(/document reference/i), {
      target: { value: "passport://case-123" }
    });
    fireEvent.change(screen.getByLabelText(/wallet address/i), {
      target: { value: wallet }
    });
    fireEvent.click(screen.getByRole("button", { name: /submit kyc/i }));

    expect(await screen.findByText(/must match your session wallet/i)).toBeInTheDocument();
  });

  it("shows a wallet-unavailable error when no injected provider exists", async () => {
    renderWithProviders(<InvestorDashboard />);

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

    renderWithProviders(<InvestorDashboard />);

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
    expect(screen.getByText(/status will update automatically/i)).toBeInTheDocument();
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

    renderWithProviders(<InvestorDashboard />);

    fireEvent.click(screen.getByRole("button", { name: /connect wallet/i }));
    await screen.findByText(/investor status refreshed/i);

    fireEvent.change(document.getElementById("subscribe-33333333-3333-4333-8333-333333333333")!, {
      target: { value: "25" }
    });
    const publicSubscribe = screen
      .getAllByRole("button", { name: /^subscribe$/i })
      .find((btn: HTMLElement) =>
        btn.closest('[aria-label="LREIF lifecycle actions"]')
      );
    expect(publicSubscribe).toBeTruthy();
    fireEvent.click(publicSubscribe!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/assets/33333333-3333-4333-8333-333333333333/subscriptions"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ walletAddress: wallet, amount: 25 })
        })
      );
    });
    await waitFor(() => {
      expect(screen.getByText(/investor status refreshed/i)).toBeInTheDocument();
    });

    fireEvent.change(document.getElementById("redeem-33333333-3333-4333-8333-333333333333")!, {
      target: { value: "5" }
    });
    const publicRedeem = screen
      .getAllByRole("button", { name: /^redeem$/i })
      .find((btn: HTMLElement) => btn.closest('[aria-label="LREIF lifecycle actions"]'));
    expect(publicRedeem).toBeTruthy();
    fireEvent.click(publicRedeem!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/assets/33333333-3333-4333-8333-333333333333/redemptions"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ walletAddress: wallet, amount: 5 })
        })
      );
    });
    await waitFor(() => {
      expect(screen.getAllByText(/investor status refreshed/i).length).toBeGreaterThan(0);
    });
  });

  it("splits ACTIVE offerings into public and private marketplace sections", async () => {
    const fetchMock = vi.fn(mockFetchApproved);
    vi.stubGlobal("fetch", fetchMock);
    Object.defineProperty(window, "ethereum", {
      configurable: true,
      value: { request: vi.fn().mockResolvedValue([wallet]) }
    });

    renderWithProviders(<InvestorDashboard sessionWalletAddress={wallet} />);

    await waitFor(() => {
      expect(screen.getByText("Lisbon Real Estate Income Fund")).toBeInTheDocument();
    });
    expect(screen.getByText("Private Credit Note")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /public contracts/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /private contracts/i })).toBeInTheDocument();

    const assetsCalls = fetchMock.mock.calls.filter(([url]) =>
      String(url).includes("/api/assets") && !String(url).includes("/subscriptions")
    );
    expect(assetsCalls.length).toBeGreaterThan(0);
    for (const [url] of assetsCalls) {
      expect(String(url)).not.toMatch(/walletAddress=/);
      expect(String(url)).not.toMatch(/identityHash=/);
    }
  });

  it("disables subscribe when investor is not APPROVED + onChainVerified", async () => {
    vi.stubGlobal("fetch", vi.fn(mockFetch));
    Object.defineProperty(window, "ethereum", {
      configurable: true,
      value: { request: vi.fn().mockResolvedValue([wallet]) }
    });

    renderWithProviders(<InvestorDashboard sessionWalletAddress={wallet} />);

    await waitFor(() => {
      expect(screen.getByText("Lisbon Real Estate Income Fund")).toBeInTheDocument();
    });

    const subscribeButtons = screen.getAllByRole("button", { name: /^subscribe$/i });
    expect(subscribeButtons.length).toBeGreaterThan(0);
    for (const button of subscribeButtons) {
      expect(button).toBeDisabled();
    }
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
        visibility: "PUBLIC",
        supplyCap: 1000000,
        navPrice: 100,
        issuerName: "RWA Compliance Issuer",
        issuerMetadata: "Simulated portfolio asset backed by tokenized real estate shares.",
        tokenAddress: null,
        createdAt: "2026-05-03T00:00:00Z",
        updatedAt: "2026-05-03T00:00:00Z"
      },
      {
        assetId: "77777777-7777-4777-8777-777777777777",
        name: "Private Credit Note",
        symbol: "PCN",
        assetType: "CREDIT",
        jurisdiction: "PT",
        status: "ACTIVE",
        visibility: "PRIVATE",
        supplyCap: 500000,
        navPrice: 100,
        issuerName: "RWA Compliance Issuer",
        issuerMetadata: "Granted investors only.",
        tokenAddress: null,
        createdAt: "2026-05-03T00:00:00Z",
        updatedAt: "2026-05-03T00:00:00Z"
      }
    ]);
  }

  if (url.includes("/api/investors/") && url.includes("/positions")) {
    return jsonResponse([]);
  }

  if (url.includes("/financial-summary")) {
    return jsonResponse(defaultFinancialSummary());
  }

  if (url.includes("/tax-summary")) {
    return jsonResponse(defaultTaxSummary());
  }

  if (url.includes("/notifications")) {
    return jsonResponse([]);
  }

  if (url.includes("/tutorials")) {
    return jsonResponse([]);
  }

  if (url.includes("/audit-events")) {
    return jsonResponse([]);
  }

  if (url.includes("/api/fees/quote")) {
    return jsonResponse(defaultFeeQuote());
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
        visibility: "PUBLIC",
        supplyCap: 1000000,
        navPrice: 100,
        issuerName: "RWA Compliance Issuer",
        issuerMetadata: "Simulated portfolio asset backed by tokenized real estate shares.",
        tokenAddress: null,
        createdAt: "2026-05-03T00:00:00Z",
        updatedAt: "2026-05-03T00:00:00Z"
      },
      {
        assetId: "77777777-7777-4777-8777-777777777777",
        name: "Private Credit Note",
        symbol: "PCN",
        assetType: "CREDIT",
        jurisdiction: "PT",
        status: "ACTIVE",
        visibility: "PRIVATE",
        supplyCap: 500000,
        navPrice: 100,
        issuerName: "RWA Compliance Issuer",
        issuerMetadata: "Granted investors only.",
        tokenAddress: null,
        createdAt: "2026-05-03T00:00:00Z",
        updatedAt: "2026-05-03T00:00:00Z"
      }
    ]);
  }

  if (url.includes("/financial-summary")) {
    return jsonResponse(defaultFinancialSummary());
  }

  if (url.includes("/tax-summary")) {
    return jsonResponse(defaultTaxSummary());
  }

  if (url.includes("/notifications")) {
    return jsonResponse([]);
  }

  if (url.includes("/tutorials")) {
    return jsonResponse([]);
  }

  if (url.includes("/audit-events")) {
    return jsonResponse([]);
  }

  if (url.includes("/api/fees/quote")) {
    return jsonResponse(defaultFeeQuote());
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

function defaultFinancialSummary() {
  return {
    walletAddress: wallet,
    baseCurrency: "EUR",
    secondaryCurrency: "USD",
    totalValue: 0,
    totalValueSecondary: 0,
    fxRate: 1.08,
    positions: [],
    disclaimer: "Indicative only. Not tax, legal, or investment advice.",
    asOf: "2026-05-03T00:00:00Z"
  };
}

function defaultTaxSummary() {
  return {
    walletAddress: wallet,
    jurisdiction: "PT/EU",
    currency: "EUR",
    portfolioValue: 0,
    estimatedWithholding: 0,
    taxableEventsCount: 0,
    summary: "Indicative EU tax summary.",
    disclaimer: "Not tax advice.",
    asOf: "2026-05-03T00:00:00Z"
  };
}

function defaultFeeQuote() {
  return {
    quoteId: "fee-quote-1",
    walletAddress: wallet,
    assetId: "33333333-3333-4333-8333-333333333333",
    lifecycleType: "SUBSCRIPTION",
    amount: 25,
    currency: "EUR",
    platformFee: 1,
    networkFeeEstimate: 0.5,
    regulatoryFee: 0.25,
    totalFees: 1.75,
    totalAmount: 26.75,
    disclaimer: "Fee quote subject to issuer policy and applicable regulations."
  };
}
