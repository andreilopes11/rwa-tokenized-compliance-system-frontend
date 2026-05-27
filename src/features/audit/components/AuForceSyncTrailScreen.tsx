"use client";

import { useEffect, useState } from "react";
import { listAdminAuditEvents } from "@/features/audit/api/client";
import type { AuditEventResponse } from "@/shared/api/types";
import { Alert } from "@/shared/ui/Alert";

/** AU-S05 — Force sync audit trail */
export function AuForceSyncTrailScreen() {
  const [events, setEvents] = useState<AuditEventResponse[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void listAdminAuditEvents({ limit: 200 })
      .then((all) =>
        setEvents(
          all.filter((e) =>
            e.action.includes("FORCE_SYNC") || e.action.includes("ORACLE_RETRY")
          )
        )
      )
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load trail."));
  }, []);

  return (
    <div className="panel" data-screen-id="AU-S05">
      <h1>Force sync audit trail</h1>
      {error ? <Alert tone="error">{error}</Alert> : null}
      <ul className="activity-list">
        {events.map((event) => (
          <li key={event.eventId}>
            <div>
              <strong>{event.action}</strong>
              <p className="muted">{event.message}</p>
              <p className="muted">
                Initiator/actor: {event.actor} · {event.walletAddress}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
