"use client";

import { useEffect, useState } from "react";
import {
  approveAdminRedemption,
  approveAdminSubscription,
  fetchInvestorStatusForGovernance,
  listAdminRedemptions,
  listAdminSubscriptions,
  rejectAdminRedemption,
  rejectAdminSubscription
} from "@/features/governance/api/client";
import type { LifecycleStatus, RedemptionResponse, SubscriptionResponse } from "@/shared/api/types";
import { statusClass, statusLabel } from "@/shared/lib/formatters";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { WorkspacePanel } from "@/shared/ui/WorkspacePanel";
import { useMessages } from "@/shared/i18n/LocaleProvider";

type Mode = "subscriptions" | "redemptions";

/** SA-S11 — Lifecycle approvals (subscriptions + redemptions) */
export function SaLifecycleScreen() {
  const m = useMessages();
  const [subscriptions, setSubscriptions] = useState<SubscriptionResponse[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionResponse[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function refresh() {
    const [subs, reds] = await Promise.all([
      listAdminSubscriptions({ status: "PENDING" as LifecycleStatus, limit: 50 }),
      listAdminRedemptions({ status: "PENDING" as LifecycleStatus, limit: 50 })
    ]);
    setSubscriptions(subs);
    setRedemptions(reds);
  }

  useEffect(() => {
    void refresh().catch((err) =>
      setError(err instanceof Error ? err.message : "Unable to load lifecycle queues.")
    );
  }, []);

  async function approveSubscription(item: SubscriptionResponse) {
    try {
      const investor = await fetchInvestorStatusForGovernance(item.walletAddress);
      if (!investor.onChainVerified || investor.status !== "APPROVED") {
        setError(m.workspace.governance.subscriptionBlocked);
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to verify investor status.");
      return;
    }
    await run(() => approveAdminSubscription(item.subscriptionId), "Subscription approved.");
  }

  async function run(action: () => Promise<unknown>, success: string) {
    setLoading(true);
    setError("");
    try {
      await action();
      setNotice(success);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <WorkspacePanel
      actions={
        <Button onClick={() => void refresh()} size="sm" variant="ghost">
          Refresh
        </Button>
      }
      screenId="SA-S11"
      title="Lifecycle approvals"
    >
      {error ? <Alert tone="error">{error}</Alert> : null}
      {notice ? <Alert tone="success">{notice}</Alert> : null}

      <LifecycleTable
        title="Subscription queue"
        mode="subscriptions"
        items={subscriptions}
        loading={loading}
        onApprove={(item) => void approveSubscription(item as SubscriptionResponse)}
        onReject={(item) =>
          void run(
            () =>
              rejectAdminSubscription(
                (item as SubscriptionResponse).subscriptionId,
                "Rejected by governance."
              ),
            "Subscription rejected."
          )
        }
      />

      <LifecycleTable
        title="Redemption queue"
        mode="redemptions"
        items={redemptions}
        loading={loading}
        onApprove={(item) =>
          void run(
            () => approveAdminRedemption((item as RedemptionResponse).redemptionId),
            "Redemption approved."
          )
        }
        onReject={(item) =>
          void run(
            () =>
              rejectAdminRedemption(
                (item as RedemptionResponse).redemptionId,
                "Rejected by governance."
              ),
            "Redemption rejected."
          )
        }
      />
    </WorkspacePanel>
  );
}

type LifecycleItem = SubscriptionResponse | RedemptionResponse;

function LifecycleTable({
  title,
  mode,
  items,
  loading,
  onApprove,
  onReject
}: {
  title: string;
  mode: Mode;
  items: LifecycleItem[];
  loading: boolean;
  onApprove: (item: LifecycleItem) => void;
  onReject: (item: LifecycleItem) => void;
}) {
  return (
    <div className="secondary-panel">
      <h2>{title}</h2>
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
              const id = "subscriptionId" in item ? item.subscriptionId : item.redemptionId;
              return (
                <tr key={`${mode}-${id}`}>
                  <td className="mono">{item.walletAddress}</td>
                  <td>{item.amount}</td>
                  <td>
                    <span className={`status ${statusClass(item.status)}`}>
                      {statusLabel(item.status)}
                    </span>
                  </td>
                  <td className="actions">
                    <Button disabled={loading} onClick={() => onApprove(item)} size="sm">
                      Approve
                    </Button>
                    <Button
                      disabled={loading}
                      onClick={() => onReject(item)}
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
