"use client";

import { FormEvent, useEffect, useState } from "react";
import { createAdminAssetOffering, listAdminAssetOfferings } from "@/features/governance/api/client";
import type { AssetOfferingResponse } from "@/shared/api/types";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";

/** SA-S02 — Asset & policy admin */
export function SaAssetsScreen() {
  const [assets, setAssets] = useState<AssetOfferingResponse[]>([]);
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function refresh() {
    setAssets(await listAdminAssetOfferings({ limit: 50 }));
  }

  useEffect(() => {
    void refresh().catch((err) =>
      setError(err instanceof Error ? err.message : "Unable to load assets.")
    );
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await createAdminAssetOffering({
        symbol,
        name,
        assetType: "FUND",
        jurisdiction: "EU",
        status: "ACTIVE",
        navPrice: 100,
        supplyCap: 1_000_000,
        issuerName: "VaultGuard Issuer",
        issuerMetadata: "Production offering"
      });
      setNotice("Asset created.");
      setSymbol("");
      setName("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed.");
    }
  }

  return (
    <div className="panel" data-screen-id="SA-S02">
      <h1>Asset &amp; policy admin</h1>
      {error ? <Alert tone="error">{error}</Alert> : null}
      {notice ? <Alert tone="success">{notice}</Alert> : null}
      <form className="stack-form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="asset-symbol">Symbol</label>
          <input id="asset-symbol" onChange={(e) => setSymbol(e.target.value)} value={symbol} />
        </div>
        <div className="field">
          <label htmlFor="asset-name">Name</label>
          <input id="asset-name" onChange={(e) => setName(e.target.value)} value={name} />
        </div>
        <Button type="submit">Create offering</Button>
      </form>
      <ul className="activity-list">
        {assets.map((asset) => (
          <li key={asset.assetId}>
            <strong>
              {asset.symbol} · {asset.name}
            </strong>
            <span className={`status ${asset.status === "ACTIVE" ? "approved" : "pending"}`}>
              {asset.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
