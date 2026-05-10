# RWA Tokenized Compliance System

GitHub repository: <https://github.com/andreilopes11/rwa-tokenized-compliance-system.git>

## Overview

This project is a runnable local MVP for regulated real-world asset tokenization. Investor eligibility is evaluated off-chain in a Java/Spring Boot compliance service, asset offerings and fund lifecycle requests are persisted as production-style records, and a Solidity identity registry plus permissioned ERC-20 token enforce ownership and transfer rules on a local EVM chain.

The boundary is deliberate: raw identity documents never go on-chain. The backend hashes a document reference, stores a pending KYC request, keeps configurable investor profile and asset rule inputs off-chain, and submits only the identity hash to the registry after admin approval. The token contract blocks transfers unless both sender and receiver are approved.

Backend state is durable in the local profile through an H2 database running in PostgreSQL compatibility mode, with schema managed by Flyway. Hosted deployments should use PostgreSQL through the database environment variables.

## Architecture

- `blockchain/evm` - Foundry contracts, deployment script, and security tests.
- `backend/compliance-service` - Spring Boot API for KYC simulation, asset offerings, subscription/redemption lifecycle, document hashing, admin approval, and Web3j transaction submission.
- `frontend/investor-dashboard` - Next.js and Wagmi dashboards for investor onboarding, asset discovery, subscription/redemption requests, and admin operations.
- `infra/oracle-simulation` - notes for the trusted admin signer boundary.
- `scripts` - local tooling, setup, and demo orchestration.
- `tests/e2e` - cross-layer manual acceptance flow.

Architecture references:

- [Architecture](_docs/architecture.md)
- [Rules and Definitions](_docs/rules-and-definitions.md)
- [Security](_docs/security.md)
- [Diagrams](_docs/diagrams.md)
- [Production Feature Roadmap](_docs/production-feature-roadmap.md)
- [ADR-001: Core Architecture](_docs/adr/ADR-001-core-architecture.md)
- [Career and Deployment Approach](_docs/approach-career-projects.md)

## Prerequisites

- Node.js 24.15.0+ and npm 11.13.0+.
- Java 21.
- Maven 3.6.3+.
- Foundry, including `forge` and `anvil`.
- Optional Sepolia deployment accounts: Alchemy or Infura RPC URL, Sepolia ETH, and Etherscan API key.

Check the current shell:

```bash
scripts/check-tooling.sh
```

Install Foundry with the official installer:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

## Setup

Install project dependencies:

```bash
scripts/setup-deps.sh
```

Copy env examples when running services manually:

```bash
cp .env.example .env
cp backend/compliance-service/.env.example backend/compliance-service/.env
cp frontend/investor-dashboard/.env.example frontend/investor-dashboard/.env.local
```

## Local Execution Sequence

Use this sequence for a clean local run:

1. Verify the required tools:

   ```bash
   scripts/check-tooling.sh
   ```

2. Install locked dependencies:

   ```bash
   scripts/setup-deps.sh
   ```

3. Start the full local demo:

   ```bash
   scripts/demo-local.sh
   ```

4. Open the dashboard:

   ```text
   http://localhost:3000
   ```

The demo script loads these files when they exist, without printing secret values:

- `.env`
- `backend/compliance-service/.env`
- `frontend/investor-dashboard/.env.local`

After deployment, the script uses the freshly deployed contract addresses from `blockchain/evm/deployments/31337.json` as the highest-priority values for the backend and frontend.

For local Anvil deployment, `scripts/demo-local.sh` uses `LOCAL_PRIVATE_KEY` when it is set. If it is not set, it uses Anvil's first default funded private key. The script starts Anvil, then funds the deployer through the local `anvil_setBalance` RPC method, which prevents a Sepolia or real wallet `PRIVATE_KEY` in `.env` from being used accidentally on the local chain.

## Local Demo

The fastest path is:

```bash
scripts/demo-local.sh
```

That script starts Anvil, deploys contracts, starts the Spring Boot API, and starts the Next.js dashboard at `http://localhost:3000`.
The admin dashboard is available at `http://localhost:3000/admin`; use `local-admin-token` unless you override `ADMIN_API_TOKEN`.

Default local ports:

- Anvil RPC: `http://127.0.0.1:8545`
- Spring Boot API: `http://localhost:8080`
- Next.js dashboard: `http://localhost:3000`

