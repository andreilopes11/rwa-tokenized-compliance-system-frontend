# Architecture

GitHub repository: <https://github.com/andreilopes11/rwa-tokenized-compliance-system.git>

## System Context

The RWA Tokenized Compliance System serves regulated asset issuers that need to tokenize real-world assets without allowing unrestricted token transfers. Investors interact through a wallet-based portal, compliance operators review eligibility off-chain, and the blockchain enforces transfer restrictions.

## C4 Level 1: Context

- Investor submits documents, connects a wallet, buys or receives tokens, and transfers only to approved addresses.
- Compliance Admin reviews KYC/AML status and controls investor eligibility.
- RWA System coordinates off-chain validation and on-chain enforcement.
- External Banking or KYC Systems are represented as simulated integrations in the portfolio version.
- EVM Network stores token balances, identity eligibility, events, and compliance-relevant transfer outcomes.

## C4 Level 2: Containers

- Investor Dashboard: Next.js application for wallet connection, onboarding status, asset discovery, document upload simulation, and token visibility.
- Admin/Issuer Dashboard: Next.js admin route for KYC queue review, approval, rejection, revocation, asset setup, lifecycle queues, compliance rules, and audit history.
- Compliance Service: Java/Spring Boot API for KYC workflow, asset offerings, document hashing, explicit rule evaluation, admin approval decisions, and blockchain transaction orchestration.
- Permissioned Token Contracts: Solidity contracts that represent ownership and prevent transfers involving non-approved identities.
- Oracle/Admin Signer Simulation: controlled integration point that submits compliance decisions on-chain during the portfolio phase.
- Observability and Scripts: future deployment, demo, and audit evidence assets.

## Core Flow

1. Investor connects wallet and submits a KYC request.
2. Compliance service validates the request and stores only a document hash reference.
3. Admin reviews the pending request in the admin dashboard.
4. Admin approval triggers an on-chain `addIdentity` transaction through the signer simulation.
5. Smart contract emits an identity approval event and backend stores the tx/audit records.
6. Token transfers call compliance checks before state changes.
7. Revoked or unknown addresses are rejected by the token contract.
8. Investor and admin dashboards read persisted asset offerings for production-style fund context.
9. Eligible investors can request subscriptions and redemptions; issuer approval mints subscription tokens or records simulated redemption settlement.
10. Lifecycle create and approval paths evaluate off-chain compliance profiles and per-asset rules before persisting decisions.

## On-Chain Boundary

The blockchain layer owns:

- Token balances and transfer restrictions.
- Identity approval flags or registry references.
- Immutable compliance events.
- Emergency freeze state.

The blockchain layer does not own:

- Raw documents.
- Personal identity details.
- KYC scoring logic.
- Banking integration state.

## Off-Chain Boundary

The backend layer owns:

- KYC/AML workflow simulation.
- Document hashing and storage references.
- Admin signing orchestration.
- API contracts for frontend and future enterprise integrations.
- Investor profile and asset-rule evaluation for lifecycle decisions.

The backend layer must not bypass on-chain transfer restrictions. Even if the backend is compromised, the token contract remains the final enforcement point.

## Implementation Direction

The first implementation should start with `blockchain/evm`, then add `backend/compliance-service`, then connect `frontend/investor-dashboard`. The oracle simulation can begin as an admin signer and later be replaced by Chainlink Functions or another decentralized oracle pattern.

## Production Target Architecture

The production roadmap keeps the same compliance boundary while adding operational services around it.

- Investor Dashboard: onboarding, offering discovery, subscription requests, redemption requests, positions, and transaction status.
- Admin/Issuer Dashboard: KYC queue, investor records, asset offerings, compliance rules, subscription approvals, redemption approvals, revocations, cap table, and audit history.
- Compliance Service: KYC/AML workflow, document hashing, investor eligibility, explainable rule evaluation, and stable API contracts.
- Asset/Fund Service: asset offerings, share classes, NAV or price data, supply caps, positions, subscriptions, redemptions, and corporate actions.
- PostgreSQL Persistence: durable state for investors, KYC requests, assets, subscriptions, redemptions, audit events, and blockchain transactions.
- KMS/Vault-Backed Signer: production transaction signing without raw private keys in application environment variables.
- EVM Contracts: identity registry, permissioned token, compliance modules, pause controls, and auditable events.
- Monitoring/Audit Pipeline: structured logs, request IDs, metrics, alerts, on-chain event indexing, and immutable operational evidence.

Production implementation details are tracked in [Production Feature Roadmap](production-feature-roadmap.md).

## Phase 1 Persistence Baseline

The backend persistence boundary now targets durable storage instead of process memory.

