# RWA Compliance Frontend

Frontend MVP built with Next.js for the RWA compliance experience: public landing, demo authentication, investor dashboard, admin dashboard, and a server-side proxy for the backend API.

This repository is intentionally frontend-first. Documentation under `/_docs/**` was left untouched.

## Stack

- Next.js App Router
- React 19
- TypeScript
- Wagmi + Viem
- TanStack Query
- Vitest + Testing Library

## Project Structure

```text
src/
  app/                 Next.js routes, layout, API handlers
  features/
    admin/             Admin dashboard UI + API client
    assets/            Asset API client
    auth/              Login, registration, validators, session helpers
    investor/          Investor dashboard UI + API client
    landing/           Public landing page
  shared/
    api/               Shared HTTP helpers and shared API tests
    config/            App-level constants
    lib/               Shared copy, formatting, and web3 configuration
    providers/         Global React providers
    ui/                Reusable UI primitives
  test/                Vitest setup
scripts/
  bootstrap-local.sh   Single local bootstrap entrypoint
  stop-local.sh        Stops the managed Anvil process
```

## Main Routes

- `/` public landing page
- `/login` demo sign-in
- `/register` demo sign-up
- `/dashboard` investor workspace
- `/admin` admin workspace

## Requirements

- Node.js `20.9.0+`
- npm `10+`
- Foundry with `forge`, `cast`, and `anvil`
- A backend API running locally or reachable through `BACKEND_API_BASE_URL`

If this frontend repo does not contain the Foundry contracts you want to deploy, point the bootstrap script at a separate Foundry workspace with `CONTRACTS_WORKSPACE`.

## Environment

Create the local env file:

```bash
cp .env.example .env.local
```

Important variables:

```bash
CONTRACTS_WORKSPACE=
FOUNDRY_DEPLOY_SCRIPT=script/deploy/DeployCore.s.sol:DeployCore
LOCAL_RPC_URL=http://127.0.0.1:8545
LOCAL_CHAIN_ID=31337
LOCAL_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
LOCAL_FRONTEND_PORT=3000
LOCAL_BACKEND_ENV_FILE=.local-runtime/backend-consumer.env

BACKEND_API_BASE_URL=http://localhost:8080
ADMIN_API_TOKEN=local-admin-token
AUTH_MFA_CODE=123456
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

NEXT_PUBLIC_API_BASE_URL=/api/backend
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_BLOCK_EXPLORER_URL=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_TOKEN_ADDRESS=0x0000000000000000000000000000000000000000
```

Notes:

- `CONTRACTS_WORKSPACE` is optional when contract addresses are already known and set in `.env.local`.
- Relative paths in `CONTRACTS_WORKSPACE` and `LOCAL_BACKEND_ENV_FILE` are resolved from the repository root.
- `FOUNDRY_DEPLOY_SCRIPT` defaults to `script/deploy/DeployCore.s.sol:DeployCore`.
- In this combined workspace, the bootstrap script can also detect the sibling contracts repo at `../rwa-tokenized-compliance-system-blockchain`.
- The bootstrap script writes a managed block into `.env.local` with the resolved local chain and contract values.
- The bootstrap script also writes a backend-consumer env file, by default at `.local-runtime/backend-consumer.env`.

## Single Local Bootstrap

Run the full local bootstrap with one command:

```bash
npm run local:bootstrap
```

What it does:

1. Checks Node.js, npm, and Foundry tooling.
2. Creates `.env.local` from `.env.example` when missing.
3. Installs frontend dependencies when needed.
4. Starts or reuses a local Anvil chain.
5. Builds and deploys contracts from the detected Foundry workspace when available.
   If no Foundry workspace is detected, the script reuses `NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS` and `NEXT_PUBLIC_TOKEN_ADDRESS` from `.env.local`.
6. Writes resolved contract addresses into `.env.local`.
7. Writes a backend-consumer env file with local chain values.
8. Starts the frontend locally.

After a successful run:

- Frontend: `http://localhost:3000` by default
- Backend consumer env: `.local-runtime/backend-consumer.env`
- Anvil log: `.local-runtime/anvil.log`
- Deploy log: `.local-runtime/deploy.log`

Stop the managed Anvil process:

```bash
npm run local:stop
```

## Frontend-Only Development

If you already have deployed contracts and only want to run the frontend:

1. Set `NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS` and `NEXT_PUBLIC_TOKEN_ADDRESS` in `.env.local`.
2. Keep `BACKEND_API_BASE_URL` pointed at your backend.
3. Run:

```bash
npm run dev
```

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run local:bootstrap
npm run local:stop
```

## Testing

The test suite covers:

- shared API helpers and clients
- investor dashboard behavior
- admin dashboard behavior

Run:

```bash
npm run test
```

## Repository Cleanup

- removed unused legacy OAuth, 2FA, and enhanced KYC components
- replaced the bilingual UI layer with a single English content source
- split the old monolithic API module into focused clients
- moved the codebase to a feature-based frontend structure
- restored a minimal scripts layer centered on one local bootstrap entrypoint