## Manual Local Run

Use this fallback when you want each layer in a separate terminal.

Terminal 1 - local EVM:

```bash
export LOCAL_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
anvil --host 127.0.0.1 --port 8545 --chain-id 31337
```

Terminal 2 - deploy contracts:

```bash
cd blockchain/evm
export RPC_URL=http://127.0.0.1:8545
export CHAIN_ID=31337
export LOCAL_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
export LOCAL_DEPLOYER_ADDRESS="$(cast wallet address --private-key "$LOCAL_PRIVATE_KEY")"
cast rpc anvil_setBalance "$LOCAL_DEPLOYER_ADDRESS" 0x21e19e0c9bab2400000 --rpc-url "$RPC_URL"
mkdir -p deployments
PRIVATE_KEY="$LOCAL_PRIVATE_KEY" forge script script/Deploy.s.sol:Deploy --rpc-url "$RPC_URL" --broadcast
```

Read `blockchain/evm/deployments/31337.json` and export the contract addresses:

```bash
export IDENTITY_REGISTRY_ADDRESS=0x...
export TOKEN_ADDRESS=0x...
export ADMIN_PRIVATE_KEY=$LOCAL_PRIVATE_KEY  # local demo only; never store a production key in .env
```

Terminal 3 - backend:

```bash
cd backend/compliance-service
export RPC_URL=http://127.0.0.1:8545
export CHAIN_ID=31337
export ADMIN_API_TOKEN=local-admin-token
export ADMIN_PRIVATE_KEY=0x...
export IDENTITY_REGISTRY_ADDRESS=0x...
export TOKEN_ADDRESS=0x...
mvn spring-boot:run
```

Terminal 4 - frontend:

```bash
cd frontend/investor-dashboard
export BACKEND_API_BASE_URL=http://localhost:8080
export NEXT_PUBLIC_API_BASE_URL=/api/backend
export AUTH_MFA_CODE=123456
export NEXT_PUBLIC_CHAIN_ID=31337
export NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
export NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=0x...
export NEXT_PUBLIC_TOKEN_ADDRESS=0x...
npm run dev
```

Then open `http://localhost:3000`, connect a browser wallet, and submit a document reference. Open `http://localhost:3000/admin`, enter `local-admin-token`, approve the pending request, then return to the investor dashboard and refresh status.
The investor dashboard also shows the seeded demo offering and supports subscription and redemption requests. The admin dashboard can create additional draft offerings, approve lifecycle queues, and maintain investor compliance profiles plus per-asset eligibility rules.

### Older Manual Flow

1. Start Anvil:

   ```bash
   export LOCAL_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   anvil --host 127.0.0.1 --port 8545 --chain-id 31337
   ```

2. Deploy contracts:

   ```bash
   cd blockchain/evm
   export LOCAL_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   export LOCAL_DEPLOYER_ADDRESS="$(cast wallet address --private-key "$LOCAL_PRIVATE_KEY")"
   cast rpc anvil_setBalance "$LOCAL_DEPLOYER_ADDRESS" 0x21e19e0c9bab2400000 --rpc-url http://127.0.0.1:8545
   PRIVATE_KEY="$LOCAL_PRIVATE_KEY" forge script script/Deploy.s.sol:Deploy --rpc-url http://127.0.0.1:8545 --broadcast
   ```

3. Read `blockchain/evm/deployments/31337.json` and export the contract addresses:

   ```bash
   export IDENTITY_REGISTRY_ADDRESS=0x...
   export TOKEN_ADDRESS=0x...
   export RPC_URL=http://127.0.0.1:8545
   export CHAIN_ID=31337
   export ADMIN_API_TOKEN=local-admin-token
   export ADMIN_PRIVATE_KEY=$LOCAL_PRIVATE_KEY
   ```

4. Start the backend:

   ```bash
   cd backend/compliance-service
   mvn spring-boot:run
   ```

5. Start the frontend:

   ```bash
   cd frontend/investor-dashboard
   export BACKEND_API_BASE_URL=http://localhost:8080
   export NEXT_PUBLIC_API_BASE_URL=/api/backend
   export AUTH_MFA_CODE=123456
   export NEXT_PUBLIC_CHAIN_ID=31337
   export NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=$IDENTITY_REGISTRY_ADDRESS
   export NEXT_PUBLIC_TOKEN_ADDRESS=$TOKEN_ADDRESS
   npm run dev
   ```

