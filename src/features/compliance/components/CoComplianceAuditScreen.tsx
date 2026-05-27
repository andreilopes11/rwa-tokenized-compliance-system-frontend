"use client";

import { useEffect, useState } from "react";
import { listAdminAuditEvents } from "@/features/compliance/api/client";
import type { AuditEventResponse } from "@/shared/api/types";
import { statusClass, statusLabel } from "@/shared/lib/formatters";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";

/** CO-S07 — Recent compliance events (read-only) */
export function CoComplianceAuditScreen() {
  const [events, setEvents] = useState<AuditEventResponse[]>([]);
  const [error, setError] = useState("");

  async function refresh() {
    setEvents(await listAdminAuditEvents({ limit: 30 }));
  }

  useEffect(() => {
    void refresh().catch((err) =>
      setError(err instanceof Error ? err.message : "Unable to load events.")
    );
  }, []);

  return (
    <div className="panel" data-screen-id="CO-S07">
      <div className="panel-head">
        <h1>Recent compliance events</h1>
        <Button onClick={() => void refresh()} size="sm" variant="ghost">
          Refresh
        </Button>
      </div>
      {error ? <Alert tone="error">{error}</Alert> : null}
      <ul className="activity-list">
        {events.map((event) => (
          <li key={event.eventId}>
            <div>
              <strong>{event.action}</strong>
              <p className="muted">{event.message ?? event.walletAddress}</p>
            </div>
            <span className={`status ${statusClass(event.outcome)}`}>{statusLabel(event.outcome)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
