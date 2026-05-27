export const en = {
  nav: {
    primary: "Primary navigation",
    home: "Home",
    signIn: "Sign in",
    signUp: "Create account",
    terms: "Terms of use",
    privacy: "Privacy policy",
    useCases: "Use cases",
    product: "Product",
    howItWorks: "How it works",
    platform: "Platform",
    trust: "Trust",
    language: "Language",
    openMenu: "Open menu"
  },
  wallet: {
    connect: "Connect wallet",
    connecting: "Connecting wallet...",
    switchToChain: "Switch to {chainName}",
    disconnectedNotice:
      "Wallet disconnected. You can still paste a wallet address for API status checks.",
    noWalletFound: "No injected wallet was found. Install or enable a browser wallet to continue.",
    noConnector: "No injected wallet connector is available.",
    connectionFailed: "Wallet connection failed.",
    manualMode: "Manual wallet mode"
  },
  errors: {
    apiUnavailable:
      "Compliance API is temporarily unavailable. Ensure the Spring Boot backend is running, then retry.",
    assetOfferingsRefreshFailed: "Unable to refresh asset offerings. Try again.",
    gatewayUnavailableTitle: "Compliance API unavailable",
    authRequired: "Authentication required.",
    sessionExpired: "Session expired. Sign in again.",
    adminSessionRequired: "Admin session required.",
    complianceSessionRequired: "Compliance officer session required.",
    governanceSessionRequired: "Super-admin governance session required.",
    auditSessionRequired: "Auditor session required.",
    investorSessionRequired:
      "Investor session required. Sign in as an investor to use this endpoint.",
    authApiNotFound:
      "Auth API not found. Restart the Spring Boot backend (port 8080) with the latest code.",
    backendNotFound:
      "Backend endpoint not found. Ensure the compliance service is running on port 8080.",
    authenticationFailed: "Authentication request failed.",
    signOutFailed: "Unable to sign out.",
    requestFailed: "Request failed.",
    documentForbidden: "Access to this document is forbidden.",
    upstreamUnavailable:
      "The compliance service is temporarily unavailable. Wait a moment and try again.",
    chainNotReady:
      "On-chain eligibility is not confirmed yet. Wait for blockchain confirmation before continuing.",
    chainSubmissionFailed: "Blockchain submission failed. Operations will retry automatically.",
    recipientNotCompliant:
      "The recipient is not eligible to receive this token under issuer compliance rules.",
    tokenPaused: "This token is paused. Transfers and lifecycle actions are temporarily disabled.",
    wrongNetwork: "Switch your wallet to the required network before signing.",
    kycWalletMismatch: "The wallet must match your session and connected wallet.",
    approveTriggersChain: "This action triggers blockchain attestation and cannot be undone from the UI alone."
  },
  common: {
    retry: "Retry",
    adminDashboard: "Admin dashboard",
    backHome: "Back to home",
    brand: "RWA Compliance",
    footerStatusAuth: "Secure access and onboarding flow",
    footerStatusLive: "Production compliance platform",
    github: "GitHub",
    investorDashboard: "Investor dashboard",
    landing: "Home",
    signOut: "Sign out"
  },
  footer: {
    copyright: "© 2026 RWA Compliance · Regulated tokenization infrastructure.",
    legalTitle: "Legal",
    privacy: "Privacy policy",
    productLinks: [{ href: "/register", label: "Create account" }],
    productTitle: "Product",
    resourceLinks: [
      { href: "/#how-to", label: "How it works" },
      { href: "/#use-cases", label: "Use cases" },
      { href: "/#tradeoffs", label: "Compliance scope" }
    ],
    resourcesTitle: "Resources",
    tagline:
      "Permissioned RWA tokenization aligned with EU MiCA, GDPR, and ERC-3643 — off-chain KYC/AML with on-chain transfer enforcement.",
    terms: "Terms of use"
  },
  legal: {
    privacy: {
      eyebrow: "Legal · GDPR",
      sections: [
        {
          title: "1. Scope",
          body: "This privacy policy describes how RWA Compliance processes personal data when you use our tokenized asset compliance platform. It applies to the web application, BFF layer, and linked compliance API services operated under applicable EU and international data-protection law."
        },
        {
          title: "2. Data we process",
          body: "We may process account identifiers (email, role), optional wallet addresses, MFA verification data, KYC/AML document references (hashes and metadata — not raw document files unless explicitly uploaded to your configured provider), session cookies, audit logs, and operational telemetry required to deliver regulated onboarding and lifecycle services."
        },
        {
          title: "3. Off-chain PII and on-chain proofs",
          body: "Personal data and source documents remain off-chain by design. Only cryptographic document hashes and identity-registry eligibility state are synchronized to the blockchain, in line with GDPR data-minimization and security-token industry practice."
        },
        {
          title: "4. Cookies, analytics & lawful basis",
          body: "Strictly necessary session cookies support authentication and security. Optional analytics load only when configured by the operator. Processing is based on contract performance, legitimate interest in platform security, and — where required — consent for non-essential cookies."
        },
        {
          title: "5. Retention, security & subprocessors",
          body: "Data is retained according to your organization's compliance policy and regulatory obligations. We apply access controls, encryption in transit, rate limiting, and immutable audit events. KYC, oracle, and custody integrations may involve vetted subprocessors under appropriate data-processing agreements."
        },
        {
          title: "6. Your rights",
          body: "Depending on jurisdiction, you may request access, rectification, erasure, restriction, portability, or object to processing. Contact your data controller or platform operator to exercise GDPR or equivalent rights."
        }
      ],
      title: "Privacy policy",
      updated: "Last updated: May 2026"
    },
    terms: {
      eyebrow: "Legal · Terms",
      sections: [
        {
          title: "1. Acceptance",
          body: "By accessing RWA Compliance you agree to these terms. The platform provides software for regulated tokenized asset workflows. It does not constitute investment, legal, or tax advice, and does not replace authorization from competent authorities where required."
        },
        {
          title: "2. Permitted use",
          body: "You may use the platform for investor onboarding, KYC/AML review, issuer operations, and lifecycle management of permissioned tokens in compliance with applicable securities, AML, and data-protection regulations in your jurisdiction."
        },
        {
          title: "3. Accounts, roles & security",
          body: "Investor and issuer roles are segregated. You are responsible for safeguarding credentials, wallet keys, admin tokens, and MFA devices. Unauthorized access must be reported to your operator immediately."
        },
        {
          title: "4. Regulatory compliance",
          body: "Issuers remain responsible for MiCA, national securities law, AML/KYC program design, prospectus or offering documentation, and investor suitability. The platform supports operational controls — not regulatory approval on your behalf."
        },
        {
          title: "5. Service availability",
          body: "Software, smart contracts, and third-party integrations are provided with commercially reasonable care. Blockchain finality, oracle feeds, and external KYC providers depend on network and vendor conditions outside our direct control."
        },
        {
          title: "6. Liability & changes",
          body: "Liability is limited to the extent permitted by law. Terms may be updated to reflect regulatory or product changes; continued use after notice constitutes acceptance of the revised terms."
        }
      ],
      title: "Terms of use",
      updated: "Last updated: May 2026"
    }
  },
  landing: {
    navProduct: "Product",
    navUseCases: "Use cases",
    navHowTo: "How it works",
    navPlatform: "Platform",
    navTrust: "Trust",
    adminCta: "Issuer console",
    analyticsDisabled: "Analytics disabled until NEXT_PUBLIC_GA_MEASUREMENT_ID is configured.",
    analyticsEnabled: "Privacy-conscious analytics enabled for product insights.",
    architectureBody:
      "One compliance graph from investor onboarding to issuer operations — APIs, audit trails, and on-chain enforcement stay aligned for MiCA-ready security-token programs.",
    architectureKicker: "Architecture",
    architecturePillars: [
      {
        title: "Frontend",
        description: "Next.js BFF, Wagmi, session-bound KYC, investor and admin dashboards"
      },
      {
        title: "Backend",
        description: "Spring Boot compliance API, document hashing, Web3j gateways (legacy + T-REX)"
      },
      {
        title: "Blockchain",
        description: "Permissioned token and identity registry — transfer rules enforced on-chain"
      }
    ],
    architectureItems: [
      "Wallet-bound KYC with BFF session integrity",
      "Issuer queues with on-chain approval receipts",
      "Legacy registry and ERC-3643 / T-REX gateways"
    ],
    architectureTitle: "Hybrid stack: experience, compliance API, and chain enforcement",
    ctaBody:
      "Walk the investor path, approve KYC in the issuer console, and trace eligibility from document hash to on-chain registry — in one regulated interface.",
    ctaPrimary: "Investor portal",
    ctaSecondary: "Issuer console",
    ctaTitle: "Ready to operate a compliant tokenization program?",
    featureKicker: "Capabilities",
    features: [
      {
        title: "Identity & access",
        description:
          "MFA-protected sessions, optional wallet binding, and role-aware routing — investor and issuer surfaces remain segregated."
      },
      {
        title: "KYC & eligibility",
        description:
          "AML-aligned document references hashed off-chain; live status, reject reasons, and explorer links when approved on-chain."
      },
      {
        title: "Lifecycle operations",
        description:
          "Subscriptions, redemptions, fee quotes, and portfolio context in one workspace — gated until identity is verified."
      },
      {
        title: "Compliance controls",
        description:
          "Per-asset rules, audit events, pause/unpause, and blockchain transaction monitoring for issuer operations."
      }
    ],
    featuresIntro:
      "Operational tooling for permissioned RWA programs — from regulated onboarding to on-chain transfer guardrails.",
    featuresTitle: "Built for regulated asset issuance",
    heroBadge: "ERC-3643 · MiCA · GDPR · AML/KYC",
    heroSubtext:
      "Designed for EU and international issuers: explicit compliance states, data minimization, and no raw PII on-chain — only hashes and registry proofs.",
    investorCta: "Investor portal",
    joinCta: "Sign up",
    loginCta: "Sign in",
    previewCards: [
      {
        title: "Authenticate & bind wallet",
        description: "Secure session, MFA, and wallet-bound KYC integrity via BFF headers."
      },
      {
        title: "Submit & track KYC",
        description: "Reference-only onboarding with live AML status until approve or reject."
      },
      {
        title: "Operate with guardrails",
        description: "Subscribe, redeem, and transfer only when compliance rules and registry state allow."
      }
    ],
    previewLabel: "Compliance flow",
    productTour: "See how it works",
    securityItems: [
      {
        title: "Off-chain PII, on-chain proofs",
        description: "Document hashing keeps sensitive data off the ledger; only hashes and registry eligibility sync on-chain."
      },
      {
        title: "Predictable compliance states",
        description: "Pending, approved, rejected, and chain-failure states use consistent operational language."
      },
      {
        title: "Operational resilience",
        description: "BFF retry on API outages, rate limits, and issuer authorization patterns for production uptime."
      }
    ],
    securityIntro:
      "Security and UX patterns aligned with regulated tokenization platforms — clarity first, enforcement on-chain.",
    securityTitle: "Trust by design",
    stats: [
      { value: "MiCA", label: "EU alignment" },
      { value: "ERC-3643", label: "security token" },
      { value: "0", label: "PII on-chain" }
    ],
    steps: [
      {
        title: "Create account & sign in",
        description: "Register with MFA, select investor or issuer role, and enter the secured workspace."
      },
      {
        title: "Complete compliance review",
        description: "Submit a document reference; issuer approves; identity registry reflects eligibility."
      },
      {
        title: "Run the asset lifecycle",
        description: "Subscribe, redeem, and monitor positions with fees and audit evidence in view."
      }
    ],
    stepsIntro: "Three connected stages — no gaps between onboarding and on-chain enforcement.",
    stepsTitle: "End-to-end journey",
    subtitle:
      "Permissioned real-world asset tokenization with off-chain KYC/AML and on-chain transfer rules — production-grade compliance infrastructure.",
    title: "Compliance infrastructure",
    titleAccent: "for tokenized real-world assets",
    trustLabels: [
      "MiCA-oriented",
      "GDPR data minimization",
      "ERC-3643 / T-REX",
      "Audit trail",
      "Wallet binding"
    ],
    trustTitle: "Aligned with EU and international security-token regulation",
    useCasesIntro: "Three primary actors — each with a clear outcome in the same compliance graph.",
    useCasesTitle: "Who it is for",
    useCases: [
      {
        title: "Issuers & admins",
        description:
          "Approve KYC, configure asset rules, pause transfers, and monitor on-chain receipts from one control room."
      },
      {
        title: "Investors",
        description:
          "Register, bind a wallet, track AML status, and operate subscriptions or redemptions when verified."
      },
      {
        title: "Compliance & ops",
        description:
          "Audit document hashes, eligibility states, blockchain transactions, and lifecycle events without raw PII on-chain."
      }
    ],
    howToIntro: "A standard operational path from sign-up to on-chain eligibility.",
    howToTitle: "How it works",
    howToSteps: [
      {
        title: "Sign up or sign in",
        description: "Select investor or issuer role and complete MFA as required by your organization."
      },
      {
        title: "Bind wallet & submit KYC",
        description: "Investors attach a wallet and submit a document reference; status updates until terminal."
      },
      {
        title: "Approve in issuer console",
        description: "Compliance team reviews the queue, approves identity, and confirms registry on-chain."
      },
      {
        title: "Operate lifecycle",
        description: "Subscribe, redeem, or pause — gated by the same eligibility enforced by the security token."
      }
    ],
    tradeoffsIntro: "Transparent scope — platform strengths and deployment considerations.",
    tradeoffsTitle: "Compliance scope",
    tradeoffsStrengths: [
      "End-to-end traceability from KYC hash to registry proof",
      "Dual blockchain gateways (legacy registry + ERC-3643 / T-REX)",
      "Clear UX for pending, approved, rejected, and chain errors",
      "BFF session integrity with wallet-bound KYC header"
    ],
    tradeoffsLimits: [
      "Jurisdiction-specific legal review remains mandatory",
      "External KYC/AML and oracle providers configured per deployment",
      "Chain network and custody model chosen by the issuer",
      "Regulatory authorization is the issuer's responsibility"
    ],
    moreFeaturesIntro: "Extended capabilities in the integrated compliance stack.",
    moreFeaturesTitle: "Platform capabilities",
    moreFeatures: [
      { title: "Portfolio chart", description: "Performance view for verified investors." },
      { title: "Fee quotes", description: "Subscription and redemption fees surfaced before submission." },
      { title: "Pause / unpause", description: "Issuer circuit-breaker mirrored on-chain." },
      { title: "Audit feed", description: "Operational events with consistent compliance status language." },
      { title: "API resilience", description: "BFF retry when the compliance API is temporarily unavailable." },
      { title: "Explorer links", description: "On-chain receipt verification after registry approval." }
    ]
  },
  login: {
    admin: "Admin",
    connectWallet: "Connect MetaMask",
    connectingWallet: "Connecting wallet...",
    genericError: "Unable to sign in. Please try again.",
    highlights: [
      {
        title: "Choose the right role",
        description: "The flow adapts the next step for investor or issuer access."
      },
      {
        title: "Use the right method",
        description: "Email, OAuth, and wallet access remain visible in the same secure context."
      },
      {
        title: "Sign in with confidence",
        description: "MFA is the final security step before entering regulated workspaces."
      }
    ],
    highlightsTitle: "Secure access",
    invalidEmail: "Enter a valid email to continue.",
    invalidMfa: "Enter a 6-digit MFA code.",
    invalidWallet: "Enter a valid EVM address.",
    investor: "Investor",
    mfa: "MFA code",
    mfaHelp: "Enter the one-time code from your authenticator or organization policy.",
    mfaPlaceholder: "123456",
    provider: "Access method",
    providerEmailDescription: "Sign in with your registered email and MFA.",
    providerEmailTitle: "Email",
    providerGoogleDescription: "Enterprise OAuth when Google Workspace is configured.",
    providerGoogleTitle: "Google",
    providerHelp: "Choose the method approved by your organization.",
    providerWalletDescription: "Use a verified EVM address and connect your wallet.",
    providerWalletTitle: "Wallet",
    registeredBody: "Your account is ready. Sign in with the same email to continue.",
    registeredTitle: "Registration completed",
    registerHint: "Don't have an account yet?",
    registerLink: "Create account",
    role: "Role",
    roleHelp: "The selected role defines the default destination after authentication.",
    submit: "Sign in",
    submitting: "Signing in...",
    subjectEmailHelp: "Use your registered work email address.",
    subjectEmailLabel: "Email",
    subjectEmailPlaceholder: "you@company.com",
    subjectWalletHelp: "Connect a wallet or enter the address manually.",
    subjectWalletLabel: "Wallet address",
    subjectWalletPlaceholder: "0x...",
    subtitle: "Secure sign-in for regulated investor and issuer workspaces.",
    title: "Access the platform",
    walletUnavailable: "No wallet connector is available in this browser."
  },
  register: {
    admin: "Admin",
    alreadyHaveAccount: "Already have an account",
    confirmPassword: "Confirm password",
    confirmPasswordPlaceholder: "Repeat your password",
    email: "Email",
    emailPlaceholder: "you@company.com",
    highlights: [
      {
        title: "Guided registration",
        description: "Fields, messages, and validation aligned with compliance onboarding."
      },
      {
        title: "Visible security",
        description: "Password strength and requirements are shown before submission."
      },
      {
        title: "Ready for sign-in",
        description: "After registration you enter the workspace with an active secure session."
      }
    ],
    highlightsTitle: "Regulated onboarding",
    invalidEmail: "Enter a valid email address.",
    investor: "Investor",
    loginLink: "Go to sign in",
    noteText:
      "Registration creates a secured account for your organization's tokenized asset program.",
    password: "Password",
    passwordCheckLength: "At least 8 characters",
    passwordCheckNumber: "At least one number",
    passwordCheckSpecial: "Special character for extra strength",
    passwordCheckUppercase: "At least one uppercase letter",
    passwordHelp: "Password must contain 8 characters, one uppercase letter, and one number.",
    passwordMismatch: "Passwords do not match.",
    passwordPlaceholder: "Create a secure password",
    passwordStrength: "Password strength",
    role: "Role",
    roleHelp: "Set the primary regulated workspace this user should access.",
    strengthFair: "Fair",
    strengthGood: "Good",
    strengthStrong: "Strong",
    strengthWeak: "Weak",
    submit: "Create account",
    submitError: "Unable to create the account. Please try again.",
    submitting: "Creating account...",
    subtitle: "Create a secured account for investor or issuer access.",
    successAction: "Go to workspace",
    successBody: "Your session is active. Continue to the dashboard without signing in again.",
    successTitle: "Account created — signed in",
    title: "Create an account",
    walletAddress: "Wallet (optional)",
    walletHelp: "Optionally link an EVM address for wallet-based sign-in and KYC binding.",
    walletInvalid: "Enter a valid EVM address or leave the field empty.",
    walletPlaceholder: "0x..."
  },
  workspace: {
    admin: {
      heroDescription:
        "Run the issuer surface with a clearer operational overview across identity approvals, subscription and redemption queues, compliance rules, feed health, and blockchain monitoring.",
      heroEyebrow: "Issuer operations",
      heroTitle:
        "A unified control plane for compliance decisions, asset configuration, and on-chain safeguards",
      topbarSubtitle:
        "KYC queue · identity approvals · lifecycle operations · audit evidence",
      topbarTitle: "Admin / Issuer Control Room"
    },
    investor: {
      heroDescription:
        "Connect a wallet, complete KYC, and manage subscriptions, redemptions, and portfolio positions in one regulated workspace.",
      heroEyebrow: "Investor workspace",
      heroTitle: "Portfolio, eligibility, and lifecycle actions in one place",
      topbarSubtitle: "{chainName} chain {chainId} · off-chain eligibility · on-chain transfer guard",
      topbarTitle: "Investor / Portfolio Workspace",
      nav: {
        overview: "Overview",
        onboarding: "Onboarding",
        compliance: "Compliance",
        portfolio: "Portfolio",
        offerings: "Invest",
        redemptions: "Redeem",
        transfer: "Transfer",
        activity: "Activity"
      },
      kyc: {
        submitted: "Submitted",
        inReview: "In review",
        approvedPendingChain: "Approved — awaiting blockchain confirmation",
        approved: "Approved",
        rejected: "Rejected",
        revoked: "Revoked",
        failedOnChain: "Action required — chain sync pending",
        polling: "Updating compliance status…",
        onChainVerified: "On-chain verified",
        offChainOnly: "Off-chain status only"
      }
    },
    compliance: {
      topbarTitle: "Compliance workspace",
      topbarSubtitle: "KYC decisions and lifecycle queues — no governance controls",
      nav: {
        dashboard: "Dashboard",
        kyc: "KYC queue",
        revoke: "Revoke",
        subscriptions: "Subscriptions",
        redemptions: "Redemptions",
        audit: "Events"
      },
      approveConfirm: "Triggers blockchain attestation. Continue?",
      subscriptionBlocked: "Investor is not on-chain verified. Subscription approve is blocked."
    },
    governance: {
      topbarTitle: "Governance workspace",
      topbarSubtitle: "Emergency controls, assets, oracle, and ForceSync — no routine KYC",
      nav: {
        overview: "Overview",
        assets: "Assets",
        pause: "Emergency",
        oracle: "Oracle",
        forceSync: "Force sync",
        forceSyncApprove: "Four-eyes",
        operations: "Operations"
      }
    },
    audit: {
      topbarTitle: "Audit workspace",
      topbarSubtitle: "Read-only oversight — no write actions",
      nav: {
        timeline: "Timeline",
        kyc: "KYC history",
        chain: "On-chain",
        export: "Export",
        forceSync: "Force sync trail"
      }
    }
  }
} as const;