6. Open `http://localhost:3000`, connect a browser wallet, and submit a document reference.
7. Open `http://localhost:3000/admin`, enter `local-admin-token`, approve the pending KYC request, and confirm the investor dashboard shows approved status after refresh.
8. Confirm the investor dashboard shows `Lisbon Real Estate Income Fund`; request a subscription, approve it from `/admin`, then refresh the investor dashboard to see the position balance. Redemption approvals record simulated settlement and update the persisted position.
9. In `/admin`, open the compliance rules panel to adjust investor type, jurisdiction, accreditation/qualified flags, lockup days, or max position amount for lifecycle eligibility tests.

## Local Troubleshooting

If `scripts/demo-local.sh` stops at preflight, fix the missing tools first. The script does not start Anvil, deploy contracts, or launch services until `scripts/check-tooling.sh` passes.

| Console output                                                               | Cause                                                                                                                                                                                                                           | Fix                                                                                                                                                                                                                                |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `miss java`                                                                  | Java is not installed or not on `PATH`.                                                                                                                                                                                         | Install Java 21 and run `java --version`.                                                                                                                                                                                          |
| `mvn ... JAVA_HOME environment variable is not defined correctly`            | Maven exists, but `JAVA_HOME` does not point to a valid JDK.                                                                                                                                                                    | Set `JAVA_HOME` to your Java 21 JDK path and reload the shell.                                                                                                                                                                     |
| `miss forge`                                                                 | Foundry `forge` is not installed or not on `PATH`.                                                                                                                                                                              | Install Foundry and run `foundryup`.                                                                                                                                                                                               |
| `miss anvil`                                                                 | Foundry `anvil` is not installed or not on `PATH`.                                                                                                                                                                              | Install Foundry and make sure `~/.foundry/bin` is on `PATH`.                                                                                                                                                                       |
| `Cannot find module ... deployments/31337.json`                              | Contract deployment did not complete.                                                                                                                                                                                           | Confirm Anvil is running and `forge script ... --broadcast` completed.                                                                                                                                                             |
| `Cannot find module '/d/.../deployments/31337.json'` after successful deploy | Git Bash is calling Windows Node with a Unix-style absolute path.                                                                                                                                                               | Use the current `scripts/demo-local.sh`, which reads the deployment file through a relative path inside `blockchain/evm`.                                                                                                          |
| `Missing field in deployments/31337.json: identityRegistry`                  | The deployment JSON was generated by an older `Deploy.s.sol` serialization bug.                                                                                                                                                 | Use the current `blockchain/evm/script/Deploy.s.sol`, delete the stale `blockchain/evm/deployments/31337.json` if needed, and rerun `scripts/demo-local.sh`.                                                                       |
| `Insufficient funds for gas * price + value`                                 | The deploy private key is not funded on the chain you are sending to. This usually happens when a Sepolia or real wallet `PRIVATE_KEY` is used against local Anvil, or when an old Anvil process is still running on port 8545. | Stop the old Anvil process and use `scripts/demo-local.sh`. For a manual run, fund the deployer with `cast rpc anvil_setBalance "$LOCAL_DEPLOYER_ADDRESS" 0x21e19e0c9bab2400000 --rpc-url http://127.0.0.1:8545` before deploying. |
| Backend cannot connect to chain                                              | Anvil is not running or `RPC_URL` points elsewhere.                                                                                                                                                                             | Confirm `RPC_URL=http://127.0.0.1:8545` and Anvil is alive.                                                                                                                                                                        |
| Frontend cannot reach API                                                    | Spring Boot is not running on port `8080`.                                                                                                                                                                                      | Confirm the backend is running at `http://localhost:8080/actuator/health`.                                                                                                                                                         |

For local MetaMask testing, add a custom network with RPC `http://127.0.0.1:8545` and chain ID `31337`, then import the local Anvil private key from `LOCAL_PRIVATE_KEY`. Do not use a mainnet-funded wallet for the local demo. If you want to use your own MetaMask test account on Anvil, set `LOCAL_PRIVATE_KEY` to that account only in your local, ignored `.env`; `scripts/demo-local.sh` will fund it on the local chain when Anvil starts.

