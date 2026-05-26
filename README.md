# RWA Tokenized Compliance — Frontend

Next.js App Router: regulated landing, secure auth, investor/issuer dashboards, BFF to Spring Boot.

## Contract with `_docs`

| Item | Link |
|------|------|
| Spec | [`../_docs/frontend-spec.md`](../_docs/frontend-spec.md) |
| Deploy / env | [`../_docs/deployment.md`](../_docs/deployment.md) |
| Security | [`../_docs/security.md`](../_docs/security.md) |

Environment variables are documented in [`../_docs/deployment.md`](../_docs/deployment.md) and [`.env.example`](.env.example).

## Commands

```bash
npm install
npm test
npm run dev          # http://localhost:3000
```

## Routes

`/`, `/login`, `/register`, `/dashboard`, `/admin`, `/terms`, `/privacy` — see `_docs/frontend-spec.md`.

## Features

- Register → secure auto-login (HttpOnly compliance session)
- Light/dark theme with production-oriented UX
- BFF forwards `X-Investor-Wallet`; 502 retry for resilience
- KYC status polling until terminal AML state
- Wagmi `useReadContract` for token balance and registry `isVerified`
- Issuer admin token pattern for regulated operations
