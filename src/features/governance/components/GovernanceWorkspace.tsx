"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchAdminAssetPauseStatus,
  listAdminAssetOfferings,
  pauseAdminAssetToken,
  unpauseAdminAssetToken
} from "@/features/admin/api/client";
import { isApiError } from "@/shared/api/errors";
import type { AssetOfferingResponse, PauseStatusResponse } from "@/shared/api/types";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { resolveClientError } from "@/shared/i18n/resolveClientError";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { SiteTopBar } from "@/shared/ui/SiteTopBar";
import { WorkspaceNav } from "@/shared/ui/WorkspaceNav";

export function GovernanceWorkspace() {
  const { t } = useLocale();
  const [assets, setAssets] = useState<AssetOfferingResponse[]>([]);
  const [pauseStatuses, setPauseStatuses] = useState<Record<string, PauseStatusResponse>>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const reportError = useCallback(
    (err: unknown, fallback: string) => {
      if (isApiError(err)) {
        setError(resolveClientError(err.message, t));
        return;
      }
      setError(err instanceof Error ? err.message : fallback);
    },
    [t]
  );

  const refreshPauseStatuses = useCallback(async (offerings: AssetOfferingResponse[]) => {
    const results = await Promise.allSettled(
      offerings.map((asset) => fetchAdminAssetPauseStatus(asset.assetId))
    );
    const statuses: Record<string, PauseStatusResponse> = {};
    offerings.forEach((asset, index) => {
      const result = results[index];
      if (result.status === "fulfilled") {
        statuses[asset.assetId] = result.value;
      }
    });
    setPauseStatuses(statuses);
  }, []);

  const refresh = useCallback(async () => {
    const offerings = await listAdminAssetOfferings({ limit: 50 });
    setAssets(offerings);
    await refreshPauseStatuses(offerings);
  }, [refreshPauseStatuses]);

  useEffect(() => {
    void refresh().catch((err) => reportError(err, "Unable to load governance assets."));
  }, [refresh, reportError]);

  async function act(action: () => Promise<unknown>, success: string) {
    try {
      setLoading(true);
      setError("");
      await action();
      setNotice(success);
      await refresh();
    } catch (err) {
      reportError(err, "Request failed.");
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
            <Button disabled={loading} onClick={() => void refresh().catch((err) => reportError(err, "Refresh failed."))} size="sm" variant="ghost">
              Refresh
            </Button>
          </div>
          {assets.length === 0 ? (
            <p className="muted">No assets configured. Create an asset offering in governance operations or seed the database.</p>
          ) : (
            <ul className="activity-list">
              {assets.map((asset) => {
                const pauseStatus = pauseStatuses[asset.assetId];
                const paused = pauseStatus?.paused === true;
                return (
                  <li key={asset.assetId}>
                    <div>
                      <strong>
                        {asset.symbol} · {asset.name}
                      </strong>
                      <p className="muted">
                        {pauseStatus === undefined
                          ? "Pause state unavailable (chain read failed or not loaded)."
                          : paused
                            ? "TOKEN PAUSED"
                            : "TOKEN ACTIVE"}
                      </p>
                    </div>
                    <div className="actions">
                      <Button
                        disabled={loading || paused || pauseStatus === undefined}
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
