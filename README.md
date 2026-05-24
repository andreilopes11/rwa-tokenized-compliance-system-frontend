# RWA Tokenized Compliance — Frontend

Next.js App Router: landing, demo auth, investor/admin dashboards, BFF to Spring Boot.

## Contract with `_docs`

| Item | Link |
|------|------|
| Spec | [`../_docs/frontend-spec.md`](../_docs/frontend-spec.md) |
| Deploy / env | [`../_docs/deployment.md`](../_docs/deployment.md) |
| Security | [`../_docs/security.md`](../_docs/security.md) |

Environment variables are documented only in [`../_docs/deployment.md`](../_docs/deployment.md) and [`.env.example`](.env.example) (template).

## Commands

```bash
npm install
npm test
npm run dev          # http://localhost:3000
```

## Routes

`/`, `/login`, `/register`, `/dashboard`, `/admin` — see `_docs/frontend-spec.md`.

## Features (Testnet Public)

- Register → auto-login (demo session cookie)
- BFF forwards `X-Investor-Wallet`; 502 retry UX
- KYC status polling until terminal state
- Wagmi `useReadContract` for token balance and registry `isVerified`
- Admin token in `sessionStorage` (portfolio pattern; see spec)
