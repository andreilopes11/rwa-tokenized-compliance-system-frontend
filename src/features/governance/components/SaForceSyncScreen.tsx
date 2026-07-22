"use client";

import { useState } from "react";
import { initiateForceSync } from "@/features/governance/api/client";
import { isWalletAddress } from "@/shared/lib/formatters";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { WorkspacePanel } from "@/shared/ui/WorkspacePanel";
import Link from "next/link";

/** SA-S05 — Force Sync initiate */
export function SaForceSyncScreen() {
  const [wallet, setWallet] = useState("");
  const [requestId, setRequestId] = useState("");
  const [reasonCode, setReasonCode] = useState("ORACLE_OUTAGE");
  const [ticket, setTicket] = useState("");
  const [syncId, setSyncId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function initiate() {
    if (!isWalletAddress(wallet) || !ticket.trim()) {
      setError("Wallet and incident ticket are required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const created = await initiateForceSync({
        walletAddress: wallet,
        requestId: requestId.trim() || undefined,
        reasonCode,
        incidentTicketId: ticket.trim()
      });
      setSyncId(created.syncId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Force sync initiation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <WorkspacePanel
      description="Initiate recovery for failed chain writes. A distinct super-admin must approve on the four-eyes screen."
      screenId="SA-S05"
      title="Force sync console"
    >
      {error ? <Alert tone="error">{error}</Alert> : null}
      {syncId ? (
        <Alert tone="success">
          Initiated sync <span className="mono">{syncId}</span>.{" "}
          <Link href="/governance/force-sync/approve">Proceed to four-eyes approval →</Link>
        </Alert>
      ) : null}
      <div className="field">
        <label htmlFor="fs-wallet">Wallet</label>
        <input
          className="mono"
          id="fs-wallet"
          onChange={(e) => setWallet(e.target.value)}
          value={wallet}
        />
      </div>
      <div className="field">
        <label htmlFor="fs-request">KYC request ID (optional)</label>
        <input id="fs-request" onChange={(e) => setRequestId(e.target.value)} value={requestId} />
      </div>
      <div className="field">
        <label htmlFor="fs-reason">Reason code</label>
        <input id="fs-reason" onChange={(e) => setReasonCode(e.target.value)} value={reasonCode} />
      </div>
      <div className="field">
        <label htmlFor="fs-ticket">Incident ticket</label>
        <input id="fs-ticket" onChange={(e) => setTicket(e.target.value)} value={ticket} />
      </div>
      <Button loading={loading} loadingLabel="Initiating…" onClick={() => void initiate()}>
        Initiate ForceSync
      </Button>
    </WorkspacePanel>
  );
}
