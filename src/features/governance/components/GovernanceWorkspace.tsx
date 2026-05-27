"use client";

import { useEffect, useState } from "react";
import { fetchAssetOfferings } from "@/features/assets/api/client";
import { fetchAdminAssetPauseStatus, pauseAdminAssetToken, unpauseAdminAssetToken } from "@/features/admin/api/client";
import type { AssetOfferingResponse, PauseStatusResponse } from "@/shared/api/types";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { SiteTopBar } from "@/shared/ui/SiteTopBar";
import { WorkspaceNav } from "@/shared/ui/WorkspaceNav";

export function GovernanceWorkspace() {
  const [assets, setAssets] = useState<AssetOfferingResponse[]>([]);
  const [pauseStatuses, setPauseStatuses] = useState<Record<string, PauseStatusResponse>>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function refresh() {
    const offerings = await fetchAssetOfferings();
    setAssets(offerings);
    const statusEntries = await Promise.all(
      offerings.map(async (asset) => [asset.assetId, await fetchAdminAssetPauseStatus(asset.assetId)] as const)
    );
    setPauseStatuses(Object.fromEntries(statusEntries));
  }

  useEffect(() => {
    void refresh().catch((err) => setError(err instanceof Error ? err.message : "Unable to load governance assets."));
  }, []);

  async function act(action: () => Promise<unknown>, success: string) {
    try {
      setLoading(true);
      setError("");
      await action();
      setNotice(success);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login?role=governance";
  }

  return (
    <main className="workspace-shell">
      <SiteTopBar
        title="Governance workspace"
        subtitle="Asset controls, pause/unpause, and operational safeguards"
        actions={<WorkspaceNav onSignOut={signOut} signingOut={signingOut} />}
      />
      <section className="content">
        {error ? <Alert tone="error">{error}</Alert> : null}
        {notice ? <Alert tone="success">{notice}</Alert> : null}
        <div className="panel">
          <div className="panel-head">
            <h2>Asset pause controls</h2>
            <Button onClick={() => void refresh()} size="sm" variant="ghost">
              Refresh
            </Button>
          </div>
          {assets.length === 0 ? (
            <p className="muted">No assets configured.</p>
          ) : (
            <ul className="activity-list">
              {assets.map((asset) => {
                const paused = pauseStatuses[asset.assetId]?.paused === true;
                return (
                  <li key={asset.assetId}>
                    <div>
                      <strong>
                        {asset.symbol} · {asset.name}
                      </strong>
                      <p className="muted">{paused ? "TOKEN PAUSED" : "TOKEN ACTIVE"}</p>
                    </div>
                    <div className="actions">
                      <Button
                        disabled={loading || paused}
                        onClick={() =>
                          void act(
                            () => pauseAdminAssetToken(asset.assetId),
                            `Pause submitted for ${asset.symbol}.`
                          )
                        }
                        size="sm"
                      >
                        Pause
                      </Button>
                      <Button
                        disabled={loading || !paused}
                        onClick={() =>
                          void act(
                            () => unpauseAdminAssetToken(asset.assetId),
                            `Unpause submitted for ${asset.symbol}.`
                          )
                        }
                        size="sm"
                        variant="ghost"
                      >
                        Unpause
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
