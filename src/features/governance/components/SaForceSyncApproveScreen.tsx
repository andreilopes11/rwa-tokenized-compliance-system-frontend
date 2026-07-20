"use client";

import { useState } from "react";
import { approveForceSync } from "@/features/governance/api/client";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { WorkspacePanel } from "@/shared/ui/WorkspacePanel";

/** SA-S06 — Four-eyes ForceSync approval */
export function SaForceSyncApproveScreen() {
  const [syncId, setSyncId] = useState("");
  const [identityHash, setIdentityHash] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function approve() {
    if (!syncId.trim() || !identityHash.startsWith("0x")) {
      setError("Sync ID and identity hash (0x…) are required.");
      return;
    }
    setError("");
    try {
      const result = await approveForceSync(syncId.trim(), identityHash.trim());
      setNotice(`Approved. Status: ${result.status}, tx: ${result.transactionHash ?? "pending"}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed (distinct approver required).");
    }
  }

  return (
    <WorkspacePanel
      description="Second super-admin principal approves HSM-signed execution. Cannot be the same user who initiated."
      screenId="SA-S06"
      title="Four-eyes approval"
    >
      {error ? <Alert tone="error">{error}</Alert> : null}
      {notice ? <Alert tone="success">{notice}</Alert> : null}
      <div className="field">
        <label htmlFor="approve-sync-id">Sync ID</label>
        <input id="approve-sync-id" onChange={(e) => setSyncId(e.target.value)} value={syncId} />
      </div>
      <div className="field">
        <label htmlFor="approve-hash">Identity hash</label>
        <input
          className="mono"
          id="approve-hash"
          onChange={(e) => setIdentityHash(e.target.value)}
          value={identityHash}
        />
      </div>
      <Button onClick={() => void approve()}>Approve ForceSync</Button>
    </WorkspacePanel>
  );
}
