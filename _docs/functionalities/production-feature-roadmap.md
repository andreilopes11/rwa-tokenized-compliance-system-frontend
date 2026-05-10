# Production Feature Roadmap

GitHub repository: <https://github.com/andreilopes11/rwa-tokenized-compliance-system.git>

## Practical Functioning and Real-World Usage

This project is a compliance system for tokenized RWAs (Real World Assets), such as real estate, securities, or commodities, integrating blockchain (Ethereum/EVM) with a Java Spring Boot backend and Next.js frontend. In practice, it ensures regulatory compliance in token issuances and transactions, automatically verifying identities, permissions, and compliance rules via smart contracts. In the real world, it would be used by financial institutions, investment funds, or DeFi platforms to issue and manage tokenized assets, reducing legal and operational risks in regulated markets (e.g., SEC in the US or equivalents elsewhere).

## Real-World Usage Examples

- **Real Estate Token Issuance**: An investment fund tokenizes commercial properties. The system verifies if investors are qualified (KYC/AML via IdentityRegistry), applies compliance rules (e.g., investment limits per person), and records transactions on the blockchain for auditing.
- **Fund Subscription and Redemption**: Investors register in the dashboard, subscribe to asset tokens (e.g., corporate debt securities), and the system validates compliance in real-time. For redemptions, it verifies configurable rules (e.g., lock-up periods) before releasing funds.
- **Administrative Management**: Admins use the dashboard to configure compliance rules, monitor transactions, and generate reports. In crisis scenarios (e.g., market volatility), the system automatically pauses transactions if rules are violated.
- **Exchange Integration**: Crypto or banking exchanges integrate the module to validate cross-chain transactions, ensuring RWA tokens comply with local regulations.

## What Needs to Be Improved

Based on the current structure (Spring Boot backend, Next.js frontend, Solidity blockchain), here are improvement suggestions, focusing on the mentioned aspects:

- **Landing Page**: Add interactive sections (explanatory videos about RWAs), clear CTAs for registration, and analytics integration (e.g., Google Analytics) to track conversions. Improve responsive design and SEO to attract institutional investors.
- **Registration and Login**: Implement multi-factor authentication (2FA) and OAuth integration with providers (e.g., Google, MetaMask). Add more robust KYC verification (e.g., integration with services like Onfido) and simplified onboarding flows to reduce abandonment.
- **Financial**: Expand functionalities like automatic transaction fee calculation, integration with external wallets (e.g., MetaMask, Coinbase Wallet), and real-time financial dashboards with charts (using libraries like Chart.js). Add support for multiple currencies and automatic tax compliance.
- **General Aspects**:
  - **Security**: Audit smart contracts for vulnerabilities (e.g., reentrancy), add rate limiting in the backend, and implement detailed logs for auditing.
  - **Usability**: Improve dashboard UX with push notifications, interactive tutorials, and multi-language support.
  - **Scalability**: Optimize database queries (e.g., use indexes in PostgreSQL), add caching (Redis), and support microservices for handling high transaction volumes.
  - **Integrations**: Connect to oracles (e.g., Chainlink) for external data and regulatory APIs (e.g., SEC filings).
  - **Testing and Documentation**: Expand test coverage (current 70-80% estimated), add API documentation (Swagger), and deployment guides for production.
- Current approval/revocation demo remains backward compatible.
- Docs clearly distinguish implemented behavior from roadmap alignment.

Implemented baseline files:

- `blockchain/evm/src/IdentityRegistry.sol` (extended with claims)
- `blockchain/evm/src/ComplianceModule.sol` (new modular compliance)
- `blockchain/evm/src/PermissionedToken.sol` (updated for modular compliance)
- `blockchain/evm/script/Deploy.s.sol` (updated deployment)
- `blockchain/evm/test/PermissionedToken.t.sol` (updated and extended tests)

### Phase 7: Production Hardening

Prepare the platform for public testnet and later real regulated pilots.

Implementation status: partial production-hardening baseline implemented in the codebase. The backend now includes CORS allowlists, admin-token protection for local admin routes, API rate limiting, request IDs in responses and logs, blockchain health checks, audit records for emergency pause/unpause, and incident-response documentation. Real production custody, multisig ownership, RBAC, alerting, and hosted Sepolia smoke evidence remain open before any real-money pilot.

Key work:

- Move contract ownership to multisig.
- Replace direct private-key env usage with KMS, Vault, HSM, or managed custody signer.
- Add structured logging, request IDs, metrics, alerts, and operational dashboards.
- Add rate limits, CORS allowlists, admin authentication, and authorization.
- Add blockchain RPC connectivity health checks alongside database health.
- Add incident playbooks for pause, revoke, signer compromise, failed chain tx, and backend outage.
- Add deployment docs for Sepolia, Render or AWS, Vercel, secret management, and contract verification.

Acceptance criteria:

- No production private key is stored in `.env`.
- Admin routes require authentication and authorization.
- Health checks report database and blockchain connectivity.
- Incident pause and recovery process is documented and tested.

Implemented baseline files:

