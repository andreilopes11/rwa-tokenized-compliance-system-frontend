"use client";

import { useEffect, useState } from "react";
import {
  approveAdminRedemption,
  approveAdminSubscription,
  fetchComplianceInvestorStatus,
  listAdminRedemptions,
  listAdminSubscriptions,
  rejectAdminRedemption,
  rejectAdminSubscription
} from "@/features/compliance/api/client";
import type { LifecycleStatus, RedemptionResponse, SubscriptionResponse } from "@/shared/api/types";
import { statusClass, statusLabel } from "@/shared/lib/formatters";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { useMessages } from "@/shared/i18n/LocaleProvider";

type CoLifecycleQueueScreenProps = {
  mode: "subscriptions" | "redemptions";
  screenId: "CO-S05" | "CO-S06";
};

/** CO-S05 / CO-S06 — Subscription or Redemption queue */
export function CoLifecycleQueueScreen({ mode, screenId }: CoLifecycleQueueScreenProps) {
  const m = useMessages();
  const [items, setItems] = useState<(SubscriptionResponse | RedemptionResponse)[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function refresh() {
    const data =
      mode === "subscriptions"
        ? await listAdminSubscriptions({ status: "PENDING" as LifecycleStatus, limit: 50 })
        : await listAdminRedemptions({ status: "PENDING" as LifecycleStatus, limit: 50 });
    setItems(data);
  }

  useEffect(() => {
    void refresh().catch((err) =>
      setError(err instanceof Error ? err.message : "Unable to load queue.")
    );
  }, [mode]);

  async function approve(item: SubscriptionResponse | RedemptionResponse) {
    if (mode === "subscriptions") {
      const subscription = item as SubscriptionResponse;
      try {
        const investor = await fetchComplianceInvestorStatus(subscription.walletAddress);
        if (!investor.onChainVerified || investor.status !== "APPROVED") {
          setError(m.workspace.compliance.subscriptionBlocked);
          return;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to verify investor status.");
        return;
      }
      setLoading(true);
      setError("");
      try {
        await approveAdminSubscription(subscription.subscriptionId);
        setNotice("Approved.");
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Approve failed.");
      } finally {
        setLoading(false);
      }
      return;
    }

    const redemption = item as RedemptionResponse;
    setLoading(true);
    setError("");
    try {
      await approveAdminRedemption(redemption.redemptionId);
      setNotice("Approved.");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approve failed.");
    } finally {
      setLoading(false);
    }
  }

  async function reject(item: SubscriptionResponse | RedemptionResponse) {
    setLoading(true);
    setError("");
    try {
      if (mode === "subscriptions") {
        await rejectAdminSubscription(
          (item as SubscriptionResponse).subscriptionId,
          "Rejected by compliance."
        );
      } else {
        await rejectAdminRedemption(
          (item as RedemptionResponse).redemptionId,
          "Rejected by compliance."
        );
      }
      setNotice("Rejected.");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reject failed.");
    } finally {
      setLoading(false);
    }
  }

  const title = mode === "subscriptions" ? "Subscription queue" : "Redemption queue";

  return (
    <div className="panel" data-screen-id={screenId}>
      <div className="panel-head">
        <h1>{title}</h1>
        <Button onClick={() => void refresh()} size="sm" variant="ghost">
          Refresh
        </Button>
      </div>
      {error ? <Alert tone="error">{error}</Alert> : null}
      {notice ? <Alert tone="success">{notice}</Alert> : null}
      {items.length === 0 ? (
        <p className="muted">No pending requests.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Wallet</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const id =
                "subscriptionId" in item ? item.subscriptionId : item.redemptionId;
              return (
                <tr key={id}>
                  <td className="mono">{item.walletAddress}</td>
                  <td>{item.amount}</td>
                  <td>
                    <span className={`status ${statusClass(item.status)}`}>
                      {statusLabel(item.status)}
                    </span>
                  </td>
                  <td className="actions">
                    <Button disabled={loading} onClick={() => void approve(item)} size="sm">
                      Approve
                    </Button>
                    <Button
                      disabled={loading}
                      onClick={() => void reject(item)}
                      size="sm"
                      variant="ghost"
                    >
                      Reject
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
