"use client";

import {
  Activity,
  CheckCircle2,
  Factory,
  FileText,
  FileSearch,
  KeyRound,
  Pause,
  Play,
  RadioTower,
  RefreshCw,
  Settings2,
  ShieldOff,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { fetchAssetOfferings } from "@/features/assets/api/client";
import {
  approveAdminRedemption,
  approveAdminSubscription,
  approveAdminKycRequest,
  createAdminAssetOffering,
  fetchAdminAssetComplianceRules,
  fetchAdminAssetPauseStatus,
  fetchAdminInvestorComplianceProfile,
  fetchAdminOperationsReport,
  fetchOracleFeed,
  fetchRegulatoryFeed,
  listAdminBlockchainTransactions,
  listAdminAuditEvents,
  listAdminKycRequests,
  listAdminRedemptions,
  listAdminSubscriptions,
  pauseAdminAssetToken,
  rejectAdminRedemption,
  rejectAdminSubscription,
  rejectAdminKycRequest,
  revokeAdminIdentity,
  unpauseAdminAssetToken,
  updateAdminAssetComplianceRules,
  updateAdminInvestorComplianceProfile
} from "@/features/admin/api/client";
import type {
  AssetComplianceRulesResponse,
  AssetComplianceRulesUpdateRequest,
  AssetOfferingCreateRequest,
  AssetOfferingResponse,
  AuditEventResponse,
  BlockchainTransactionResponse,
  InvestorComplianceProfileResponse,
  InvestorComplianceProfileUpdateRequest,
  InvestorType,
  KycRequestResponse,
  KycStatus,
  OperationsReportResponse,
  OracleFeedResponse,
  PauseStatusResponse,
  RedemptionResponse,
  RegulatoryFeedResponse,
  SubscriptionResponse
} from "@/shared/api/types";
import {
  isWalletAddress,
  shortenAddress,
  statusClass,
  statusLabel
} from "@/shared/lib/formatters";
import { explorerLink } from "@/shared/lib/web3";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";

const ADMIN_TOKEN_STORAGE_KEY = "rwa-admin-token";
const statusOptions: Array<KycStatus | ""> = ["", "PENDING", "APPROVED", "REJECTED", "REVOKED", "FAILED_ON_CHAIN"];
const investorTypeOptions: InvestorType[] = ["RETAIL", "ACCREDITED", "QUALIFIED", "INSTITUTIONAL"];
const configuredTokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? "";
const defaultProfileForm: InvestorComplianceProfileUpdateRequest = {
  investorType: "RETAIL",
  jurisdiction: "PT",
  accredited: false,
  qualifiedInvestor: false,
  revoked: false
};
const defaultRulesForm: AssetComplianceRulesUpdateRequest = {
  allowedInvestorTypes: investorTypeOptions,
  allowedJurisdictions: ["PT"],
  requiresAccreditation: false,
  requiresQualifiedInvestor: false,
  lockupDays: 0,
  maxPositionAmount: null
};

export function AdminDashboard() {
  const router = useRouter();
  const [adminToken, setAdminToken] = useState("");
  const [statusFilter, setStatusFilter] = useState<KycStatus | "">("PENDING");
  const [walletFilter, setWalletFilter] = useState("");
  const [limit, setLimit] = useState(25);
  const [rejectionReason, setRejectionReason] = useState("Rejected by compliance operator.");
  const [requests, setRequests] = useState<KycRequestResponse[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionResponse[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionResponse[]>([]);
  const [assetOfferings, setAssetOfferings] = useState<AssetOfferingResponse[]>([]);
  const [pauseStatuses, setPauseStatuses] = useState<Record<string, PauseStatusResponse>>({});
  const [auditEvents, setAuditEvents] = useState<AuditEventResponse[]>([]);
  const [blockchainTransactions, setBlockchainTransactions] = useState<BlockchainTransactionResponse[]>([]);
  const [operationsReport, setOperationsReport] = useState<OperationsReportResponse | null>(null);
  const [oracleFeed, setOracleFeed] = useState<OracleFeedResponse | null>(null);
  const [regulatoryFeed, setRegulatoryFeed] = useState<RegulatoryFeedResponse | null>(null);
  const [profileWallet, setProfileWallet] = useState("");
  const [profileForm, setProfileForm] = useState<InvestorComplianceProfileUpdateRequest>(defaultProfileForm);
  const [profile, setProfile] = useState<InvestorComplianceProfileResponse | null>(null);
  const [rulesAssetId, setRulesAssetId] = useState("");
  const [rulesForm, setRulesForm] = useState<AssetComplianceRulesUpdateRequest>(defaultRulesForm);
  const [rules, setRules] = useState<AssetComplianceRulesResponse | null>(null);
  const [assetForm, setAssetForm] = useState<AssetOfferingCreateRequest>({
    name: "Tokenized Treasury Fund",
    symbol: "TTF",
    assetType: "TREASURY_FUND",
    jurisdiction: "US",
    status: "DRAFT",
    supplyCap: 500000,
    navPrice: 100,
    issuerName: "Demo RWA Issuer",
    issuerMetadata: "Simulated treasury fund share class for portfolio demos.",
    tokenAddress: configuredTokenAddress
  });
  const [selectedRequest, setSelectedRequest] = useState<KycRequestResponse | null>(null);
  const [subscriptionReason, setSubscriptionReason] = useState("Issuer allocation approved.");
  const [redemptionReason, setRedemptionReason] = useState("Redemption approved with simulated off-chain settlement.");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const hasToken = adminToken.trim().length > 0;
  const selectedWallet = selectedRequest?.walletAddress ?? walletFilter;
  const auditFilters = useMemo(
    () => ({
      walletAddress: selectedWallet && isWalletAddress(selectedWallet) ? selectedWallet : undefined,
      requestId: selectedRequest?.requestId,
      limit
    }),
    [limit, selectedRequest, selectedWallet]
  );

  useEffect(() => {
    const storedToken = window.sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
    if (storedToken) {
      setAdminToken(storedToken);
      void refreshAdminData(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!rulesAssetId && assetOfferings.length > 0) {
      setRulesAssetId(assetOfferings[0].assetId);
    }
  }, [assetOfferings, rulesAssetId]);

  function saveToken() {
    setError("");
    setNotice("");
    if (!hasToken) {
      setError("Enter an admin token before loading the admin dashboard.");
      return;
    }
    window.sessionStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, adminToken);
    setNotice("Admin token saved in this browser session.");
    void refreshAdminData(adminToken);
  }

  function clearToken() {
    window.sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    setAdminToken("");
    setRequests([]);
    setAuditEvents([]);
    setBlockchainTransactions([]);
    setOperationsReport(null);
    setOracleFeed(null);
    setRegulatoryFeed(null);
    setPauseStatuses({});
    setSelectedRequest(null);
    setNotice("Admin token cleared from this browser session.");
  }

  async function refreshAdminData(token = adminToken) {
    if (!token.trim()) {
      setError("Enter an admin token before loading admin data.");
      return;
    }
    if (walletFilter && !isWalletAddress(walletFilter)) {
      setError("Wallet filter must be a valid EVM address.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const filters = {
        status: statusFilter,
        walletAddress: walletFilter || undefined,
        limit
      };
      const lifecycleFilters = {
        status: "PENDING" as const,
        walletAddress: walletFilter || undefined,
        limit
      };
      const [
        queue,
        events,
        subscriptionQueue,
        redemptionQueue,
        offerings,
        chainTransactions,
        report,
        oracle,
        regulatory
      ] = await Promise.all([
        listAdminKycRequests(token, filters),
        listAdminAuditEvents(token, auditFilters),
        listAdminSubscriptions(token, lifecycleFilters),
        listAdminRedemptions(token, lifecycleFilters),
        fetchAssetOfferings({ limit: 20 }),
        listAdminBlockchainTransactions(token, { walletAddress: walletFilter || undefined, limit }),
        fetchAdminOperationsReport(token),
        fetchOracleFeed(),
        fetchRegulatoryFeed()
      ]);
      setRequests(queue);
      setAuditEvents(events);
      setSubscriptions(subscriptionQueue);
      setRedemptions(redemptionQueue);
      setAssetOfferings(offerings);
      setBlockchainTransactions(chainTransactions);
      setOperationsReport(report);
      setOracleFeed(oracle);
      setRegulatoryFeed(regulatory);
      await refreshPauseStatuses(token, offerings);
      setNotice("Admin data refreshed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Admin data refresh failed.");
    } finally {
      setLoading(false);
    }
  }

  async function approve(request: KycRequestResponse) {
    await runAdminAction(
      () => approveAdminKycRequest(adminToken, request.requestId),
      `Approval submitted for ${shortenAddress(request.walletAddress)}.`
    );
  }

  async function reject(request: KycRequestResponse) {
    await runAdminAction(
      () => rejectAdminKycRequest(adminToken, request.requestId, rejectionReason),
      `Request rejected for ${shortenAddress(request.walletAddress)}.`
    );
  }

  async function revoke(request: KycRequestResponse) {
    await runAdminAction(
      () => revokeAdminIdentity(adminToken, request.walletAddress),
      `Revocation submitted for ${shortenAddress(request.walletAddress)}.`
    );
  }

  async function approveSubscription(request: SubscriptionResponse) {
    await runAdminAction(
      () => approveAdminSubscription(adminToken, request.subscriptionId, subscriptionReason),
      `Subscription approved for ${shortenAddress(request.walletAddress)}.`
    );
  }

  async function rejectSubscription(request: SubscriptionResponse) {
    await runAdminAction(
      () => rejectAdminSubscription(adminToken, request.subscriptionId, subscriptionReason),
      `Subscription rejected for ${shortenAddress(request.walletAddress)}.`
    );
  }

  async function approveRedemption(request: RedemptionResponse) {
    await runAdminAction(
      () => approveAdminRedemption(adminToken, request.redemptionId, redemptionReason),
      `Redemption approved for ${shortenAddress(request.walletAddress)}.`
    );
  }

  async function rejectRedemption(request: RedemptionResponse) {
    await runAdminAction(
      () => rejectAdminRedemption(adminToken, request.redemptionId, redemptionReason),
      `Redemption rejected for ${shortenAddress(request.walletAddress)}.`
    );
  }

  async function createAsset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasToken) {
      setError("Enter an admin token before creating asset offerings.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");
    try {
      const created = await createAdminAssetOffering(adminToken, assetForm);
      const offerings = await fetchAssetOfferings({ limit: 20 });
      setAssetOfferings(offerings);
      await refreshPauseStatuses(adminToken, offerings);
      setNotice(`Asset offering created: ${created.symbol}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Asset creation failed.");
    } finally {
      setLoading(false);
    }
  }

  async function loadProfile() {
    if (!hasToken) {
      setError("Enter an admin token before loading compliance profiles.");
      return;
    }
    if (!isWalletAddress(profileWallet)) {
      setError("Profile wallet must be a valid EVM address.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");
    try {
      const loaded = await fetchAdminInvestorComplianceProfile(adminToken, profileWallet);
      setProfile(loaded);
      setProfileForm({
        investorType: loaded.investorType,
        jurisdiction: loaded.jurisdiction,
        accredited: loaded.accredited,
        qualifiedInvestor: loaded.qualifiedInvestor,
        revoked: loaded.revoked
      });
      setNotice(`Compliance profile loaded for ${shortenAddress(loaded.walletAddress)}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compliance profile load failed.");
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasToken) {
      setError("Enter an admin token before saving compliance profiles.");
      return;
    }
    if (!isWalletAddress(profileWallet)) {
      setError("Profile wallet must be a valid EVM address.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");
    try {
      const saved = await updateAdminInvestorComplianceProfile(adminToken, profileWallet, profileForm);
      setProfile(saved);
      setNotice(`Compliance profile saved for ${shortenAddress(saved.walletAddress)}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compliance profile save failed.");
    } finally {
      setLoading(false);
    }
  }

  async function loadRules() {
    if (!hasToken) {
      setError("Enter an admin token before loading compliance rules.");
      return;
    }
    if (!rulesAssetId) {
      setError("Select an asset before loading compliance rules.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");
    try {
      const loaded = await fetchAdminAssetComplianceRules(adminToken, rulesAssetId);
      setRules(loaded);
      setRulesForm({
        allowedInvestorTypes: loaded.allowedInvestorTypes,
        allowedJurisdictions: loaded.allowedJurisdictions,
        requiresAccreditation: loaded.requiresAccreditation,
        requiresQualifiedInvestor: loaded.requiresQualifiedInvestor,
        lockupDays: loaded.lockupDays,
        maxPositionAmount: loaded.maxPositionAmount
      });
      setNotice(`Compliance rules loaded for ${assetLabel(loaded.assetId, assetOfferings)}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compliance rule load failed.");
    } finally {
      setLoading(false);
    }
  }

  async function saveRules(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasToken) {
      setError("Enter an admin token before saving compliance rules.");
      return;
    }
    if (!rulesAssetId) {
      setError("Select an asset before saving compliance rules.");
      return;
    }
    if (rulesForm.allowedInvestorTypes.length === 0 || rulesForm.allowedJurisdictions.length === 0) {
      setError("Allowed investor types and jurisdictions are required.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");
    try {
      const saved = await updateAdminAssetComplianceRules(adminToken, rulesAssetId, rulesForm);
      setRules(saved);
      setNotice(`Compliance rules saved for ${assetLabel(saved.assetId, assetOfferings)}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compliance rule save failed.");
    } finally {
      setLoading(false);
    }
  }

  async function refreshPauseStatuses(token = adminToken, offerings = assetOfferings) {
    if (!token.trim() || offerings.length === 0) {
      setPauseStatuses({});
      return;
    }
    const entries = await Promise.all(
      offerings.map(async (asset) => {
        try {
          const status = await fetchAdminAssetPauseStatus(token, asset.assetId);
          return [asset.assetId, status] as const;
        } catch {
          return null;
        }
      })
    );
    const presentEntries = entries.filter(
      (entry): entry is readonly [string, PauseStatusResponse] => entry !== null
    );
    setPauseStatuses(Object.fromEntries(presentEntries));
  }

  async function pauseAsset(asset: AssetOfferingResponse) {
    await runAdminAction(
      () => pauseAdminAssetToken(adminToken, asset.assetId),
      `Emergency pause submitted for ${asset.symbol}.`
    );
  }

  async function unpauseAsset(asset: AssetOfferingResponse) {
    await runAdminAction(
      () => unpauseAdminAssetToken(adminToken, asset.assetId),
      `Emergency pause lifted for ${asset.symbol}.`
    );
  }

  function toggleAllowedInvestorType(investorType: InvestorType) {
    const nextTypes = rulesForm.allowedInvestorTypes.includes(investorType)
      ? rulesForm.allowedInvestorTypes.filter((candidate) => candidate !== investorType)
      : [...rulesForm.allowedInvestorTypes, investorType];
    setRulesForm({ ...rulesForm, allowedInvestorTypes: nextTypes });
  }

  async function runAdminAction(action: () => Promise<unknown>, successMessage: string) {
    if (!hasToken) {
      setError("Enter an admin token before running admin actions.");
      return;
    }
    setLoading(true);
    setError("");
    setNotice("");
    try {
      await action();
      await refreshAdminData(adminToken);
      setNotice(successMessage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Admin action failed.");
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    setSigningOut(true);
    setError("");
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login?role=admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign out.");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div className="brand">
          <h1>Admin / Issuer Dashboard</h1>
          <p>KYC queue · identity approvals · revocations · audit history</p>
        </div>
        <nav className="nav-actions" aria-label="Dashboard navigation">
          <Link className="nav-link" href="/">
            Landing
          </Link>
          <Link className="nav-link" href="/dashboard">
            Investor dashboard
          </Link>
          <Button
            leadingIcon={<XCircle size={16} />}
            loading={signingOut}
            onClick={signOut}
            size="sm"
            variant="ghost"
          >
            Sign out
          </Button>
        </nav>
      </header>

      <section className="content admin-content">
        <div className="panel-grid">
          <section className="panel" aria-labelledby="admin-access-title">
            <h2 id="admin-access-title">Admin access</h2>
            <div className="admin-toolbar">
              <div className="field compact-field">
                <label htmlFor="admin-token">Admin token</label>
                <input
                  id="admin-token"
                  onChange={(event) => setAdminToken(event.target.value)}
                  placeholder="local-admin-token"
                  type="password"
                  value={adminToken}
                />
              </div>
              <button className="primary-button" disabled={loading} onClick={saveToken} type="button">
                <KeyRound size={18} aria-hidden />
                Save token
              </button>
              <button className="secondary-button" disabled={loading} onClick={clearToken} type="button">
                Clear
              </button>
            </div>
            {error && <Alert tone="error">{error}</Alert>}
            {notice && <Alert tone="info">{notice}</Alert>}
          </section>

          <section className="panel" aria-labelledby="kyc-queue-title">
            <div className="section-header">
              <h2 id="kyc-queue-title">KYC queue</h2>
              <button className="secondary-button" disabled={loading || !hasToken} onClick={() => refreshAdminData()} type="button">
                <RefreshCw size={18} aria-hidden />
                Refresh
              </button>
            </div>
            <div className="admin-toolbar">
              <div className="field compact-field">
                <label htmlFor="status-filter">Status</label>
                <select
                  id="status-filter"
                  onChange={(event) => setStatusFilter(event.target.value as KycStatus | "")}
                  value={statusFilter}
                >
                  {statusOptions.map((status) => (
                    <option key={status || "all"} value={status}>
                      {status ? statusLabel(status) : "ALL"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field compact-field grow-field">
                <label htmlFor="wallet-filter">Wallet filter</label>
                <input
                  id="wallet-filter"
                  className="mono"
                  onChange={(event) => setWalletFilter(event.target.value)}
                  placeholder="0x..."
                  value={walletFilter}
                />
              </div>
              <div className="field compact-field small-field">
                <label htmlFor="limit-filter">Limit</label>
                <input
                  id="limit-filter"
                  min={1}
                  max={100}
                  onChange={(event) => setLimit(Number(event.target.value))}
                  type="number"
                  value={limit}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="reject-reason">Reject reason</label>
              <input
                id="reject-reason"
                onChange={(event) => setRejectionReason(event.target.value)}
                value={rejectionReason}
              />
            </div>

            {requests.length === 0 ? (
              <div className="empty-state">
                <FileSearch size={20} aria-hidden />
                No KYC requests match the current filters.
              </div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Wallet</th>
                      <th>Status</th>
                      <th>Updated</th>
                      <th>Tx</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request.requestId}>
                        <td>
                          <button
                            className="link-button mono"
                            onClick={() => {
                              setSelectedRequest(request);
                              setProfileWallet(request.walletAddress);
                            }}
                            type="button"
                          >
                            {shortenAddress(request.walletAddress)}
                          </button>
                        </td>
                        <td>
                          <span className={`status ${statusClass(request.status)}`}>
                            {statusLabel(request.status)}
                          </span>
                        </td>
                        <td>{new Date(request.updatedAt).toLocaleString()}</td>
                        <td>{renderTx(request.transactionHash)}</td>
                        <td>
                          <div className="row-actions">
                            <button className="primary-button" disabled={loading} onClick={() => approve(request)} type="button">
                              <CheckCircle2 size={16} aria-hidden />
                              Approve
                            </button>
                            <button className="secondary-button" disabled={loading} onClick={() => reject(request)} type="button">
                              <XCircle size={16} aria-hidden />
                              Reject
                            </button>
                            <button className="danger-button" disabled={loading} onClick={() => revoke(request)} type="button">
                              <ShieldOff size={16} aria-hidden />
                              Revoke
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="panel" aria-labelledby="subscription-queue-title">
            <div className="section-header">
              <h2 id="subscription-queue-title">Subscription queue</h2>
              <span className="muted">{subscriptions.length} pending</span>
            </div>
            <div className="field">
              <label htmlFor="subscription-reason">Subscription decision reason</label>
              <input
                id="subscription-reason"
                onChange={(event) => setSubscriptionReason(event.target.value)}
                value={subscriptionReason}
              />
            </div>
            {subscriptions.length === 0 ? (
              <div className="empty-state">
                <FileSearch size={20} aria-hidden />
                No pending subscription requests.
              </div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Wallet</th>
                      <th>Asset</th>
                      <th>Amount</th>
                      <th>Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((request) => (
                      <tr key={request.subscriptionId}>
                        <td className="mono">{shortenAddress(request.walletAddress)}</td>
                        <td>{assetLabel(request.assetId, assetOfferings)}</td>
                        <td>{formatNumber(request.amount)}</td>
                        <td>{new Date(request.updatedAt).toLocaleString()}</td>
                        <td>
                          <div className="row-actions">
                            <button className="primary-button" disabled={loading} onClick={() => approveSubscription(request)} type="button">
                              <CheckCircle2 size={16} aria-hidden />
                              Approve
                            </button>
                            <button className="secondary-button" disabled={loading} onClick={() => rejectSubscription(request)} type="button">
                              <XCircle size={16} aria-hidden />
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="panel" aria-labelledby="redemption-queue-title">
            <div className="section-header">
              <h2 id="redemption-queue-title">Redemption queue</h2>
              <span className="muted">{redemptions.length} pending</span>
            </div>
            <div className="field">
              <label htmlFor="redemption-reason">Redemption decision reason</label>
              <input
                id="redemption-reason"
                onChange={(event) => setRedemptionReason(event.target.value)}
                value={redemptionReason}
              />
            </div>
            {redemptions.length === 0 ? (
              <div className="empty-state">
                <FileSearch size={20} aria-hidden />
                No pending redemption requests.
              </div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Wallet</th>
                      <th>Asset</th>
                      <th>Amount</th>
                      <th>Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {redemptions.map((request) => (
                      <tr key={request.redemptionId}>
                        <td className="mono">{shortenAddress(request.walletAddress)}</td>
                        <td>{assetLabel(request.assetId, assetOfferings)}</td>
                        <td>{formatNumber(request.amount)}</td>
                        <td>{new Date(request.updatedAt).toLocaleString()}</td>
                        <td>
                          <div className="row-actions">
                            <button className="primary-button" disabled={loading} onClick={() => approveRedemption(request)} type="button">
                              <CheckCircle2 size={16} aria-hidden />
                              Approve
                            </button>
                            <button className="secondary-button" disabled={loading} onClick={() => rejectRedemption(request)} type="button">
                              <XCircle size={16} aria-hidden />
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="panel" aria-labelledby="operations-title">
            <div className="section-header">
              <h2 id="operations-title">Operations report</h2>
              <FileText size={20} aria-hidden />
            </div>
            <div className="metric-grid">
              <div className="metric">
                <span>Active assets</span>
                <strong>{operationsReport?.activeAssets ?? 0}</strong>
              </div>
              <div className="metric">
                <span>Pending subs</span>
                <strong>{operationsReport?.pendingSubscriptions ?? subscriptions.length}</strong>
              </div>
              <div className="metric">
                <span>Pending reds</span>
                <strong>{operationsReport?.pendingRedemptions ?? redemptions.length}</strong>
              </div>
              <div className="metric">
                <span>Monitored tx</span>
                <strong>{operationsReport?.monitoredTransactions ?? blockchainTransactions.length}</strong>
              </div>
            </div>
            <div className="secondary-panel">
              <strong>{operationsReport?.autoPauseMode ?? "SIMULATED_ADMIN_REVIEW"}</strong>
              <p className="muted">
                {operationsReport?.summary ??
                  "Auto-pause simulation remains visible to admins while crisis controls stay manual."}
              </p>
              <span className="muted">Failed tx {operationsReport?.failedTransactions ?? 0}</span>
            </div>
          </section>

          <section className="panel" aria-labelledby="feeds-title">
            <div className="section-header">
              <h2 id="feeds-title">Oracle and regulatory feeds</h2>
              <RadioTower size={20} aria-hidden />
            </div>
            <div className="feed-grid">
              <article className="feed-card">
                <strong>{oracleFeed?.provider ?? "Oracle feed"}</strong>
                <span className={`status ${oracleFeed?.status === "ONLINE" ? "approved" : "pending"}`}>
                  {oracleFeed?.status ?? "PENDING"}
                </span>
                <span className="muted">
                  {oracleFeed?.message ?? "Refresh admin data to load oracle availability."}
                </span>
              </article>
              <article className="feed-card">
                <strong>{regulatoryFeed?.provider ?? "Regulatory feed"}</strong>
                <span className={`status ${regulatoryFeed?.status === "GREEN" ? "approved" : "pending"}`}>
                  {regulatoryFeed?.status ?? "PENDING"}
                </span>
                <span className="muted">
                  {regulatoryFeed?.summary ?? "Refresh admin data to load regulatory guidance."}
                </span>
              </article>
            </div>
          </section>

          <section className="panel" aria-labelledby="chain-monitor-title">
            <div className="section-header">
              <h2 id="chain-monitor-title">Blockchain transaction monitor</h2>
              <Activity size={20} aria-hidden />
            </div>
            {blockchainTransactions.length === 0 ? (
              <div className="empty-state">
                <FileSearch size={20} aria-hidden />
                No blockchain transactions match the current filters.
              </div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Wallet</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th>Tx</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blockchainTransactions.map((transaction) => (
                      <tr key={transaction.transactionId}>
                        <td>{transaction.transactionType.replaceAll("_", " ")}</td>
                        <td className="mono">{shortenAddress(transaction.walletAddress)}</td>
                        <td>
                          <span
                            className={`status ${
                              transaction.status === "FAILED"
                                ? "rejected"
                                : transaction.status === "SUBMITTED"
                                  ? "pending"
                                  : "approved"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                        <td>{new Date(transaction.submittedAt).toLocaleString()}</td>
                        <td>{renderTx(transaction.transactionHash)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="panel" aria-labelledby="asset-admin-title">
            <h2 id="asset-admin-title">Asset offerings</h2>
            <form onSubmit={createAsset}>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="asset-name">Name</label>
                  <input
                    id="asset-name"
                    onChange={(event) => setAssetForm({ ...assetForm, name: event.target.value })}
                    value={assetForm.name}
                  />
                </div>
                <div className="field">
                  <label htmlFor="asset-symbol">Symbol</label>
                  <input
                    id="asset-symbol"
                    onChange={(event) => setAssetForm({ ...assetForm, symbol: event.target.value })}
                    value={assetForm.symbol}
                  />
                </div>
                <div className="field">
                  <label htmlFor="asset-type">Asset type</label>
                  <input
                    id="asset-type"
                    onChange={(event) => setAssetForm({ ...assetForm, assetType: event.target.value })}
                    value={assetForm.assetType}
                  />
                </div>
                <div className="field">
                  <label htmlFor="asset-jurisdiction">Jurisdiction</label>
                  <input
                    id="asset-jurisdiction"
                    onChange={(event) => setAssetForm({ ...assetForm, jurisdiction: event.target.value })}
                    value={assetForm.jurisdiction}
                  />
                </div>
                <div className="field">
                  <label htmlFor="asset-supply">Supply cap</label>
                  <input
                    id="asset-supply"
                    min={0}
                    onChange={(event) => setAssetForm({ ...assetForm, supplyCap: Number(event.target.value) })}
                    type="number"
                    value={assetForm.supplyCap}
                  />
                </div>
                <div className="field">
                  <label htmlFor="asset-nav">NAV / price</label>
                  <input
                    id="asset-nav"
                    min={0}
                    onChange={(event) => setAssetForm({ ...assetForm, navPrice: Number(event.target.value) })}
                    type="number"
                    value={assetForm.navPrice}
                  />
                </div>
                <div className="field">
                  <label htmlFor="asset-issuer">Issuer</label>
                  <input
                    id="asset-issuer"
                    onChange={(event) => setAssetForm({ ...assetForm, issuerName: event.target.value })}
                    value={assetForm.issuerName}
                  />
                </div>
                <div className="field">
                  <label htmlFor="asset-token">Token address</label>
                  <input
                    id="asset-token"
                    className="mono"
                    onChange={(event) => setAssetForm({ ...assetForm, tokenAddress: event.target.value })}
                    placeholder="0x..."
                    value={assetForm.tokenAddress ?? ""}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="asset-metadata">Issuer metadata</label>
                <input
                  id="asset-metadata"
                  onChange={(event) => setAssetForm({ ...assetForm, issuerMetadata: event.target.value })}
                  value={assetForm.issuerMetadata ?? ""}
                />
              </div>
              <div className="actions">
                <button className="primary-button" disabled={loading || !hasToken} type="submit">
                  <Factory size={18} aria-hidden />
                  Create asset
                </button>
              </div>
            </form>

            {assetOfferings.length === 0 ? (
              <div className="empty-state">
                <Factory size={20} aria-hidden />
                No asset offerings have been configured yet.
              </div>
            ) : (
              <div className="offering-grid compact-offering-grid">
                {assetOfferings.map((asset) => (
                  <article className="offering-card" key={asset.assetId}>
                    <div>
                      <h3>{asset.name}</h3>
                      <span className={`status ${asset.status === "ACTIVE" ? "approved" : "pending"}`}>
                        {asset.status}
                      </span>
                    </div>
                    <span className="muted">
                      {asset.symbol} · {asset.assetType.replaceAll("_", " ")} · {asset.jurisdiction}
                    </span>
                    <span className="muted">
                      NAV {formatCurrency(asset.navPrice)} · cap {formatNumber(asset.supplyCap)}
                    </span>
                    {asset.tokenAddress && renderAddress(asset.tokenAddress)}
                    <span className={`status ${pauseStatuses[asset.assetId]?.paused ? "revoked" : "approved"}`}>
                      {pauseStatuses[asset.assetId]?.paused ? "TOKEN PAUSED" : "TOKEN ACTIVE"}
                    </span>
                    <div className="row-actions">
                      <button
                        className="danger-button"
                        disabled={loading || !hasToken || pauseStatuses[asset.assetId]?.paused === true}
                        onClick={() => pauseAsset(asset)}
                        type="button"
                      >
                        <Pause size={16} aria-hidden />
                        Pause token
                      </button>
                      <button
                        className="secondary-button"
                        disabled={loading || !hasToken || pauseStatuses[asset.assetId]?.paused !== true}
                        onClick={() => unpauseAsset(asset)}
                        type="button"
                      >
                        <Play size={16} aria-hidden />
                        Unpause
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="panel" aria-labelledby="compliance-rules-title">
            <div className="section-header">
              <h2 id="compliance-rules-title">Compliance rules</h2>
              <Settings2 size={20} aria-hidden />
            </div>

            <form onSubmit={saveProfile}>
              <div className="section-header compact-section-header">
                <h3>Investor profile</h3>
                {profile && <span className="muted">Updated {new Date(profile.updatedAt).toLocaleString()}</span>}
              </div>
              <div className="admin-toolbar">
                <div className="field compact-field grow-field">
                  <label htmlFor="profile-wallet">Profile wallet</label>
                  <input
                    id="profile-wallet"
                    className="mono"
                    onChange={(event) => setProfileWallet(event.target.value)}
                    placeholder="0x..."
                    value={profileWallet}
                  />
                </div>
                <div className="field compact-field">
                  <label htmlFor="profile-investor-type">Investor type</label>
                  <select
                    id="profile-investor-type"
                    onChange={(event) =>
                      setProfileForm({ ...profileForm, investorType: event.target.value as InvestorType })
                    }
                    value={profileForm.investorType}
                  >
                    {investorTypeOptions.map((investorType) => (
                      <option key={investorType} value={investorType}>
                        {investorType.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field compact-field small-field">
                  <label htmlFor="profile-jurisdiction">Jurisdiction</label>
                  <input
                    id="profile-jurisdiction"
                    onChange={(event) => setProfileForm({ ...profileForm, jurisdiction: event.target.value })}
                    value={profileForm.jurisdiction}
                  />
                </div>
              </div>
              <div className="check-row">
                <label className="check-field" htmlFor="profile-accredited">
                  <input
                    checked={profileForm.accredited}
                    id="profile-accredited"
                    onChange={(event) => setProfileForm({ ...profileForm, accredited: event.target.checked })}
                    type="checkbox"
                  />
                  Accredited
                </label>
                <label className="check-field" htmlFor="profile-qualified">
                  <input
                    checked={profileForm.qualifiedInvestor}
                    id="profile-qualified"
                    onChange={(event) => setProfileForm({ ...profileForm, qualifiedInvestor: event.target.checked })}
                    type="checkbox"
                  />
                  Qualified
                </label>
                <label className="check-field" htmlFor="profile-revoked">
                  <input
                    checked={profileForm.revoked}
                    id="profile-revoked"
                    onChange={(event) => setProfileForm({ ...profileForm, revoked: event.target.checked })}
                    type="checkbox"
                  />
                  Revoked
                </label>
              </div>
              <div className="actions">
                <button className="secondary-button" disabled={loading || !hasToken} onClick={loadProfile} type="button">
                  <RefreshCw size={18} aria-hidden />
                  Load profile
                </button>
                <button className="primary-button" disabled={loading || !hasToken} type="submit">
                  <CheckCircle2 size={18} aria-hidden />
                  Save profile
                </button>
              </div>
            </form>

            <form className="rules-form" onSubmit={saveRules}>
              <div className="section-header compact-section-header">
                <h3>Asset rules</h3>
                {rules && <span className="muted">Updated {new Date(rules.updatedAt).toLocaleString()}</span>}
              </div>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="rules-asset">Asset</label>
                  <select
                    id="rules-asset"
                    onChange={(event) => setRulesAssetId(event.target.value)}
                    value={rulesAssetId}
                  >
                    {assetOfferings.map((asset) => (
                      <option key={asset.assetId} value={asset.assetId}>
                        {asset.symbol} · {asset.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="rules-jurisdictions">Allowed jurisdictions</label>
                  <input
                    id="rules-jurisdictions"
                    onChange={(event) =>
                      setRulesForm({ ...rulesForm, allowedJurisdictions: parseCsv(event.target.value) })
                    }
                    value={rulesForm.allowedJurisdictions.join(", ")}
                  />
                </div>
                <div className="field">
                  <label htmlFor="rules-lockup">Lockup days</label>
                  <input
                    id="rules-lockup"
                    min={0}
                    onChange={(event) =>
                      setRulesForm({ ...rulesForm, lockupDays: Number(event.target.value) })
                    }
                    type="number"
                    value={rulesForm.lockupDays}
                  />
                </div>
                <div className="field">
                  <label htmlFor="rules-max-position">Max position amount</label>
                  <input
                    id="rules-max-position"
                    min={0}
                    onChange={(event) =>
                      setRulesForm({
                        ...rulesForm,
                        maxPositionAmount: event.target.value ? Number(event.target.value) : null
                      })
                    }
                    type="number"
                    value={rulesForm.maxPositionAmount ?? ""}
                  />
                </div>
              </div>
              <div className="check-row">
                {investorTypeOptions.map((investorType) => (
                  <label className="check-field" htmlFor={`rules-type-${investorType}`} key={investorType}>
                    <input
                      checked={rulesForm.allowedInvestorTypes.includes(investorType)}
                      id={`rules-type-${investorType}`}
                      onChange={() => toggleAllowedInvestorType(investorType)}
                      type="checkbox"
                    />
                    {investorType.replaceAll("_", " ")}
                  </label>
                ))}
              </div>
              <div className="check-row">
                <label className="check-field" htmlFor="rules-accredited">
                  <input
                    checked={rulesForm.requiresAccreditation}
                    id="rules-accredited"
                    onChange={(event) =>
                      setRulesForm({ ...rulesForm, requiresAccreditation: event.target.checked })
                    }
                    type="checkbox"
                  />
                  Requires accreditation
                </label>
                <label className="check-field" htmlFor="rules-qualified">
                  <input
                    checked={rulesForm.requiresQualifiedInvestor}
                    id="rules-qualified"
                    onChange={(event) =>
                      setRulesForm({ ...rulesForm, requiresQualifiedInvestor: event.target.checked })
                    }
                    type="checkbox"
                  />
                  Requires qualified status
                </label>
              </div>
              <div className="actions">
                <button className="secondary-button" disabled={loading || !hasToken || !rulesAssetId} onClick={loadRules} type="button">
                  <RefreshCw size={18} aria-hidden />
                  Load rules
                </button>
                <button className="primary-button" disabled={loading || !hasToken || !rulesAssetId} type="submit">
                  <CheckCircle2 size={18} aria-hidden />
                  Save rules
                </button>
              </div>
            </form>
          </section>
        </div>

        <aside className="panel" aria-labelledby="audit-title">
          <h2 id="audit-title">Audit history</h2>
          {selectedRequest && (
            <div className="selected-record">
              <strong>{shortenAddress(selectedRequest.walletAddress)}</strong>
              <span className="mono muted">{selectedRequest.requestId}</span>
            </div>
          )}
          <ul className="activity-list audit-list">
            {auditEvents.length === 0 ? (
              <li>
                <strong>No audit events</strong>
                <span className="muted">Save a token and refresh to load operator evidence.</span>
              </li>
            ) : (
              auditEvents.map((event) => (
                <li key={event.eventId}>
                  <strong>{event.action}</strong>
                  <span className="muted">
                    {event.category} · {event.outcome} · {new Date(event.createdAt).toLocaleString()}
                  </span>
                  {event.walletAddress && <span className="mono muted">{event.walletAddress}</span>}
                  {event.transactionHash && renderTx(event.transactionHash)}
                  {event.message && <span className="muted">{event.message}</span>}
                </li>
              ))
            )}
          </ul>
        </aside>
      </section>
    </main>
  );
}

function renderTx(transactionHash: string | null) {
  if (!transactionHash) {
    return <span className="muted">No tx</span>;
  }
  const href = explorerLink("tx", transactionHash);
  if (!href) {
    return <span className="mono muted">{transactionHash}</span>;
  }
  return (
    <a className="mono muted external-link" href={href} rel="noreferrer" target="_blank">
      {transactionHash}
    </a>
  );
}

function renderAddress(address: string) {
  const href = explorerLink("address", address);
  if (!href) {
    return <span className="mono muted">{address}</span>;
  }
  return (
    <a className="mono muted external-link" href={href} rel="noreferrer" target="_blank">
      {address}
    </a>
  );
}

function assetLabel(assetId: string, assets: AssetOfferingResponse[]) {
  const asset = assets.find((candidate) => candidate.assetId === assetId);
  return asset ? `${asset.symbol} · ${asset.name}` : assetId;
}

function parseCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    style: "currency"
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(value);
}
