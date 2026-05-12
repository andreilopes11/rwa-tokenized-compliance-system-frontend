import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdminDashboard } from "./AdminDashboard";

const wallet = "0x1111111111111111111111111111111111111111";
const requestId = "9b7a17cd-52da-4dd5-a235-c6ffda1f6cb7";
const subscriptionId = "44444444-4444-4444-8444-444444444444";

vi.mock("@/shared/lib/web3", () => ({
  activeChain: {
    id: 31337,
    name: "Anvil"
  },
  explorerLink: () => ""
}));

describe("AdminDashboard", () => {
  afterEach(() => {
    window.sessionStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("loads KYC queue and approves a pending request with the admin token", async () => {
    const fetchMock = vi.fn(mockFetch);
    vi.stubGlobal("fetch", fetchMock);

    render(<AdminDashboard />);

    fireEvent.change(screen.getByLabelText(/admin token/i), {
      target: { value: "local-admin-token" }
    });
    fireEvent.click(screen.getByRole("button", { name: /save token/i }));

    expect((await screen.findAllByText("0x1111...1111")).length).toBeGreaterThan(0);
    expect(screen.getByText("REQUEST_CREATED")).toBeInTheDocument();
    expect(screen.getByText("Lisbon Real Estate Income Fund")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /approve/i })[0]);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(`/api/admin/kyc/requests/${requestId}/approve`),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "X-Admin-Token": "local-admin-token"
          })
        })
      );
    });
    expect(await screen.findByText(/approval submitted/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /approve/i })[1]);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(`/api/admin/subscriptions/${subscriptionId}/approve`),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "X-Admin-Token": "local-admin-token"
          })
        })
      );
    });
  });
});

async function mockFetch(input: RequestInfo | URL) {
  const url = String(input);

  if (url.includes("/api/admin/kyc/requests/") && url.endsWith("/approve")) {
    return jsonResponse(kycRequest("APPROVED", "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"));
  }

  if (url.includes("/api/admin/subscriptions/") && url.endsWith("/approve")) {
    return jsonResponse(subscriptionRequest("APPROVED"));
  }

  if (url.includes("/api/admin/kyc/requests")) {
    return jsonResponse([kycRequest("PENDING", null)]);
  }

  if (url.includes("/api/admin/subscriptions")) {
    return jsonResponse([subscriptionRequest("PENDING")]);
  }

  if (url.includes("/api/admin/redemptions")) {
    return jsonResponse([
      {
        redemptionId: "55555555-5555-4555-8555-555555555555",
        assetId: "33333333-3333-4333-8333-333333333333",
        walletAddress: wallet,
        amount: 5,
        status: "PENDING",
        transactionHash: null,
        decisionReason: null,
        requestedAt: "2026-05-03T00:00:00Z",
        updatedAt: "2026-05-03T00:00:01Z",
        approvedAt: null,
        rejectedAt: null,
        message: "Redemption request received."
      }
    ]);
  }

  if (url.includes("/api/admin/assets/") && url.endsWith("/pause")) {
    return jsonResponse({
      tokenAddress: null,
      paused: false,
      transactionHash: null
    });
  }

  if (url.includes("/api/admin/audit-events")) {
    return jsonResponse([
      {
        eventId: "2b7a17cd-52da-4dd5-a235-c6ffda1f6cb7",
        category: "KYC",
        action: "REQUEST_CREATED",
        actor: "system",
        targetType: "wallet",
        targetId: wallet,
        walletAddress: wallet,
        requestId,
        metadataHash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        transactionHash: null,
        outcome: "PENDING",
        message: "KYC request received.",
        createdAt: "2026-05-03T00:00:00Z"
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

  return jsonResponse({});
}

function kycRequest(status: string, transactionHash: string | null) {
  return {
    requestId,
    walletAddress: wallet,
    identityHash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    status,
    transactionHash,
    submittedAt: "2026-05-03T00:00:00Z",
    updatedAt: "2026-05-03T00:00:01Z",
    message: "KYC request received."
  };
}

function subscriptionRequest(status: string) {
  return {
    subscriptionId,
    assetId: "33333333-3333-4333-8333-333333333333",
    walletAddress: wallet,
    amount: 25,
    status,
    transactionHash: status === "APPROVED" ? "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc" : null,
    decisionReason: null,
    requestedAt: "2026-05-03T00:00:00Z",
    updatedAt: "2026-05-03T00:00:01Z",
    approvedAt: status === "APPROVED" ? "2026-05-03T00:00:02Z" : null,
    rejectedAt: null,
    message: "Subscription request received."
  };
}

function jsonResponse(payload: unknown) {
  return {
    ok: true,
    json: async () => payload
  } as Response;
}
