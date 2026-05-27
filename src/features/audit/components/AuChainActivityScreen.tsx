"use client";

import { useEffect, useState } from "react";
import { listAdminBlockchainTransactions } from "@/features/audit/api/client";
import type { BlockchainTransactionResponse } from "@/shared/api/types";
import { explorerLink } from "@/shared/lib/web3";
import { Alert } from "@/shared/ui/Alert";

/** AU-S03 — On-chain activity */
export function AuChainActivityScreen() {
  const [transactions, setTransactions] = useState<BlockchainTransactionResponse[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void listAdminBlockchainTransactions({ limit: 100 })
      .then(setTransactions)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load transactions."));
  }, []);

  return (
    <div className="panel" data-screen-id="AU-S03">
      <h1>On-chain activity</h1>
      {error ? <Alert tone="error">{error}</Alert> : null}
      <ul className="activity-list">
        {transactions.map((tx) => (
          <li key={tx.transactionId}>
            <div>
              <strong>{tx.transactionType}</strong>
              <p className="muted">{tx.walletAddress}</p>
              {tx.transactionHash ? (
                <a
                  className="mono external-link"
                  href={explorerLink("tx", tx.transactionHash) ?? undefined}
                  rel="noreferrer"
                  target="_blank"
                >
                  {tx.transactionHash}
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
