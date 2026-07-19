# RWA Tokenized Compliance — Frontend

Next.js App Router: regulated landing, secure auth, investor/issuer dashboards, BFF to Spring Boot.

## Deploy

First Vercel deploy (PR flow): [`DEPLOY-VERCEL.md`](DEPLOY-VERCEL.md).

| Config | Scope |
|--------|--------|
| [`src/shared/config/publicRuntime.ts`](src/shared/config/publicRuntime.ts) | Client-safe |
| [`src/shared/config/serverRuntime.ts`](src/shared/config/serverRuntime.ts) | Server-only (`BACKEND_API_BASE_URL`) |
| [`contracts.generated.ts`](src/shared/config/contracts.generated.ts) | Local Anvil; override on Vercel via `NEXT_PUBLIC_*` |

## Commands

```bash
npm install
npm test
npm run dev          # http://localhost:3000 — independent of sibling repos
npm run build
npm run local:bootstrap  # optional local Anvil bootstrap
```

## Routes

`/`, `/login`, `/register`, `/dashboard`, `/admin`, `/terms`, `/privacy`

## Features

- Register → secure auto-login (HttpOnly compliance session)
- Light/dark theme with production-oriented UX
- BFF forwards `X-Investor-Wallet`; 502 retry for resilience
- KYC status polling until terminal AML state
- Wagmi `useReadContract` for token balance and registry `isVerified`
