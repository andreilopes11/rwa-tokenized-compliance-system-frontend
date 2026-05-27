"use client";

import { useEffect, useState } from "react";
import { approveAdminKycRequest, listAdminKycRequests, rejectAdminKycRequest, revokeAdminIdentity } from "@/features/admin/api/client";
import type { KycRequestResponse } from "@/shared/api/types";
import { statusClass, statusLabel } from "@/shared/lib/formatters";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { SiteTopBar } from "@/shared/ui/SiteTopBar";
import { WorkspaceNav } from "@/shared/ui/WorkspaceNav";

export function ComplianceWorkspace() {
  const [requests, setRequests] = useState<KycRequestResponse[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function refresh() {
    try {
      setRequests(await listAdminKycRequests({ limit: 25 }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load KYC queue.");
    }
  }

  useEffect(() => {
    void refresh();
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
    window.location.href = "/login?role=compliance";
  }

  return (
    <main className="workspace-shell">
      <SiteTopBar
        title="Compliance workspace"
        subtitle="KYC approvals, rejections, and revocation only"
        actions={<WorkspaceNav onSignOut={signOut} signingOut={signingOut} />}
      />
      <section className="content">
        {error ? <Alert tone="error">{error}</Alert> : null}
        {notice ? <Alert tone="success">{notice}</Alert> : null}
        <div className="panel">
          <div className="panel-head">
            <h2>KYC queue</h2>
            <Button onClick={() => void refresh()} size="sm" variant="ghost">
              Refresh
            </Button>
          </div>
          {requests.length === 0 ? (
            <p className="muted">No KYC requests.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Wallet</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.requestId}>
                    <td>{request.walletAddress}</td>
                    <td>
                      <span className={`status ${statusClass(request.status)}`}>{statusLabel(request.status)}</span>
                    </td>
                    <td>{new Date(request.updatedAt).toLocaleString()}</td>
                    <td className="actions">
                      <Button
                        disabled={loading || !["SUBMITTED", "IN_REVIEW", "PENDING"].includes(request.status)}
                        onClick={() => void act(() => approveAdminKycRequest(request.requestId), "Approved off-chain and submitted.")}
                        size="sm"
                      >
                        Approve
                      </Button>
                      <Button
                        disabled={loading || !["SUBMITTED", "IN_REVIEW", "PENDING"].includes(request.status)}
                        onClick={() => void act(() => rejectAdminKycRequest(request.requestId, "Rejected by compliance."), "Request rejected.")}
                        size="sm"
                        variant="ghost"
                      >
                        Reject
                      </Button>
                      <Button
                        disabled={loading}
                        onClick={() => void act(() => revokeAdminIdentity(request.walletAddress), "Identity revoked.")}
                        size="sm"
                        variant="ghost"
                      >
                        Revoke
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}
