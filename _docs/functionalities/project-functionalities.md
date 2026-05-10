# Project Functionalities

## Portfolio MVP Status

The current repository is being consolidated around a single public portfolio MVP flow:

- Landing page at `/`
- Auth-gated investor dashboard at `/dashboard`
- Auth-gated admin dashboard at `/admin`
- Next.js session and proxy routes for authenticated frontend access
- Spring Boot mock/adaptable integrations for fees, KYC enhancements, notifications, tutorials, financial summaries, regulatory/oracle feeds, and blockchain monitoring

This means the "necessary functionalities" section below should now be read as the checklist for the implementation baseline in this repository, not as a separate future product track.

This document outlines all existing and necessary functionalities in the RWA Tokenized Compliance System project to achieve the current and improved MVP version. The system integrates blockchain (Ethereum/EVM) with a Java Spring Boot backend and Next.js frontend to ensure regulatory compliance for tokenized real-world assets (RWAs) like real estate, securities, or commodities.

## Existing Functionalities

### Core Compliance and Identity Management
- **Investor Onboarding**: Wallet connection and KYC/AML simulation via Spring Boot service.
- **Identity Approval/Revocation**: On-chain identity management using IdentityRegistry smart contract. Admins can approve, reject, or revoke identities.
- **Document Handling**: Secure hashing of KYC documents without storing raw data on-chain or in logs.
- **Audit Logging**: Immutable records for all KYC, identity, subscription, redemption, and admin actions.

### Token and Transfer Management
- **Permissioned Token Transfers**: ERC-20-style token with enforced compliance checks. Transfers are blocked for unapproved or revoked identities.
- **On-Chain Enforcement**: Smart contracts ensure compliance decisions are auditable and transfers are restricted based on identity registry.
- **Emergency Controls**: Pause/resume functionality for token transfers in crisis scenarios.

### Admin and Operational Features
- **Admin Dashboard**: Separate UI for compliance operators to manage KYC queues, approve/reject requests, revoke identities, and view audit history.
- **Asset Offerings**: Persistence of asset details (name, symbol, type, jurisdiction, supply cap, NAV/price, issuer metadata, contract addresses).
- **Subscription and Redemption Lifecycle**: Investor requests for subscriptions/redemptions, admin approvals, on-chain minting for subscriptions, and simulated settlement for redemptions.
- **Compliance Rules Engine**: Configurable off-chain rules for investor eligibility (type, jurisdiction, accreditation, lockup periods, holding limits).
- **ERC-3643 Alignment**: Support for identity claims, modular compliance checks, and compatibility with security token standards.

### Backend and Persistence
- **PostgreSQL Persistence**: Durable storage for investors, KYC requests, assets, subscriptions, redemptions, audit events, and blockchain transactions.
- **Flyway Migrations**: Schema management for database versions.
- **REST APIs**: Stable endpoints for investor and admin interactions, protected by tokens where necessary.
- **Profile-Based Configuration**: Support for local (H2), Sepolia, and hosted (PostgreSQL) environments.

### Frontend and UI
- **Investor Dashboard**: Wallet connection, KYC status, asset discovery, subscription/redemption forms, positions, and transaction history.
- **Responsive Design**: Basic UI components for investor and admin workflows.

### Blockchain Integration
- **Smart Contracts**: Solidity contracts for IdentityRegistry, PermissionedToken, ComplianceModule, and emergency freeze controls.
- **Transaction Signing**: Simulation for approved actions, with plans for KMS/Vault-backed signing in production.
- **Event Indexing**: On-chain events for compliance and transfer outcomes.

## Necessary Functionalities for Improved Version

### Landing Page Enhancements
- Interactive sections with explanatory videos about RWAs.
- Clear call-to-action (CTA) buttons for registration.
- Integration with analytics tools (e.g., Google Analytics) for conversion tracking.
- Improved responsive design and SEO optimization to attract institutional investors.

### Registration and Login Improvements
- Multi-factor authentication (2FA) implementation.
- OAuth integration with providers like Google and MetaMask.
- Enhanced KYC verification using third-party services (e.g., Onfido).
- Streamlined onboarding flows to reduce user drop-off.

### Financial Features
- Automatic calculation of transaction fees.
- Integration with external wallets (e.g., MetaMask, Coinbase Wallet).
- Real-time financial dashboards with charts (using libraries like Chart.js).
- Support for multiple currencies.
- Automated tax compliance features.

### Security Enhancements
- Smart contract audits for vulnerabilities (e.g., reentrancy attacks).
- Rate limiting in the backend.
- Detailed logging for auditing purposes.
- Encryption and secure handling of sensitive data.

### Usability Improvements
- Push notifications in the dashboard.
- Interactive tutorials for new users.
- Multi-language support.
- Enhanced UX with better navigation and feedback.

### Scalability Optimizations
- Database query optimization (e.g., indexing in PostgreSQL).
- Caching layer (e.g., Redis) for performance.
- Microservices architecture support for handling high transaction volumes.
- Load balancing and horizontal scaling considerations.

### Integrations
- Connection to oracles (e.g., Chainlink) for external data feeds.
- Regulatory API integrations (e.g., SEC filings).
- Cross-chain validation for exchanges and DeFi platforms.

### Testing and Documentation
- Expanded test coverage (targeting 80-90% from current 70-80%).
- API documentation using Swagger/OpenAPI.
- Deployment guides for production environments.
- Comprehensive user and developer documentation.

## Real-World Usage Scenarios
- **Real Estate Token Issuance**: Tokenize commercial properties, verify investor qualifications, apply compliance rules, and record transactions on-chain.
- **Fund Subscription/Redemption**: Investors subscribe to tokenized assets (e.g., debt securities), with real-time compliance validation and configurable lock-up periods.
- **Administrative Management**: Admins configure rules, monitor transactions, generate reports, and auto-pause during market volatility.
- **Exchange Integration**: Validate cross-chain transactions for RWA tokens to ensure local regulatory compliance.

These functionalities ensure the system is production-ready, secure, scalable, and compliant for tokenized asset management in regulated markets.