Useful install commands for Ubuntu or WSL:

```bash
# Java/Maven, if available in your package sources
sudo apt update
sudo apt install -y openjdk-21-jdk maven

# Adjust the path if your JDK directory differs
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"

# Foundry
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup
```

## Sepolia Portfolio Demo

The docs describe a public portfolio path where the same compliance architecture runs against Sepolia, with the backend hosted on Render or Elastic Beanstalk and the frontend hosted on Vercel. Do not commit private keys or provider API keys; configure them only as environment variables in the hosting dashboards.

1. Fund the admin wallet with Sepolia ETH from a faucet.

2. Deploy and optionally verify contracts:

   ```bash
   cd blockchain/evm
   export PRIVATE_KEY=0x...
   export SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   export ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
   ../../scripts/deploy-sepolia.sh
   ```

3. Copy addresses from `blockchain/evm/deployments/11155111.json`.

4. Configure the backend hosting service:

   ```bash
   RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   CHAIN_ID=11155111
   ADMIN_PRIVATE_KEY=0x...
   IDENTITY_REGISTRY_ADDRESS=0x...
   TOKEN_ADDRESS=0x...
   CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   ```

5. Configure Vercel:

   ```bash
   BACKEND_API_BASE_URL=https://your-render-service.onrender.com
   NEXT_PUBLIC_API_BASE_URL=/api/backend
   AUTH_MFA_CODE=123456
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   NEXT_PUBLIC_CHAIN_ID=11155111
   NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   NEXT_PUBLIC_BLOCK_EXPLORER_URL=https://sepolia.etherscan.io
   NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=0x...
   NEXT_PUBLIC_TOKEN_ADDRESS=0x...
   ```

6. Open the Vercel URL, connect a Sepolia wallet, submit a document reference, approve it from `/admin`, and confirm the dashboard shows Etherscan links for the approval transaction and deployed contracts.

## Portfolio MVP Notes

- The public landing page lives at `/`, with authenticated investor access on `/dashboard` and admin access on `/admin`.
- Next.js proxies authenticated browser requests through `/api/backend/**`; the browser no longer needs to call the Spring Boot host directly.
- `AUTH_MFA_CODE` defaults to `123456` for local portfolio mode unless overridden.
- Google provider options only appear when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are configured.

## API

Submit a KYC request:

```http
POST /api/kyc/requests
Content-Type: application/json

{
  "walletAddress": "0x1111111111111111111111111111111111111111",
  "documentReference": "passport://case-123"
}
```

Approve a KYC request as admin:

```http
POST /api/admin/kyc/requests/{requestId}/approve
X-Admin-Token: local-admin-token
```

Reject a KYC request as admin:

```http
POST /api/admin/kyc/requests/{requestId}/reject
X-Admin-Token: local-admin-token
Content-Type: application/json

{
  "reason": "Missing issuer approval."
}
```

List the admin KYC queue:

```http
GET /api/admin/kyc/requests?status=PENDING&limit=25
X-Admin-Token: local-admin-token
```

Read admin audit events:

```http
GET /api/admin/audit-events?limit=25
X-Admin-Token: local-admin-token
```

Read or update an investor compliance profile as admin:

```http
GET /api/admin/investors/{walletAddress}/compliance-profile
X-Admin-Token: local-admin-token
```

```http
POST /api/admin/investors/{walletAddress}/compliance-profile
X-Admin-Token: local-admin-token
Content-Type: application/json

{
  "investorType": "ACCREDITED",
  "jurisdiction": "US",
  "accredited": true,
  "qualifiedInvestor": false,
  "revoked": false
}
```

Read or update asset compliance rules as admin:

```http
GET /api/admin/assets/{assetId}/compliance-rules
X-Admin-Token: local-admin-token
```

```http
POST /api/admin/assets/{assetId}/compliance-rules
X-Admin-Token: local-admin-token
Content-Type: application/json

{
  "allowedInvestorTypes": ["ACCREDITED", "INSTITUTIONAL"],
  "allowedJurisdictions": ["US", "PT"],
  "requiresAccreditation": true,
  "requiresQualifiedInvestor": false,
  "lockupDays": 90,
  "maxPositionAmount": 250
}
```

List public asset offerings:

```http
GET /api/assets?status=ACTIVE&limit=25
```

Read one asset offering:

