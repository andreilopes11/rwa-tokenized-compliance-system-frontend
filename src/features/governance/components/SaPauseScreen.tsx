"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchAdminAssetPauseStatus,
  listAdminAssetOfferings,
  pauseAdminAssetToken,
  unpauseAdminAssetToken
} from "@/features/governance/api/client";
import type { AssetOfferingResponse, PauseStatusResponse } from "@/shared/api/types";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/ui/EmptyState";
import { WorkspacePanel } from "@/shared/ui/WorkspacePanel";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { resolveClientError } from "@/shared/i18n/resolveClientError";
import { isApiError } from "@/shared/api/errors";

/** SA-S03 — Emergency pause controls */
export function SaPauseScreen() {
  const { t } = useLocale();
  const [assets, setAssets] = useState<AssetOfferingResponse[]>([]);
  const [pauseStatuses, setPauseStatuses] = useState<Record<string, PauseStatusResponse>>({});
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    const offerings = await listAdminAssetOfferings({ limit: 50 });
    setAssets(offerings);
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

  useEffect(() => {
    void refresh().catch((err) => {
      if (isApiError(err)) {
        setError(resolveClientError(err.message, t));
      }
    });
  }, [refresh, t]);

  async function act(action: () => Promise<unknown>, success: string) {
    if (!reason.trim()) {
      setError("Reason is required for emergency controls.");
      return;
    }
    if (!window.confirm(`Confirm: ${reason}`)) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      await action();
      setNotice(success);
      await refresh();
    } catch (err) {
      setError(isApiError(err) ? resolveClientError(err.message, t) : "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <WorkspacePanel screenId="SA-S03" title="Emergency controls">
      <div className="field">
        <label htmlFor="pause-reason">Reason (required)</label>
        <input id="pause-reason" onChange={(e) => setReason(e.target.value)} value={reason} />
      </div>
      {error ? <Alert tone="error">{error}</Alert> : null}
      {notice ? <Alert tone="success">{notice}</Alert> : null}
      {assets.length === 0 ? <EmptyState>No contracts available to control.</EmptyState> : null}
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
                  onClick={() => void act(() => pauseAdminAssetToken(asset.assetId), "Pause submitted.")}
                  size="sm"
                >
                  Pause
                </Button>
                <Button
                  disabled={loading || !paused}
                  onClick={() =>
                    void act(() => unpauseAdminAssetToken(asset.assetId), "Unpause submitted.")
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
    </WorkspacePanel>
  );
}
