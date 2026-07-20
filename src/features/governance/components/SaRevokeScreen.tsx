"use client";

import { useState } from "react";
import { revokeAdminIdentity } from "@/features/governance/api/client";
import { isWalletAddress } from "@/shared/lib/formatters";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { WorkspacePanel } from "@/shared/ui/WorkspacePanel";
import { useMessages } from "@/shared/i18n/LocaleProvider";

/** SA-S10 — Revoke eligibility */
export function SaRevokeScreen() {
  const m = useMessages();
  const [wallet, setWallet] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function revoke() {
    if (!isWalletAddress(wallet)) {
      setError("Enter a valid wallet address.");
      return;
    }
    if (!window.confirm("Revoke on-chain eligibility for this wallet?")) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await revokeAdminIdentity(wallet);
      setNotice(`Revoked. Status: ${result.status}, on-chain verified: ${result.onChainVerified}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Revocation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <WorkspacePanel
      description="Removes investor eligibility on-chain. Transfers to/from this wallet will fail at execution."
      screenId="SA-S10"
      title="Revoke eligibility"
    >
      {error ? <Alert tone="error">{error}</Alert> : null}
      {notice ? <Alert tone="success">{notice}</Alert> : null}
      <div className="field">
        <label htmlFor="revoke-wallet">Wallet address</label>
        <input
          className="mono"
          id="revoke-wallet"
          onChange={(e) => setWallet(e.target.value)}
          placeholder="0x..."
          value={wallet}
        />
      </div>
      <Button disabled={loading} onClick={() => void revoke()}>
        {m.workspace.governance.nav.revoke}
      </Button>
    </WorkspacePanel>
  );
}
