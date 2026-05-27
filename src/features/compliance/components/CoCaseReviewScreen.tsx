"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  approveAdminKycRequest,
  rejectAdminKycRequest
} from "@/features/compliance/api/client";
import { jsonFetch, authorizedRequest } from "@/shared/api/http";
import type { KycRequestResponse } from "@/shared/api/types";
import { statusClass, statusLabel } from "@/shared/lib/formatters";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { useMessages } from "@/shared/i18n/LocaleProvider";

/** CO-S03 — Case Review */
export function CoCaseReviewScreen({ requestId }: { requestId: string }) {
  const m = useMessages();
  const [record, setRecord] = useState<KycRequestResponse | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await jsonFetch<KycRequestResponse>(
      `/api/kyc/requests/${encodeURIComponent(requestId)}`,
      authorizedRequest()
    );
    setRecord(data);
  }

  useEffect(() => {
    void load().catch((err) =>
      setError(err instanceof Error ? err.message : "Unable to load case.")
    );
  }, [requestId]);

  async function approve() {
    if (!window.confirm(m.errors.approveTriggersChain)) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      const updated = await approveAdminKycRequest(requestId);
      setRecord(updated);
      setNotice("Approved off-chain. Oracle attestation pipeline started.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approve failed.");
    } finally {
      setLoading(false);
    }
  }

  async function reject() {
    if (!rejectReason.trim()) {
      setError("Rejection reason is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const updated = await rejectAdminKycRequest(requestId, rejectReason.trim());
      setRecord(updated);
      setNotice("Request rejected.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reject failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!record) {
    return (
      <div className="panel" data-screen-id="CO-S03">
        <p className="muted">Loading case…</p>
      </div>
    );
  }

  const canDecide = ["SUBMITTED", "IN_REVIEW", "PENDING"].includes(record.status);

  return (
    <div className="panel" data-screen-id="CO-S03">
      <p>
        <Link href="/compliance/kyc">← Back to queue</Link>
      </p>
      <h1>Case review</h1>
      {error ? <Alert tone="error">{error}</Alert> : null}
      {notice ? <Alert tone="success">{notice}</Alert> : null}
      <dl className="definition-grid">
        <div>
          <dt>Wallet</dt>
          <dd className="mono">{record.walletAddress}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            <span className={`status ${statusClass(record.status)}`}>
              {statusLabel(record.status)}
            </span>
          </dd>
        </div>
        <div>
          <dt>Identity hash</dt>
          <dd className="mono">{record.identityHash}</dd>
        </div>
        <div>
          <dt>Message</dt>
          <dd>{record.message}</dd>
        </div>
      </dl>
      <p className="muted">
        Document metadata is available via secure APIs with READ_INVESTOR_DOCS scope. Only hashes
        are synchronized on-chain.
      </p>
      {canDecide ? (
        <div className="actions">
          <Button disabled={loading} onClick={() => void approve()}>
            Approve (triggers chain)
          </Button>
          <div className="field">
            <label htmlFor="reject-reason">Reject reason</label>
            <input
              id="reject-reason"
              onChange={(e) => setRejectReason(e.target.value)}
              value={rejectReason}
            />
          </div>
          <Button disabled={loading} onClick={() => void reject()} variant="ghost">
            Reject
          </Button>
        </div>
      ) : null}
    </div>
  );
}
