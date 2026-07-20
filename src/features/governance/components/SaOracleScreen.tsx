"use client";

import { useEffect, useState } from "react";
import { fetchOracleFeed } from "@/features/governance/api/client";
import type { OracleFeedResponse } from "@/shared/api/types";
import { Alert } from "@/shared/ui/Alert";
import { WorkspacePanel } from "@/shared/ui/WorkspacePanel";

/** SA-S04 — Oracle configuration (read + label stub/production) */
export function SaOracleScreen() {
  const [feed, setFeed] = useState<OracleFeedResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetchOracleFeed()
      .then(setFeed)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load oracle feed."));
  }, []);

  return (
    <WorkspacePanel screenId="SA-S04" title="Oracle configuration">
      {error ? <Alert tone="error">{error}</Alert> : null}
      {feed?.status === "STUB" ? (
        <Alert tone="warning">
          STUB feed — production deployments must use Chainlink/API3 attestation per deployment.md.
        </Alert>
      ) : (
        <Alert tone="success">Production oracle feed connected.</Alert>
      )}
      {feed ? (
        <dl className="definition-grid">
          <div>
            <dt>Provider</dt>
            <dd>{feed.provider}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{feed.status}</dd>
          </div>
          <div>
            <dt>NAV index</dt>
            <dd>{feed.navIndex}</dd>
          </div>
        </dl>
      ) : null}
    </WorkspacePanel>
  );
}