- Local profile: H2 file database in PostgreSQL compatibility mode so the Anvil demo works without Docker.
- Hosted profile: PostgreSQL through `DATABASE_URL`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD`.
- Flyway owns schema creation for KYC requests, investor snapshots, audit events, and blockchain transaction submissions.
- The public REST API remains stable while repository implementations can change behind the service boundary.

## Phase 2 Admin Operations Baseline

The KYC lifecycle is now operator-managed instead of auto-approving every valid investor submission.

- Investor submissions create durable `PENDING` KYC records without calling `addIdentity`.
- Admin endpoints under `/api/admin/**` require `X-Admin-Token`.
- The admin dashboard at `/admin` lists KYC requests, approves, rejects, revokes, and displays audit history.
- Approval and revocation remain the only backend paths that submit identity registry transactions.

## Phase 3 Asset/Fund Baseline

The MVP now has a production-style asset model around the permissioned token.

- `asset_offerings` persists name, symbol, asset type, jurisdiction, status, supply cap, NAV or price, issuer metadata, and optional token address.
- A default `Lisbon Real Estate Income Fund` offering is seeded when the backend starts with an empty asset table.
- Public asset APIs expose active offerings for investor discovery.
- Admin asset creation is protected by `X-Admin-Token` and creates audit events.
- `share_classes` and `positions` tables provide persistence groundwork for Phase 4 subscription, redemption, and cap-table reconciliation.

## Phase 4 Subscription And Redemption Baseline

The asset lifecycle now has request, approval, and position-tracking flows.

- `subscriptions` persists investor allocation requests, operator decisions, mint tx hashes, status, reason, and timestamps.
- `redemptions` persists investor exit requests, operator decisions, simulated settlement status, reason, and timestamps.
- Approved subscriptions call `mint(address,uint256)` on the configured permissioned token and increment persisted positions.
- Approved redemptions require approved/on-chain investor status and sufficient persisted balance, then decrement positions without burning tokens in this baseline.
- Investor and admin dashboards expose lifecycle request and approval workflows while payment/fiat settlement remains simulated.

## Phase 5 Configurable Compliance Rules Baseline

Lifecycle eligibility now uses explicit off-chain rule records instead of a single approved boolean.

- `investor_compliance_profiles` stores off-chain operational attributes used for lifecycle decisions.
- `asset_compliance_rules` stores per-asset allowed investor types, jurisdictions, accreditation/qualified requirements, lockup days, and max position amounts.
- `ComplianceRuleService` returns explainable decisions and is called during subscription/redemption creation and admin approval.
- Admin APIs and the `/admin` dashboard can load and update investor profiles and asset rules.
- Contract enforcement remains intentionally narrow in this phase: the identity registry and permissioned token still block transfers for unapproved senders or receivers, while private eligibility inputs stay off-chain.

## Phase 6 ERC-3643 Alignment Baseline

The on-chain contracts now support ERC-3643-inspired identity claims and modular compliance checks while maintaining backward compatibility with the existing approval/revocation demo.

### ERC-3643 Compatibility Path

ERC-3643 (Token for Regulated Exchange) is a standard for security tokens on Ethereum, defining roles like Identity Registry, Token, Compliance Module, and Claim Issuer. This implementation aligns the architecture towards these patterns without breaking the MVP:

- **Identity Registry**: Extended with claims system supporting key-value attributes issued by claim issuers. Claims can represent KYC status, accreditation, jurisdiction, etc. Backward-compatible verified flag remains available.
- **Token**: Uses modular compliance module for transfer restrictions instead of hardcoded checks.
- **Compliance Module**: Checks identity verification or valid claims for transfer eligibility. Can be extended for more complex rules in future phases.
- **Claim Issuer**: Admin (owner) can issue claims; future phases can add dedicated claim issuer contracts.

### Implemented Changes

- `blockchain/evm/src/IdentityRegistry.sol`: Added `Claim` struct and mappings for claims by wallet and topic. Functions: `addClaim`, `removeClaim`, `getClaim`, `hasValidClaim`.
- `blockchain/evm/src/ComplianceModule.sol`: New contract implementing transfer compliance checks. Supports both legacy verified status and claim-based eligibility.

## Architectural Improvements

To optimize the MVP, the following architectural improvements are identified:

- **Security**: Audit smart contracts for vulnerabilities (e.g., reentrancy), add rate limiting in the backend, and implement detailed logs for auditing.
- **Scalability**: Optimize database queries (e.g., use indexes in PostgreSQL), add caching (Redis), and support microservices to handle high transaction volumes.
- **Integrations**: Connect to oracles (e.g., Chainlink) for external data and regulatory APIs (e.g., SEC filings).
- `blockchain/evm/src/PermissionedToken.sol`: Updated to use `ICompliance.canTransfer` instead of direct registry checks. Constructor now takes compliance module address.
- `blockchain/evm/script/Deploy.s.sol`: Deploys compliance module and wires it to the token.
- `blockchain/evm/test/PermissionedToken.t.sol`: Updated for new error types and added claim-based compliance tests.

### Backward Compatibility

- Existing `addIdentity` and `revokeIdentity` continue to work.
- Verified status still allows transfers.
- Demo scripts and backend integration unchanged.
- New claim system is additive.

### Roadmap Alignment vs. Full ERC-3643

**Implemented in Phase 6:**
- Basic claims for identity attributes.
- Modular compliance checks.

**Not Yet Implemented (Future Phases):**
- Dedicated Claim Issuer contracts separate from registry owner.
- On-chain compliance rules beyond identity verification.
- Full T-REX module ecosystem (supply control, transfer manager, etc.).
- ERC-3643 interface compliance and standardization.
