"use client";

import { useEffect, useState } from "react";
import { listAdminAuditEvents } from "@/features/audit/api/client";
import type { AuditEventResponse } from "@/shared/api/types";
import { Alert } from "@/shared/ui/Alert";

const KYC_ACTIONS = new Set([
  "REQUEST_CREATED",
  "IDENTITY_APPROVED",
  "REQUEST_REJECTED",
  "IDENTITY_REVOKED",
  "KYC_APPROVED_OFFCHAIN",
  "IDENTITY_APPROVAL_FAILED"
]);

/** AU-S02 — KYC decision history */
export function AuKycHistoryScreen() {
  const [events, setEvents] = useState<AuditEventResponse[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void listAdminAuditEvents({ limit: 200 })
      .then((all) => setEvents(all.filter((e) => KYC_ACTIONS.has(e.action))))
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load history."));
  }, []);

  return (
    <div className="panel" data-screen-id="AU-S02">
      <h1>KYC decision history</h1>
      {error ? <Alert tone="error">{error}</Alert> : null}
      <ul className="activity-list">
        {events.map((event) => (
          <li key={event.eventId}>
            <div>
              <strong>{event.action}</strong>
              <p className="muted">
                {event.actor} · {new Date(event.createdAt).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
