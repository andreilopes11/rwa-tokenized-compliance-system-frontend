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

## Production values (current Sepolia)

| Variable | Value |
|----------|--------|
| `BACKEND_API_BASE_URL` | `https://<your-eb-host>` (**HTTPS required**) |
| `NEXT_PUBLIC_CHAIN_ID` | `11155111` |
| `NEXT_PUBLIC_RPC_URL` | `https://eth-sepolia.g.alchemy.com/v2/<KEY>` |
| `NEXT_PUBLIC_BLOCK_EXPLORER_URL` | `https://sepolia.etherscan.io` |
| `NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS` | `0xDf47E753589f6f4337999DC72bF0530301AEDe5b` |
| `NEXT_PUBLIC_TOKEN_ADDRESS` | `0xC85bB59cbaffE561BC5A490BEeb37eC9Fb8c92b0` |

Redeploy after changing any `NEXT_PUBLIC_*` variable. Chain reference: `../rwa-tokenized-compliance-system-blockchain/config/sepolia-addresses.json`

## Environment variables (complete)

Set in Vercel **Project → Settings → Environment Variables** for Production (and Preview as needed).

### Required

| Variable | Example | Notes |
|----------|---------|--------|
| `BACKEND_API_BASE_URL` | `https://rwatokenizedcomplianceapi-env….elasticbeanstalk.com` | EB **HTTPS** origin (no trailing slash). BFF server→server only. |
| `NEXT_PUBLIC_CHAIN_ID` | `11155111` | Sepolia. Production build warns if left at `11155111`. |
| `NEXT_PUBLIC_RPC_URL` | `https://eth-sepolia.g.alchemy.com/v2/<KEY>` | Browser wallet + read calls. Must be HTTPS public RPC. |
| `NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS` | `0xDf47…De5b` | Must match EB `IDENTITY_REGISTRY_ADDRESS`. |
| `NEXT_PUBLIC_TOKEN_ADDRESS` | `0xC85b…92b0` | Must match EB `TOKEN_ADDRESS`. |

### Recommended

| Variable | Example | Notes |
|----------|---------|--------|
| `NEXT_PUBLIC_BLOCK_EXPLORER_URL` | `https://sepolia.etherscan.io` | Tx / address links in UI |
| `NEXT_PUBLIC_API_BASE_URL` | `/api/backend` | Default; keep same-origin BFF |

### Optional

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Only if Google OAuth is enabled |

### Do **not** put on Vercel

JWT secrets, MFA codes, admin passwords, document encryption keys, chain private keys, Neon credentials, `MODULAR_COMPLIANCE_ADDRESS`, `APP_BLOCKCHAIN_*` — those belong on **Elastic Beanstalk only**.

## Config modules

| File | Scope |
|------|--------|
| [`src/shared/config/publicRuntime.ts`](src/shared/config/publicRuntime.ts) | Client-safe (chain, contracts, API path) |
| [`src/shared/config/serverRuntime.ts`](src/shared/config/serverRuntime.ts) | Server-only (`BACKEND_API_BASE_URL`, Google) |
| [`src/shared/config/contracts.generated.ts`](src/shared/config/contracts.generated.ts) | Local Anvil addresses; **override with env on Vercel** |

A production build with Anvil defaults or `NEXT_PUBLIC_CHAIN_ID=11155111` logs hard errors — set Sepolia before go-live.

## Smoke after Preview/Production

1. Tab icon (VaultGuard shield) loads
2. Landing loads over HTTPS
3. Login/register reaches EB (no “Compliance API unavailable”)
4. Auth cookies are `Secure` + `HttpOnly`; session survives >15 minutes (refresh keep-alive)
5. Investor chain reads use Sepolia RPC (not `127.0.0.1:8545`)
6. Governance can list contracts / approve KYC against the same IR+token as EB

## Related

- Backend EB: `../rwa-tokenized-compliance-system-backend/DEPLOY-EB.md`
- Chain: `../rwa-tokenized-compliance-system-blockchain/DEPLOY-SEPOLIA.md`