```http
GET /api/assets/{assetId}
```

Create a subscription request:

```http
POST /api/assets/{assetId}/subscriptions
Content-Type: application/json

{
  "walletAddress": "0x1111111111111111111111111111111111111111",
  "amount": 25
}
```

Approve or reject a subscription as admin:

```http
GET /api/admin/subscriptions?status=PENDING&limit=25
X-Admin-Token: local-admin-token
```

```http
POST /api/admin/subscriptions/{subscriptionId}/approve
X-Admin-Token: local-admin-token
Content-Type: application/json

{
  "reason": "Issuer allocation approved."
}
```

```http
POST /api/admin/subscriptions/{subscriptionId}/reject
X-Admin-Token: local-admin-token
Content-Type: application/json

{
  "reason": "Allocation window closed."
}
```

Create a redemption request:

```http
POST /api/assets/{assetId}/redemptions
Content-Type: application/json

{
  "walletAddress": "0x1111111111111111111111111111111111111111",
  "amount": 5
}
```

Approve or reject a redemption as admin:

```http
GET /api/admin/redemptions?status=PENDING&limit=25
X-Admin-Token: local-admin-token
```

```http
POST /api/admin/redemptions/{redemptionId}/approve
X-Admin-Token: local-admin-token
Content-Type: application/json

{
  "reason": "Redemption approved with simulated off-chain settlement."
}
```

```http
POST /api/admin/redemptions/{redemptionId}/reject
X-Admin-Token: local-admin-token
Content-Type: application/json

{
  "reason": "Settlement window closed."
}
```

Create an asset offering as admin:

```http
POST /api/admin/assets
X-Admin-Token: local-admin-token
Content-Type: application/json

{
  "name": "Tokenized Treasury Fund",
  "symbol": "TTF",
  "assetType": "TREASURY_FUND",
  "jurisdiction": "US",
  "status": "DRAFT",
  "supplyCap": 500000,
  "navPrice": 100,
  "issuerName": "Demo RWA Issuer",
  "issuerMetadata": "Simulated treasury fund share class.",
  "tokenAddress": "0x0000000000000000000000000000000000000000"
}
```

Read request status:

```http
GET /api/kyc/requests/{requestId}
```

Read investor status:

```http
GET /api/investors/{walletAddress}/status
```

Read investor positions:

```http
GET /api/investors/{walletAddress}/positions
```

Revoke investor eligibility:

```http
POST /api/admin/identities/{walletAddress}/revoke
X-Admin-Token: local-admin-token
```

Pause token transfers for an asset:

```http
POST /api/admin/assets/{assetId}/pause
X-Admin-Token: local-admin-token
```

Resume token transfers for an asset:

```http
POST /api/admin/assets/{assetId}/unpause
X-Admin-Token: local-admin-token
```

Query current asset pause status:

```http
GET /api/admin/assets/{assetId}/pause
X-Admin-Token: local-admin-token
```

## Tests

Contracts:

```bash
cd blockchain/evm
npm install --legacy-peer-deps
forge test -vvv
```

Backend:

```bash
cd backend/compliance-service
mvn test
```

Frontend:

```bash
cd frontend/investor-dashboard
npm install --legacy-peer-deps
npm test
npm run build
```

## Security Notes

- The local admin key is the first default Anvil key and is unsafe outside local demos.
- The backend stores only document hashes, request metadata, audit events, and blockchain transaction records.
- Asset offerings, share-class schema, position snapshots, subscriptions, and redemptions are persisted for the production fund lifecycle.
- Approved subscriptions mint on-chain; approved redemptions record simulated off-chain settlement and update persisted positions without burning in the Phase 4 baseline.
- Configurable compliance profiles and asset rules are stored off-chain; lifecycle denials return operational reasons without exposing raw KYC details.
- Admin endpoints require `X-Admin-Token`; `local-admin-token` is for local demos only.
- The token contract checks compliance before balance mutation for mint, transfer, transferFrom, and burn paths.
- Emergency pause blocks token movement while preserving balances.
- Rate limiting protects against abuse (10 requests per minute per IP).
- Structured logging captures operational events with file rotation.
- Prometheus metrics available at `/actuator/prometheus` for monitoring.
- Production hardening should replace the single admin signer with multisig, KMS, or an audited oracle/governance path.