- `backend/compliance-service/src/main/java/com/rwa/compliance/health/BlockchainHealthIndicator.java`
- `backend/compliance-service/src/main/resources/logback-spring.xml`
- `backend/compliance-service/src/main/java/com/rwa/compliance/config/RateLimitInterceptor.java`
- `backend/compliance-service/src/main/java/com/rwa/compliance/config/RequestIdFilter.java`
- `backend/compliance-service/.env.example` (local demo private key placeholder)
- `_docs/security.md` (production hardening guidance)
- `_docs/incident-response-playbook.md` (incident response procedures)
- `README.md` (local demo documentation updates)

Remaining production blockers:

- Transfer contract ownership and privileged backend actions to multisig or a governed signer.
- Replace direct `ADMIN_PRIVATE_KEY` usage with KMS, Vault, HSM, or managed custody for hosted environments.
- Replace the local `X-Admin-Token` control with user authentication, role-based authorization, session management, and operator accountability.
- Add hosted alerting dashboards, log aggregation, retry/confirmation workers for chain transactions, and Sepolia smoke-test evidence.
- Complete deployment artifacts for Render/AWS, Vercel, secret management, and contract verification links.

## Public Interfaces

Existing API routes must remain stable:

- `POST /api/kyc/requests`
- `GET /api/kyc/requests/{requestId}`
- `GET /api/investors/{walletAddress}/status`
- `POST /api/admin/identities/{walletAddress}/revoke`

New production routes should be additive and version-compatible:

- `GET /api/admin/kyc/requests`
- `POST /api/admin/kyc/requests/{requestId}/approve`
- `POST /api/admin/kyc/requests/{requestId}/reject`
- `GET /api/admin/audit-events`
- `GET /api/assets`
- `POST /api/admin/assets`
- `GET /api/assets/{assetId}`
- `POST /api/assets/{assetId}/subscriptions`
- `GET /api/admin/subscriptions`
- `POST /api/admin/subscriptions/{subscriptionId}/approve`
- `POST /api/admin/subscriptions/{subscriptionId}/reject`
- `POST /api/assets/{assetId}/redemptions`
- `GET /api/admin/redemptions`
- `POST /api/admin/redemptions/{redemptionId}/approve`
- `POST /api/admin/redemptions/{redemptionId}/reject`
- `POST /api/admin/assets/{assetId}/pause`
- `POST /api/admin/assets/{assetId}/unpause`
- `GET /api/admin/assets/{assetId}/pause`
- `GET /api/investors/{walletAddress}/positions`
- `GET /api/admin/investors/{walletAddress}/compliance-profile`
- `POST /api/admin/investors/{walletAddress}/compliance-profile`
- `GET /api/admin/assets/{assetId}/compliance-rules`
- `POST /api/admin/assets/{assetId}/compliance-rules`

## Data Model Direction

Minimum production tables:

- `investors`: wallet address, status, eligibility metadata, created and updated timestamps.
- `kyc_requests`: request id, wallet address, document hash, status, rejection reason, approval tx, timestamps.
- `asset_offerings`: asset id, name, symbol, type, jurisdiction, status, supply cap, price or NAV, token address.
- `share_classes`: share class id, asset id, name, symbol, restrictions, supply cap.
- `positions`: investor id, asset id, share class id, balance snapshot, last chain sync.
- `subscriptions`: subscription id, investor id, asset id, amount, status, approval tx, timestamps.
- `redemptions`: redemption id, investor id, asset id, amount, status, approval tx, timestamps.
- `investor_compliance_profiles`: wallet address, investor type, jurisdiction, accreditation/qualified flags, revocation flag, timestamps.
- `asset_compliance_rules`: asset id, allowed investor types, allowed jurisdictions, accreditation/qualified requirements, lockup days, holding limit, timestamps.
- `audit_events`: actor, action, target, request id, metadata hash, timestamp.
- `blockchain_transactions`: chain id, tx hash, type, status, nonce, submitted at, confirmed at.

## Testing Strategy

Backend:

- Repository tests for PostgreSQL-backed KYC, investors, assets, subscriptions, redemptions, and audit logs.
- Rule engine tests for jurisdiction, investor type, holding limit, lockup, approval, and revocation.
- Admin authorization and rate-limit tests.

Contracts:

- Keep all current transfer restriction tests passing.
- Add tests for rule modules, claim checks, pause, subscription mint, redemption burn, and blocked transfers.

Frontend:

- Investor dashboard tests for offering discovery, subscription, redemption, and status states.
- Admin dashboard tests for approve, reject, revoke, and audit views.
- Error states for wrong network, rejected wallet action, failed transaction, backend unavailable, and pending confirmation.

Production:

- Sepolia smoke test.
- Backend health check for database and chain connectivity.
- Frontend build with hosted env variables.
- Secret scan and log review confirming no raw documents or private keys are exposed.

## Assumptions

- This roadmap is production-readiness guidance, not legal advice.
- The first production-style asset remains simulated and not a real regulated security.
- Real KYC/AML provider integration will be added through an adapter behind the compliance service.
- PostgreSQL is the default production persistence layer.
- Multisig and KMS/Vault-backed signing are mandatory before real-money deployment.
- The local Anvil demo must keep working throughout all phases.
