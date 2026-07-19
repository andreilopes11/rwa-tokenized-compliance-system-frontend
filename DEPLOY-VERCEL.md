# Deploy — Vercel (manual via GitHub PR)

Standalone Next.js App Router app. Browser calls same-origin BFF (`/api/backend`); the server reaches Elastic Beanstalk via `BACKEND_API_BASE_URL`.

## Project settings

| Setting | Value |
|---------|--------|
| Root Directory | `rwa-tokenized-compliance-system-frontend` (if monorepo) |
| Framework | Next.js |
| Node | 20.x |
| Build | `npm run build` |
| Install | `npm ci` or `npm install` |
| Output | Next default (no export) |

Flow: open PR → Vercel Preview → verify → merge to production branch.

## Environment variables

Set in Vercel **Project → Settings → Environment Variables** for Production (and Preview as needed).

| Variable | Required | Notes |
|----------|----------|--------|
| `BACKEND_API_BASE_URL` | yes | `https://<eb-host>` — no trailing slash required |
| `NEXT_PUBLIC_API_BASE_URL` | no | default `/api/backend` |
| `NEXT_PUBLIC_CHAIN_ID` | yes (prod) | `11155111` for Sepolia |
| `NEXT_PUBLIC_RPC_URL` | yes (prod) | public Sepolia HTTPS RPC |
| `NEXT_PUBLIC_BLOCK_EXPLORER_URL` | recommended | `https://sepolia.etherscan.io` |
| `NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS` | yes (prod) | from `deployments/11155111.json` |
| `NEXT_PUBLIC_TOKEN_ADDRESS` | yes (prod) | from deploy JSON |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | no | analytics |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | no | only if Google OAuth enabled |

Do **not** put JWT, MFA, admin passwords, or chain private keys in Vercel — those belong on Elastic Beanstalk only.

## Config modules

| File | Scope |
|------|--------|
| [`src/shared/config/publicRuntime.ts`](src/shared/config/publicRuntime.ts) | Client-safe (chain, contracts, API path) |
| [`src/shared/config/serverRuntime.ts`](src/shared/config/serverRuntime.ts) | Server-only (`BACKEND_API_BASE_URL`, Google) |
| [`src/shared/config/contracts.generated.ts`](src/shared/config/contracts.generated.ts) | Local Anvil addresses; **override with env on Vercel** |

A production build with `NEXT_PUBLIC_CHAIN_ID=31337` logs a warning — set Sepolia before go-live.

## Smoke after Preview/Production

1. Landing loads over HTTPS
2. Login/register reaches EB (no “Compliance API unavailable”)
3. Auth cookies are `Secure` + `HttpOnly`
4. Investor chain reads use Sepolia RPC (not `127.0.0.1:8545`)

## Related

- Backend EB: `../rwa-tokenized-compliance-system-backend/DEPLOY-EB.md`
- Chain: `../rwa-tokenized-compliance-system-blockchain/DEPLOY-SEPOLIA.md`
