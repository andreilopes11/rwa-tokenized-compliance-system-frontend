"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  createAdminAssetOffering,
  grantAssetInvestorAccess,
  listAdminAssetOfferings,
  listAssetInvestorAccess,
  publishAdminAssetOffering,
  revokeAssetInvestorAccess,
  updateAdminAssetOffering
} from "@/features/governance/api/client";
import type {
  AssetInvestorAccessResponse,
  AssetOfferingResponse,
  AssetOfferingVisibility
} from "@/shared/api/types";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";

/** SA-S02 — Contract (asset) administration */
export function SaAssetsScreen() {
  const [assets, setAssets] = useState<AssetOfferingResponse[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [accessList, setAccessList] = useState<AssetInvestorAccessResponse[]>([]);
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [issuerMetadata, setIssuerMetadata] = useState("");
  const [visibility, setVisibility] = useState<AssetOfferingVisibility>("PRIVATE");
  const [identityHash, setIdentityHash] = useState("");
  const [investorWallet, setInvestorWallet] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function refresh() {
    setAssets(await listAdminAssetOfferings({ limit: 50 }));
  }

  async function refreshAccess(assetId: string) {
    if (!assetId) {
      setAccessList([]);
      return;
    }
    setAccessList(await listAssetInvestorAccess(assetId));
  }

  useEffect(() => {
    void refresh().catch((err) =>
      setError(err instanceof Error ? err.message : "Unable to load contracts.")
    );
  }, []);

  useEffect(() => {
    void refreshAccess(selectedAssetId).catch(() => setAccessList([]));
  }, [selectedAssetId]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await createAdminAssetOffering({
        symbol,
        name,
        assetType: "FUND",
        jurisdiction: "EU",
        status: "DRAFT",
        visibility,
        navPrice: 100,
        supplyCap: 1_000_000,
        issuerName: "VaultGuard Issuer",
        issuerMetadata: issuerMetadata || "Draft contract — publish when ready."
      });
      setNotice("Contract created as DRAFT.");
      setSymbol("");
      setName("");
      setIssuerMetadata("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed.");
    }
  }

  async function publishAsset(assetId: string) {
    setError("");
    try {
      await publishAdminAssetOffering(assetId);
      setNotice("Contract published (ACTIVE).");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed.");
    }
  }

  async function setAssetVisibility(assetId: string, nextVisibility: AssetOfferingVisibility) {
    setError("");
    try {
      await updateAdminAssetOffering(assetId, { visibility: nextVisibility });
      setNotice(`Visibility set to ${nextVisibility}.`);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    }
  }

  async function linkInvestor(event: FormEvent) {
    event.preventDefault();
    if (!selectedAssetId) {
      setError("Select a private contract first.");
      return;
    }
    setError("");
    try {
      await grantAssetInvestorAccess(selectedAssetId, {
        identityHash: identityHash.trim(),
        walletAddress: investorWallet.trim() || undefined
      });
      setNotice("Investor linked by identity hash.");
      setIdentityHash("");
      setInvestorWallet("");
      await refreshAccess(selectedAssetId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Link failed.");
    }
  }

  async function unlinkInvestor(hash: string) {
    if (!selectedAssetId) {
      return;
    }
    setError("");
    try {
      await revokeAssetInvestorAccess(selectedAssetId, hash);
      setNotice("Investor access revoked.");
      await refreshAccess(selectedAssetId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Revoke failed.");
    }
  }

  const selectedAsset = assets.find((asset) => asset.assetId === selectedAssetId);

  return (
    <div className="panel" data-screen-id="SA-S02">
      <h1>Contract administration</h1>
      <p className="muted">
        Create contracts as DRAFT, set PUBLIC or PRIVATE visibility, publish when ready. Private
        contracts require linking each investor by their unique identity hash (from KYC).
      </p>
      {error ? <Alert tone="error">{error}</Alert> : null}
      {notice ? <Alert tone="success">{notice}</Alert> : null}

      <form className="stack-form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="asset-symbol">Symbol</label>
          <input id="asset-symbol" onChange={(e) => setSymbol(e.target.value)} required value={symbol} />
        </div>
        <div className="field">
          <label htmlFor="asset-name">Name</label>
          <input id="asset-name" onChange={(e) => setName(e.target.value)} required value={name} />
        </div>
        <div className="field">
          <label htmlFor="asset-metadata">Description</label>
          <textarea
            id="asset-metadata"
            onChange={(e) => setIssuerMetadata(e.target.value)}
            rows={3}
            value={issuerMetadata}
          />
        </div>
        <div className="field">
          <label htmlFor="asset-visibility">Visibility</label>
          <select
            id="asset-visibility"
            onChange={(e) => setVisibility(e.target.value as AssetOfferingVisibility)}
            value={visibility}
          >
            <option value="PUBLIC">PUBLIC — any investor</option>
            <option value="PRIVATE">PRIVATE — linked investors only</option>
          </select>
        </div>
        <Button type="submit">Create draft contract</Button>
      </form>

      <h2>Contracts</h2>
      <ul className="activity-list">
        {assets.map((asset) => (
          <li key={asset.assetId}>
            <strong>
              {asset.symbol} · {asset.name}
            </strong>
            <span className={`status ${asset.status === "ACTIVE" ? "approved" : "pending"}`}>
              {asset.status} · {asset.visibility}
            </span>
            <div className="lifecycle-controls">
              {asset.status === "DRAFT" ? (
                <button className="primary-button" onClick={() => publishAsset(asset.assetId)} type="button">
                  Publish
                </button>
              ) : null}
              <button
                className="secondary-button"
                onClick={() =>
                  setAssetVisibility(asset.assetId, asset.visibility === "PUBLIC" ? "PRIVATE" : "PUBLIC")
                }
                type="button"
              >
                Set {asset.visibility === "PUBLIC" ? "PRIVATE" : "PUBLIC"}
              </button>
              <button
                className="secondary-button"
                onClick={() => setSelectedAssetId(asset.assetId)}
                type="button"
              >
                Manage access
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedAsset?.visibility === "PRIVATE" ? (
        <div className="secondary-panel">
          <h3>Private access — {selectedAsset.symbol}</h3>
          <form className="stack-form" onSubmit={linkInvestor}>
            <div className="field">
              <label htmlFor="investor-hash">Investor identity hash (64-char SHA-256)</label>
              <input
                id="investor-hash"
                onChange={(e) => setIdentityHash(e.target.value)}
                pattern="[a-fA-F0-9]{64}"
                placeholder="From approved KYC profile"
                required
                value={identityHash}
              />
            </div>
            <div className="field">
              <label htmlFor="investor-wallet">Wallet (optional)</label>
              <input
                id="investor-wallet"
                onChange={(e) => setInvestorWallet(e.target.value)}
                placeholder="0x..."
                value={investorWallet}
              />
            </div>
            <Button type="submit">Link investor</Button>
          </form>
          <ul className="activity-list">
            {accessList.map((access) => (
              <li key={access.accessId}>
                <span className="mono muted">{access.identityHash}</span>
                {access.walletAddress ? (
                  <span className="mono muted">{access.walletAddress}</span>
                ) : null}
                <button
                  className="secondary-button"
                  onClick={() => unlinkInvestor(access.identityHash)}
                  type="button"
                >
                  Revoke
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : selectedAsset ? (
        <p className="muted">Public contracts do not require investor linkage.</p>
      ) : null}
    </div>
  );
}
