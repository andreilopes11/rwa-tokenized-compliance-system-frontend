"use client";

import {
  AlertTriangle,
  Bell,
  BookOpen,
  Calculator,
  CheckCircle2,
  FileCheck2,
  Landmark,
  RefreshCw,
  Send,
  ShieldCheck,
  Wallet,
  XCircle
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useChainId, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { fetchAssetOfferings } from "@/features/assets/api/client";
import {
  createRedemption,
  createSubscription,
  fetchFinancialSummary,
  fetchInvestorAuditEvents,
  fetchInvestorPositions,
  fetchInvestorStatus,
  fetchKycRequest,
  fetchNotifications,
  markNotificationRead,
  quoteFees,
  submitKycRequest,
  fetchTaxSummary,
  fetchTutorials
} from "@/features/investor/api/client";
import { useInvestorChainReads } from "@/features/investor/hooks/useInvestorChainReads";
import { isApiError } from "@/shared/api/errors";
import type {
  AssetOfferingResponse,
  AuditEventResponse,
  FeeQuoteResponse,
  FinancialSummaryResponse,
  InvestorStatusResponse,
  KycRequestResponse,
  NotificationResponse,
  PositionResponse,
  TaxSummaryResponse,
  TutorialResponse
} from "@/shared/api/types";
import { copy } from "@/shared/lib/copy";
import {
  isWalletAddress,
  shortenAddress,
  statusClass,
  statusLabel
} from "@/shared/lib/formatters";
import { activeChain, explorerLink } from "@/shared/lib/web3";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { DashboardHero } from "@/shared/ui/DashboardHero";
import { SiteTopBar } from "@/shared/ui/SiteTopBar";

const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? "";
const registryAddress = process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS ?? "";
const KYC_POLL_MS = 4000;
const TERMINAL_KYC_STATUSES = new Set(["APPROVED", "REJECTED", "FAILED_ON_CHAIN", "REVOKED"]);

const PortfolioChart = dynamic(
  () => import("./PortfolioChart").then((module) => module.PortfolioChart),
  {
    ssr: false,
    loading: () => <div className="empty-state">Loading chart…</div>
  }
);

type InvestorDashboardProps = {
  sessionWalletAddress?: string;
};

export function InvestorDashboard({ sessionWalletAddress }: InvestorDashboardProps) {
  const router = useRouter();
  const account = useAccount();
  const currentChainId = useChainId();
  const { connectors, connectAsync, isPending: walletConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync, isPending: switchingNetwork } = useSwitchChain();

  const [walletAddress, setWalletAddress] = useState("");
  const [documentReference, setDocumentReference] = useState("");
  const [request, setRequest] = useState<KycRequestResponse | null>(null);
  const [status, setStatus] = useState<InvestorStatusResponse | null>(null);
  const [assets, setAssets] = useState<AssetOfferingResponse[]>([]);
  const [positions, setPositions] = useState<PositionResponse[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEventResponse[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummaryResponse | null>(null);
  const [taxSummary, setTaxSummary] = useState<TaxSummaryResponse | null>(null);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [tutorials, setTutorials] = useState<TutorialResponse[]>([]);
  const [feeQuotes, setFeeQuotes] = useState<Record<string, FeeQuoteResponse>>({});
  const [subscriptionAmounts, setSubscriptionAmounts] = useState<Record<string, string>>({});
  const [redemptionAmounts, setRedemptionAmounts] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [gatewayError, setGatewayError] = useState("");
  const [assetError, setAssetError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [pollingKyc, setPollingKyc] = useState(false);

  const chainReads = useInvestorChainReads(walletAddress);
  const activeStatus = status?.status ?? request?.status ?? "PENDING";
  const registryVerified =
    chainReads.registryVerifiedOnChain ?? status?.onChainVerified ?? false;
  const rejectMessage =
    activeStatus === "REJECTED" || activeStatus === "FAILED_ON_CHAIN"
      ? status?.message ?? request?.message ?? "KYC request was not approved."
      : "";
  const latestTxHash = status?.transactionHash ?? request?.transactionHash ?? null;
  const latestTxExplorer = explorerLink("tx", latestTxHash);
  const canSubmit = isWalletAddress(walletAddress) && documentReference.trim().length > 2 && !loading;
  const canRefresh = isWalletAddress(walletAddress) && !loading;
  const lifecycleReady = Boolean(registryVerified && status?.status === "APPROVED" && isWalletAddress(walletAddress));
  const wrongNetwork = account.isConnected && currentChainId !== activeChain.id;
  const chartData =
    financialSummary?.positions?.map((position) => ({
      name: position.symbol,
      value: position.value
    })) ?? [];
  const unreadNotifications = (notifications ?? []).filter((notification) => !notification.read).length;

  const activity = useMemo(
    () => [
      {
        label: "Identity registry",
        value: registryAddress || "Set NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS",
        href: explorerLink("address", registryAddress)
      },
      {
        label: "Permissioned token",
        value: tokenAddress || "Set NEXT_PUBLIC_TOKEN_ADDRESS",
        href: explorerLink("address", tokenAddress)
      },
      {
        label: "Latest authorization tx",
        value: status?.transactionHash ?? request?.transactionHash ?? "No transaction yet",
        href: explorerLink("tx", status?.transactionHash ?? request?.transactionHash)
      }
    ],
    [request, status]
  );
  const heroPills = useMemo(
    () => [
      {
        icon: <ShieldCheck size={14} />,
        label: wrongNetwork ? `Switch from chain ${currentChainId}` : `${activeChain.name} network aligned`,
        tone: wrongNetwork ? ("warning" as const) : ("success" as const)
      },
      {
        icon: <Wallet size={14} />,
        label: account.isConnected ? "Wallet connected" : "Manual wallet mode",
        tone: account.isConnected ? ("success" as const) : ("neutral" as const)
      },
      {
        icon: <FileCheck2 size={14} />,
        label: `KYC ${statusLabel(activeStatus).toLowerCase()}`,
        tone:
          activeStatus === "APPROVED"
            ? ("success" as const)
            : activeStatus === "PENDING"
              ? ("warning" as const)
              : ("danger" as const)
      },
      {
        icon: <Landmark size={14} />,
        label: lifecycleReady ? "Lifecycle actions enabled" : "Lifecycle gated by compliance",
        tone: lifecycleReady ? ("success" as const) : ("warning" as const)
      }
    ],
    [account.isConnected, activeStatus, currentChainId, lifecycleReady, wrongNetwork]
  );
  const heroStats = useMemo(
    () => [
      {
        icon: <Wallet size={16} />,
        label: "Tracked wallet",
        note: "Connected wallet or manual API lookup target.",
        tone: account.isConnected ? ("success" as const) : ("neutral" as const),
        value: walletAddress ? shortenAddress(walletAddress) : "Not set"
      },
      {
        icon: <CheckCircle2 size={16} />,
        label: "Eligibility state",
        note: registryVerified
          ? "Verified for transfer gating and lifecycle requests."
          : "Awaiting approval or registry synchronization.",
        tone:
          activeStatus === "APPROVED"
            ? ("success" as const)
            : activeStatus === "PENDING"
              ? ("warning" as const)
              : ("danger" as const),
        value: statusLabel(activeStatus)
      },
      {
        icon: <Landmark size={16} />,
        label: "Portfolio positions",
        note: "Live positions returned from the investor API.",
        tone: positions.length > 0 ? ("success" as const) : ("neutral" as const),
        value: positions.length
      },
      {
        icon: <Bell size={16} />,
        label: "Unread notices",
        note: "Operational nudges, lifecycle updates, and support prompts.",
        tone: unreadNotifications > 0 ? ("warning" as const) : ("neutral" as const),
        value: unreadNotifications
      }
    ],
    [account.isConnected, activeStatus, positions.length, registryVerified, unreadNotifications, walletAddress]
  );
  const commonCopy = copy.common;

  const reportRequestError = useCallback((err: unknown, fallback: string) => {
    if (isApiError(err) && err.retryable) {
      setGatewayError(err.message);
      setError("");
      return;
    }
    setGatewayError("");
    setError(err instanceof Error ? err.message : fallback);
  }, []);

  useEffect(() => {
    if (sessionWalletAddress) {
      setWalletAddress(sessionWalletAddress);
    } else if (account.address) {
      setWalletAddress(account.address);
    }
  }, [account.address, sessionWalletAddress]);

  useEffect(() => {
    void refreshAssets();
  }, []);

  useEffect(() => {
    if (!request?.requestId || !isWalletAddress(walletAddress)) {
      setPollingKyc(false);
      return;
    }
    if (TERMINAL_KYC_STATUSES.has(activeStatus)) {
      setPollingKyc(false);
      return;
    }

    setPollingKyc(true);
    const intervalId = window.setInterval(() => {
      void (async () => {
        try {
          const [kyc, statusResponse] = await Promise.all([
            fetchKycRequest(request.requestId),
            fetchInvestorStatus(walletAddress)
          ]);
          setRequest(kyc);
          setStatus(statusResponse);
          if (TERMINAL_KYC_STATUSES.has(statusResponse.status)) {
            setNotice(
              statusResponse.status === "APPROVED"
                ? "KYC approved. On-chain authorization is reflected below."
                : "KYC review completed."
            );
          }
        } catch {
          // Polling errors are non-fatal; manual refresh remains available.
        }
      })();
    }, KYC_POLL_MS);

    return () => {
      window.clearInterval(intervalId);
      setPollingKyc(false);
    };
  }, [activeStatus, request?.requestId, walletAddress]);

  async function refreshAssets() {
    setAssetError("");
    try {
      setAssets(await fetchAssetOfferings({ status: "ACTIVE", limit: 5 }));
    } catch (err) {
      setAssetError(err instanceof Error ? err.message : "Asset offering refresh failed.");
    }
  }

  async function connectWallet() {
    setError("");
    setNotice("");
    if (typeof window !== "undefined" && !("ethereum" in window)) {
      setError("No injected wallet was found. Install or enable a browser wallet to continue.");
      return;
    }
    const connector = connectors[0];
    if (!connector) {
      setError("No injected wallet connector is available.");
      return;
    }

    try {
      const result = await connectAsync({ connector, chainId: activeChain.id });
      const connectedAddress = result.accounts[0] ?? "";
      if (connectedAddress) {
        setWalletAddress(connectedAddress);
        await refreshStatus(connectedAddress);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wallet connection failed.");
    }
  }

  async function switchNetwork() {
    setError("");
    setNotice("");
    try {
      await switchChainAsync({ chainId: activeChain.id });
      setNotice(`Wallet switched to ${activeChain.name}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Switch to ${activeChain.name} failed.`);
    }
  }

  function disconnectWallet() {
    disconnect();
    setNotice("Wallet disconnected. You can still paste a wallet address for API status checks.");
  }

  async function refreshStatus(address = walletAddress) {
    if (!isWalletAddress(address)) {
      setError("Connect or enter a valid wallet address before refreshing status.");
      return;
    }
    setLoading(true);
    setError("");
    setGatewayError("");
    try {
      const [statusResponse, positionsResponse, eventsResponse] = await Promise.all([
        fetchInvestorStatus(address),
        fetchInvestorPositions(address),
        fetchInvestorAuditEvents(address, 10)
      ]);
      const [financialResponse, taxResponse, notificationResponse, tutorialResponse] = await Promise.all([
        fetchFinancialSummary(address),
        fetchTaxSummary(address, "en"),
        fetchNotifications(address),
        fetchTutorials("en")
      ]);
      setStatus(statusResponse);
      setPositions(positionsResponse);
      setAuditEvents(eventsResponse);
      setFinancialSummary(financialResponse);
      setTaxSummary(taxResponse);
      setNotifications(notificationResponse);
      setTutorials(tutorialResponse);
      setNotice("Investor status refreshed from the compliance API.");
    } catch (err) {
      reportRequestError(err, "Status refresh failed.");
    } finally {
      setLoading(false);
    }
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      setError("Wallet address and document reference are required.");
      return;
    }
    if (
      sessionWalletAddress &&
      walletAddress.toLowerCase() !== sessionWalletAddress.toLowerCase()
    ) {
      setError("KYC wallet must match your session wallet.");
      return;
    }

    setLoading(true);
    setError("");
    setGatewayError("");
    setNotice("");
    try {
      const created = await submitKycRequest(walletAddress, documentReference.trim());
      setRequest(created);
      setStatus(await fetchInvestorStatus(walletAddress));
      setPositions(await fetchInvestorPositions(walletAddress));
      setNotice("KYC request submitted. Status will update automatically while pending review.");
    } catch (err) {
      reportRequestError(err, "KYC submission failed.");
    } finally {
      setLoading(false);
    }
  }

  async function requestSubscription(asset: AssetOfferingResponse) {
    const amount = parseAmount(subscriptionAmounts[asset.assetId]);
    if (!amount) {
      setError("Enter a subscription amount greater than zero.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");
    try {
      const created = await createSubscription(asset.assetId, { walletAddress, amount });
      const quote = await quoteFees({
        amount,
        assetId: asset.assetId,
        currency: "EUR",
        lifecycleType: "SUBSCRIPTION",
        walletAddress
      });
      setFeeQuotes({ ...feeQuotes, [`${asset.assetId}:SUBSCRIPTION`]: quote });
      setSubscriptionAmounts({ ...subscriptionAmounts, [asset.assetId]: "" });
      setNotice(`Subscription request ${statusLabel(created.status).toLowerCase()} for ${asset.symbol}.`);
      await refreshStatus(walletAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Subscription request failed.");
    } finally {
      setLoading(false);
    }
  }

  async function requestRedemption(asset: AssetOfferingResponse) {
    const amount = parseAmount(redemptionAmounts[asset.assetId]);
    if (!amount) {
      setError("Enter a redemption amount greater than zero.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");
    try {
      const created = await createRedemption(asset.assetId, { walletAddress, amount });
      const quote = await quoteFees({
        amount,
        assetId: asset.assetId,
        currency: "EUR",
        lifecycleType: "REDEMPTION",
        walletAddress
      });
      setFeeQuotes({ ...feeQuotes, [`${asset.assetId}:REDEMPTION`]: quote });
      setRedemptionAmounts({ ...redemptionAmounts, [asset.assetId]: "" });
      setNotice(`Redemption request ${statusLabel(created.status).toLowerCase()} for ${asset.symbol}.`);
      await refreshStatus(walletAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Redemption request failed.");
    } finally {
      setLoading(false);
    }
  }

  function positionBalance(assetId: string) {
    return positions.find((position) => position.assetId === assetId)?.balanceSnapshot ?? 0;
  }

  async function quoteLifecycleFees(asset: AssetOfferingResponse, lifecycleType: "SUBSCRIPTION" | "REDEMPTION") {
    const source = lifecycleType === "SUBSCRIPTION" ? subscriptionAmounts : redemptionAmounts;
    const amount = parseAmount(source[asset.assetId]);
    if (!amount) {
      setError("Enter an amount greater than zero before requesting a fee quote.");
      return;
    }
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const quote = await quoteFees({
        amount,
        assetId: asset.assetId,
        currency: "EUR",
        lifecycleType,
        walletAddress
      });
      setFeeQuotes({ ...feeQuotes, [`${asset.assetId}:${lifecycleType}`]: quote });
      setNotice(`Fee quote ready for ${asset.symbol}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fee quote failed.");
    } finally {
      setLoading(false);
    }
  }

  async function markRead(notificationId: string) {
    try {
      const updated = await markNotificationRead(notificationId);
      setNotifications((items) =>
        items.map((item) => (item.notificationId === notificationId ? updated : item))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Notification update failed.");
    }
  }

  async function signOut() {
    setSigningOut(true);
    setError("");
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      disconnect();
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign out.");
    } finally {
      setSigningOut(false);
    }
  }

  const StatusIcon = activeStatus === "APPROVED" ? CheckCircle2 : activeStatus === "PENDING" ? AlertTriangle : XCircle;

  return (
    <main className="experience-shell dashboard-shell">
      <SiteTopBar
        subtitle={`${activeChain.name} chain ${activeChain.id} · off-chain eligibility · on-chain transfer guard`}
        title="Investor / Portfolio Workspace"
        actions={
          <div className="wallet-actions">
            <Link className="nav-link" href="/">
              {commonCopy.landing}
            </Link>
            <Link className="nav-link" href="/admin">
              {commonCopy.adminDashboard}
            </Link>
            {wrongNetwork && (
              <button
                className="secondary-button"
                disabled={switchingNetwork}
                onClick={switchNetwork}
                type="button"
              >
                <RefreshCw size={18} aria-hidden />
                Switch to {activeChain.name}
              </button>
            )}
            {account.isConnected ? (
              <button className="wallet-pill" onClick={disconnectWallet} type="button">
                <Wallet size={18} aria-hidden />
                {shortenAddress(account.address)}
              </button>
            ) : (
              <button
                className="connect-button"
                disabled={walletConnecting}
                onClick={connectWallet}
                type="button"
              >
                <Wallet size={18} aria-hidden />
                Connect wallet
              </button>
            )}
            <Button
              leadingIcon={<XCircle size={16} />}
              loading={signingOut}
              onClick={signOut}
              size="sm"
              variant="ghost"
            >
              {commonCopy.signOut}
            </Button>
          </div>
        }
      />

      <DashboardHero
        description="Monitor onboarding, refresh compliance evidence, and operate subscription or redemption flows with the same context used by backend eligibility and on-chain transfer controls."
        eyebrow="Investor surface"
        pills={heroPills}
        stats={heroStats}
        title="A single workspace for wallet access, compliance visibility, and lifecycle operations"
      />

      <section className="content">
        <div className="panel-grid">
          <section className="panel" aria-labelledby="onboarding-title">
            <h2 id="onboarding-title">Investor onboarding</h2>
            <form onSubmit={submitRequest}>
              <div className="field">
                <label htmlFor="wallet">Wallet address</label>
                <input
                  id="wallet"
                  className="mono"
                  onChange={(event) => setWalletAddress(event.target.value)}
                  placeholder="0x..."
                  readOnly={Boolean(sessionWalletAddress)}
                  value={walletAddress}
                />
                {sessionWalletAddress ? (
                  <p className="helper-text">Wallet is bound to your session and cannot be changed here.</p>
                ) : null}
              </div>
              <div className="field">
                <label htmlFor="document">Document reference</label>
                <input
                  id="document"
                  onChange={(event) => setDocumentReference(event.target.value)}
                  placeholder="passport://case-123"
                  value={documentReference}
                />
              </div>
              <div className="actions">
                <button className="primary-button" disabled={!canSubmit} type="submit">
                  <Send size={18} aria-hidden />
                  Submit KYC
                </button>
                <button className="secondary-button" disabled={!canRefresh} onClick={() => refreshStatus()} type="button">
                  <RefreshCw size={18} aria-hidden />
                  Refresh
                </button>
              </div>
            </form>
            {error && <Alert tone="error">{error}</Alert>}
            {gatewayError ? (
              <Alert tone="error" title="Backend unavailable">
                {gatewayError}
                <div className="actions">
                  <button
                    className="secondary-button"
                    disabled={!canRefresh || loading}
                    onClick={() => {
                      setGatewayError("");
                      void refreshStatus();
                    }}
                    type="button"
                  >
                    <RefreshCw size={16} aria-hidden />
                    Retry
                  </button>
                </div>
              </Alert>
            ) : null}
            {notice && <Alert tone="info">{notice}</Alert>}
            {pollingKyc ? (
              <Alert tone="info">Polling KYC status every few seconds until a final decision is recorded.</Alert>
            ) : null}
          </section>

          <section className="panel" aria-labelledby="status-title">
            <h2 id="status-title">Compliance status</h2>
            {rejectMessage ? <Alert tone="error">{rejectMessage}</Alert> : null}
            {latestTxExplorer ? (
              <Alert tone="success" title="On-chain authorization">
                <a className="external-link" href={latestTxExplorer} rel="noreferrer" target="_blank">
                  View transaction on block explorer
                </a>
              </Alert>
            ) : null}
            <div className="metric-grid">
              <div className="metric">
                <span>Wallet</span>
                <strong className="mono">{shortenAddress(walletAddress)}</strong>
              </div>
              <div className="metric">
                <span>KYC status</span>
                <strong className={`status ${statusClass(activeStatus)}`}>
                  <StatusIcon size={16} aria-hidden />
                  {statusLabel(activeStatus)}
                </strong>
              </div>
              <div className="metric">
                <span>Registry verified (API)</span>
                <strong className={`status ${status?.onChainVerified ? "approved" : "pending"}`}>
                  <ShieldCheck size={16} aria-hidden />
                  {status?.onChainVerified ? "YES" : "NO"}
                </strong>
              </div>
              <div className="metric">
                <span>Registry verified (chain)</span>
                <strong
                  className={`status ${
                    chainReads.registryVerifiedOnChain === true
                      ? "approved"
                      : chainReads.registryVerifiedOnChain === false
                        ? "pending"
                        : "pending"
                  }`}
                >
                  <ShieldCheck size={16} aria-hidden />
                  {chainReads.verifiedLoading
                    ? "…"
                    : chainReads.registryVerifiedOnChain === undefined
                      ? "N/A"
                      : chainReads.registryVerifiedOnChain
                        ? "YES"
                        : "NO"}
                </strong>
              </div>
              <div className="metric">
                <span>Token balance (chain)</span>
                <strong className="mono">
                  {chainReads.balanceLoading
                    ? "…"
                    : chainReads.tokenBalanceFormatted ?? "N/A"}
                </strong>
              </div>
              <div className="metric">
                <span>Network</span>
                <strong className={`status ${wrongNetwork ? "rejected" : "approved"}`}>
                  <ShieldCheck size={16} aria-hidden />
                  {wrongNetwork ? `WRONG (${currentChainId})` : activeChain.name.toUpperCase()}
                </strong>
              </div>
            </div>
          </section>

          <section className="panel" aria-labelledby="portfolio-title">
            <div className="section-header">
              <h2 id="portfolio-title">Portfolio summary</h2>
              <span className="muted">EUR primary · USD indicative</span>
            </div>
            <div className="metric-grid">
              <div className="metric">
                <span>Total EUR</span>
                <strong>{formatCurrency(financialSummary?.totalValue ?? 0, "EUR", "en-GB")}</strong>
              </div>
              <div className="metric">
                <span>Total USD</span>
                <strong>{formatCurrency(financialSummary?.totalValueSecondary ?? 0, "USD")}</strong>
              </div>
              <div className="metric">
                <span>FX</span>
                <strong>{financialSummary?.fxRate ?? "1.080000"}</strong>
              </div>
              <div className="metric">
                <span>Tax events</span>
                <strong>{taxSummary?.taxableEventsCount ?? 0}</strong>
              </div>
            </div>
            <div className="chart-wrap" aria-label="Portfolio lifecycle chart">
              {chartData.length === 0 ? (
                <div className="empty-state">
                  <Calculator size={18} aria-hidden />
                  No position values to chart yet.
                </div>
              ) : (
                <PortfolioChart data={chartData} />
              )}
            </div>
            {taxSummary && (
              <div className="secondary-panel">
                <strong>Tax summary</strong>
                <p className="muted">{taxSummary.summary}</p>
                <span className="muted">
                  Estimated withholding {formatCurrency(taxSummary.estimatedWithholding, "EUR", "en-GB")}
                </span>
                <p className="muted">{taxSummary.disclaimer}</p>
              </div>
            )}
          </section>

          <section className="panel" aria-labelledby="offerings-title">
            <div className="section-header">
              <h2 id="offerings-title">Asset offerings</h2>
              <button className="secondary-button" disabled={loading} onClick={refreshAssets} type="button">
                <RefreshCw size={18} aria-hidden />
                Refresh
              </button>
            </div>
            {assetError && <Alert tone="error">{assetError}</Alert>}
            {assets.length === 0 ? (
              <div className="empty-state">
                <Landmark size={20} aria-hidden />
                No active offerings are available.
              </div>
            ) : (
              <div className="offering-grid">
                {assets.map((asset) => {
                  const subscriptionQuote = feeQuotes[`${asset.assetId}:SUBSCRIPTION`];
                  const redemptionQuote = feeQuotes[`${asset.assetId}:REDEMPTION`];
                  return (
                  <article className="offering-card" key={asset.assetId}>
                    <div>
                      <h3>{asset.name}</h3>
                      <span className={`status ${asset.status === "ACTIVE" ? "approved" : "pending"}`}>
                        {asset.status}
                      </span>
                    </div>
                    <dl className="definition-grid">
                      <div>
                        <dt>Symbol</dt>
                        <dd>{asset.symbol}</dd>
                      </div>
                      <div>
                        <dt>Type</dt>
                        <dd>{asset.assetType.replaceAll("_", " ")}</dd>
                      </div>
                      <div>
                        <dt>NAV</dt>
                        <dd>{formatCurrency(asset.navPrice)}</dd>
                      </div>
                      <div>
                        <dt>Supply cap</dt>
                        <dd>{formatNumber(asset.supplyCap)}</dd>
                      </div>
                      <div>
                        <dt>Position</dt>
                        <dd>{formatNumber(positionBalance(asset.assetId))}</dd>
                      </div>
                    </dl>
                    <p className="muted">{asset.issuerMetadata ?? asset.issuerName}</p>
                    {asset.tokenAddress && (
                      <a className="mono muted external-link" href={explorerLink("address", asset.tokenAddress) || undefined} rel="noreferrer" target="_blank">
                        {asset.tokenAddress}
                      </a>
                    )}
                    <div className="lifecycle-controls" aria-label={`${asset.symbol} lifecycle actions`}>
                      <div className="field compact-field">
                        <label htmlFor={`subscribe-${asset.assetId}`}>Subscription amount</label>
                        <input
                          id={`subscribe-${asset.assetId}`}
                          min={0}
                          onChange={(event) =>
                            setSubscriptionAmounts({
                              ...subscriptionAmounts,
                              [asset.assetId]: event.target.value
                            })
                          }
                          placeholder="100"
                          type="number"
                          value={subscriptionAmounts[asset.assetId] ?? ""}
                        />
                      </div>
                      <button
                        className="secondary-button"
                        disabled={!isWalletAddress(walletAddress) || loading}
                        onClick={() => quoteLifecycleFees(asset, "SUBSCRIPTION")}
                        type="button"
                      >
                        <Calculator size={16} aria-hidden />
                        Quote fee
                      </button>
                      <button
                        className="primary-button"
                        disabled={!lifecycleReady || loading}
                        onClick={() => requestSubscription(asset)}
                        type="button"
                      >
                        <Send size={16} aria-hidden />
                        Subscribe
                      </button>
                      <div className="field compact-field">
                        <label htmlFor={`redeem-${asset.assetId}`}>Redemption amount</label>
                        <input
                          id={`redeem-${asset.assetId}`}
                          min={0}
                          onChange={(event) =>
                            setRedemptionAmounts({
                              ...redemptionAmounts,
                              [asset.assetId]: event.target.value
                            })
                          }
                          placeholder="25"
                          type="number"
                          value={redemptionAmounts[asset.assetId] ?? ""}
                        />
                      </div>
                      <button
                        className="secondary-button"
                        disabled={!isWalletAddress(walletAddress) || loading}
                        onClick={() => quoteLifecycleFees(asset, "REDEMPTION")}
                        type="button"
                      >
                        <Calculator size={16} aria-hidden />
                        Quote fee
                      </button>
                      <button
                        className="secondary-button"
                        disabled={!lifecycleReady || loading || positionBalance(asset.assetId) <= 0}
                        onClick={() => requestRedemption(asset)}
                        type="button"
                      >
                        <RefreshCw size={16} aria-hidden />
                        Redeem
                      </button>
                    </div>
                    {(subscriptionQuote || redemptionQuote) && (
                      <div className="fee-quote-grid">
                        {subscriptionQuote && <FeeQuoteCard title="Subscription fees" quote={subscriptionQuote} />}
                        {redemptionQuote && <FeeQuoteCard title="Redemption fees" quote={redemptionQuote} />}
                      </div>
                    )}
                  </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <aside className="panel" aria-labelledby="activity-title">
          <h2 id="activity-title">Token activity</h2>
          <ul className="activity-list">
            <li>
              <strong>Transfer eligibility</strong>
              <span className="muted">
                Sender and receiver must both be verified before the contract mutates balances.
              </span>
            </li>
            {activity.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong>
                {item.href ? (
                  <a className="mono muted external-link" href={item.href} rel="noreferrer" target="_blank">
                    {item.value}
                  </a>
                ) : (
                  <span className="mono muted">{item.value}</span>
                )}
              </li>
            ))}
            <li>
              <strong>Document evidence</strong>
              <span className="mono muted">
                {status?.identityHash ?? request?.identityHash ?? "No document hash submitted"}
              </span>
            </li>
          </ul>

          <div className="secondary-panel" aria-labelledby="notifications-title">
            <h3 id="notifications-title">
              <Bell size={16} aria-hidden />
              Notifications
            </h3>
            {notifications.length === 0 ? (
              <div className="empty-state">
                <Bell size={16} aria-hidden />
                Refresh a wallet to load notifications.
              </div>
            ) : (
              <ul className="activity-list">
                {notifications.map((notification) => (
                  <li key={notification.notificationId}>
                    <strong>{notification.title}</strong>
                    <span className="muted">{notification.message}</span>
                    {!notification.read && (
                      <button
                        className="secondary-button"
                        onClick={() => markRead(notification.notificationId)}
                        type="button"
                      >
                        Mark read
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="secondary-panel" aria-labelledby="tutorials-title">
            <h3 id="tutorials-title">
              <BookOpen size={16} aria-hidden />
              Tutorials
            </h3>
            <ul className="activity-list">
              {tutorials.map((tutorial) => (
                <li key={tutorial.tutorialId}>
                  <strong>{tutorial.title}</strong>
                  <span className="muted">{tutorial.description}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="secondary-panel" aria-labelledby="history-title">
            <h3 id="history-title">Recent investor activity</h3>
            {auditEvents.length === 0 ? (
              <div className="empty-state">
                <FileCheck2 size={16} aria-hidden />
                No transaction history is available yet.
              </div>
            ) : (
              <ul className="activity-list">
                {auditEvents.map((event) => (
                  <li key={event.eventId}>
                    <strong>{event.action.replaceAll("_", " ")}</strong>
                    <span className="muted">
                      {event.outcome} · {new Date(event.createdAt).toLocaleString()}
                    </span>
                    {event.transactionHash && (
                      <a
                        className="mono muted external-link"
                        href={explorerLink("tx", event.transactionHash) || undefined}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {event.transactionHash}
                      </a>
                    )}
                    {event.message && <p className="muted">{event.message}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className="muted">
            <FileCheck2 size={16} aria-hidden /> Raw identity documents stay outside the chain and outside
            this UI.
          </p>
        </aside>
      </section>
    </main>
  );
}

function FeeQuoteCard({ quote, title }: { quote: FeeQuoteResponse; title: string }) {
  return (
    <div className="fee-quote">
      <strong>{title}</strong>
      <span>{formatCurrency(quote.totalAmount, quote.currency)}</span>
      <small className="muted">
        fees {formatCurrency(quote.totalFees, quote.currency)} · network{" "}
        {formatCurrency(quote.networkFeeEstimate, quote.currency)}
      </small>
    </div>
  );
}

function parseAmount(value: string | undefined) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function formatCurrency(value: number, currency = "EUR", locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: 2,
    style: "currency"
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(value);
}
