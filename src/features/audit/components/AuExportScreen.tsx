"use client";

import { useMemo, useState } from "react";
import { listAdminAuditEvents } from "@/features/audit/api/client";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";

/** AU-S04 — Compliance export (read-only generator) */
export function AuExportScreen() {
  const [exportId, setExportId] = useState<string | null>(null);
  const [integrityHash, setIntegrityHash] = useState<string | null>(null);
  const [error, setError] = useState("");

  const manifest = useMemo(
    () => ({
      exportedAt: new Date().toISOString(),
      exportId: exportId ?? "pending",
      integrityHash: integrityHash ?? "pending"
    }),
    [exportId, integrityHash]
  );

  async function generateExport() {
    setError("");
    try {
      const events = await listAdminAuditEvents({ limit: 500 });
      const payload = JSON.stringify(events);
      const id = crypto.randomUUID();
      const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(payload));
      const hash = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      setExportId(id);
      setIntegrityHash(`0x${hash.slice(0, 64)}`);
      const blob = new Blob([payload], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `vaultguard-audit-${id}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    }
  }

  return (
    <div className="panel" data-screen-id="AU-S04">
      <h1>Compliance export</h1>
      <p className="muted">Download JSON manifest with SHA-256 integrity hash for regulator evidence packs.</p>
      {error ? <Alert tone="error">{error}</Alert> : null}
      {exportId ? (
        <Alert tone="success">
          Export <span className="mono">{exportId}</span> · integrity{" "}
          <span className="mono">{integrityHash}</span>
        </Alert>
      ) : null}
      <pre className="mono muted">{JSON.stringify(manifest, null, 2)}</pre>
      <Button onClick={() => void generateExport()}>Generate export</Button>
    </div>
  );
}
