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

## Production values (current)

| Variable | Value |
|----------|--------|
| `BACKEND_API_BASE_URL` | `http://rwatokenizedcomplianceapi-env.eba-ddsh8y8v.eu-north-1.elasticbeanstalk.com` |
| `NEXT_PUBLIC_CHAIN_ID` | `11155111` |
| `NEXT_PUBLIC_RPC_URL` | `https://eth-sepolia.g.alchemy.com/v2/<KEY>` |
| `NEXT_PUBLIC_BLOCK_EXPLORER_URL` | `https://sepolia.etherscan.io` |
| `NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS` | `0xDf47E753589f6f4337999DC72bF0530301AEDe5b` |
| `NEXT_PUBLIC_TOKEN_ADDRESS` | `0xC85bB59cbaffE561BC5A490BEeb37eC9Fb8c92b0` |

Redeploy after changing any `NEXT_PUBLIC_*` variable. Chain reference: `../rwa-tokenized-compliance-system-blockchain/config/sepolia-addresses.json`

## Environment variables

Set in Vercel **Project → Settings → Environment Variables** for Production (and Preview as needed).

| Variable | Required | Notes |
|----------|----------|--------|
| `BACKEND_API_BASE_URL` | yes | EB origin above |
| `NEXT_PUBLIC_API_BASE_URL` | no | default `/api/backend` |
| `NEXT_PUBLIC_CHAIN_ID` | yes (prod) | `11155111` |
| `NEXT_PUBLIC_RPC_URL` | yes (prod) | Sepolia HTTPS RPC |
| `NEXT_PUBLIC_BLOCK_EXPLORER_URL` | recommended | `https://sepolia.etherscan.io` |
| `NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS` | yes (prod) | see table above |
| `NEXT_PUBLIC_TOKEN_ADDRESS` | yes (prod) | see table above |
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
