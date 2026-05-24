export const copy = {
  common: {
    adminDashboard: "Admin dashboard",
    backHome: "Back to home",
    brand: "RWA Compliance",
    footerSummary:
      "Public MVP for onboarding, compliance, and operational workflows around tokenized assets.",
    footerStatusAuth: "Secure access and onboarding flow",
    footerStatusLive: "Demo environment ready",
    github: "GitHub",
    investorDashboard: "Investor dashboard",
    landing: "Landing",
    signOut: "Sign out"
  },
  landing: {
    navProduct: "Product",
    navJourney: "Journey",
    navPlatform: "Platform",
    navTrust: "Trust",
    adminCta: "Admin access",
    analyticsDisabled: "Analytics disabled until NEXT_PUBLIC_GA_MEASUREMENT_ID is configured.",
    analyticsEnabled: "Analytics enabled for the public product journey.",
    architectureBody:
      "One product language from investor onboarding to issuer operations — APIs, audit trails, and on-chain enforcement stay aligned so demos feel production-grade.",
    architectureItems: [
      "Wallet-bound KYC with BFF session integrity",
      "Admin queues with on-chain approval receipts",
      "MVP and T-REX-ready blockchain gateways"
    ],
    architectureTitle: "Hybrid stack: experience, compliance API, and chain enforcement",
    ctaBody:
      "Explore the investor path, approve a KYC in admin, and see how eligibility flows from document hash to registry — without leaving one coherent interface.",
    ctaPrimary: "Start as investor",
    ctaSecondary: "Open admin",
    ctaTitle: "Ready to walk through a regulated tokenization flow?",
    featureKicker: "Capabilities",
    features: [
      {
        title: "Identity & access",
        description:
          "Demo auth with MFA, optional wallet binding, and role-aware routing — investor and admin surfaces stay separated."
      },
      {
        title: "KYC & eligibility",
        description:
          "Document references hashed off-chain; status polling, reject reasons, and explorer links when approved on-chain."
      },
      {
        title: "Lifecycle operations",
        description:
          "Subscriptions, redemptions, fee quotes, and portfolio context in a single workspace — gated until verified."
      },
      {
        title: "Compliance controls",
        description:
          "Per-asset rules, audit events, pause/unpause, and blockchain transaction monitor for issuer demos."
      }
    ],
    featuresIntro:
      "Everything you need to demonstrate permissioned RWA workflows — from first login to on-chain transfer guardrails.",
    featuresTitle: "Built for regulated asset demos",
    heroBadge: "ERC-3643 · MiCA-aware · Testnet ready",
    heroSubtext:
      "Designed for Portugal / EU pilots: clear states, explicit risk, and no raw PII on-chain — only document hashes and registry proofs.",
    investorCta: "Investor demo",
    joinCta: "Sign up",
    loginCta: "Sign in",
    previewCards: [
      {
        title: "Authenticate & bind wallet",
        description: "Session, MFA, and optional X-Investor-Wallet header for KYC integrity."
      },
      {
        title: "Submit & track KYC",
        description: "Reference-only onboarding with live status until approve or reject."
      },
      {
        title: "Operate with guardrails",
        description: "Mint, pause, subscribe, and redeem only when compliance rules allow."
      }
    ],
    previewLabel: "Live flow preview",
    productTour: "Explore product",
    securityItems: [
      {
        title: "Off-chain PII, on-chain proofs",
        description: "DocumentHashingService keeps sensitive data off the ledger; only hashes and registry state sync."
      },
      {
        title: "Predictable system states",
        description: "Pending, approved, rejected, and chain-failure states use consistent visual language."
      },
      {
        title: "Operational resilience",
        description: "BFF retry on API outages, rate limits, and admin token patterns for controlled demos."
      }
    ],
    securityIntro: "Patterns aligned with security-token and compliance SaaS leaders — clarity first, enforcement on-chain.",
    securityTitle: "Trust by design",
    stats: [
      { value: "3", label: "integrated repos" },
      { value: "2", label: "chain modes" },
      { value: "0", label: "PII on-chain" }
    ],
    steps: [
      {
        title: "Create account & sign in",
        description: "Register with auto-login, pick investor or admin role, complete MFA in seconds."
      },
      {
        title: "Complete compliance review",
        description: "Submit a document reference; admin approves; registry reflects eligibility."
      },
      {
        title: "Run the asset lifecycle",
        description: "Subscribe, redeem, and monitor positions with fees and audit evidence in view."
      }
    ],
    stepsIntro: "Three connected acts — no dead ends between onboarding and on-chain enforcement.",
    stepsTitle: "End-to-end journey",
    subtitle:
      "Permissioned real-world asset tokenization with off-chain KYC and on-chain transfer rules — presented as a polished, demo-ready product.",
    title: "Compliance infrastructure",
    titleAccent: "for tokenized real-world assets",
    trustLabels: ["MiCA-oriented demo", "ERC-3643 / T-REX path", "Sepolia & Anvil", "Audit events", "Wallet binding"],
    trustTitle: "Aligned with EU security-token expectations"
  },
  login: {
    admin: "Admin",
    connectWallet: "Connect MetaMask",
    connectingWallet: "Connecting wallet...",
    genericError: "Unable to sign in. Please try again.",
    highlights: [
      {
        title: "Choose the right role",
        description: "The flow adapts the next step for investor or admin access."
      },
      {
        title: "Use the right method",
        description: "Demo, Google, and wallet access remain visible in the same context."
      },
      {
        title: "Sign in with confidence",
        description: "MFA stays visible as the last security step before entry."
      }
    ],
    highlightsTitle: "What gets better in this flow",
    invalidEmail: "Enter a valid email to continue.",
    invalidMfa: "Enter a 6-digit MFA code.",
    invalidWallet: "Enter a valid EVM address.",
    investor: "Investor",
    mfa: "MFA code",
    mfaHelp: "Use the code configured for the demo. The field accepts 6 digits.",
    mfaPlaceholder: "123456",
    provider: "Access method",
    providerDemoDescription: "Sign in with email to move quickly through the product.",
    providerDemoTitle: "Demo",
    providerGoogleDescription: "OAuth-ready flow for when credentials are configured.",
    providerGoogleTitle: "Google",
    providerHelp: "Choose the method that best fits the task you are about to perform.",
    providerWalletDescription: "Use a valid EVM address and connect your wallet if you want to.",
    providerWalletTitle: "Wallet",
    registeredBody: "Your demo account is ready. Use the same email to continue in sign-in.",
    registeredTitle: "Registration completed",
    registerHint: "Don't have an account yet?",
    registerLink: "Create account",
    role: "Role",
    roleHelp: "The selected role defines the default destination after authentication.",
    submit: "Sign in",
    submitting: "Signing in...",
    subjectEmailHelp: "Use a work email or the same address prepared during registration.",
    subjectEmailLabel: "Email",
    subjectEmailPlaceholder: "you@company.com",
    subjectWalletHelp: "You can connect a wallet now or enter the address manually.",
    subjectWalletLabel: "Wallet address",
    subjectWalletPlaceholder: "0x...",
    subtitle: "Sign in with clearer context, stronger validation, and less friction.",
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
        description: "Fields, messages, and validation are arranged to prevent avoidable errors."
      },
      {
        title: "Visible security",
        description: "Password strength and requirements are shown before submission."
      },
      {
        title: "Ready for sign-in",
        description: "Once finished, the next step points straight to access with the same email."
      }
    ],
    highlightsTitle: "What gets better in this registration",
    invalidEmail: "Enter a valid email address.",
    investor: "Investor",
    loginLink: "Go to sign in",
    noteText:
      "This registration prepares a demo-ready account and keeps onboarding smoother for the next step.",
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
    roleHelp: "Set the primary area this user should access.",
    strengthFair: "Fair",
    strengthGood: "Good",
    strengthStrong: "Strong",
    strengthWeak: "Weak",
    submit: "Create account",
    submitError: "Unable to create the account. Please try again.",
    submitting: "Creating account...",
    subtitle: "Registration with less ambiguity, better validation, and a clearer next step.",
    successAction: "Go to workspace",
    successBody: "Your demo session is active. You can continue to the dashboard without signing in again.",
    successTitle: "Account created — signed in",
    title: "Create a new access",
    walletAddress: "Wallet (optional)",
    walletHelp: "Optionally link an EVM address to make wallet sign-in easier later.",
    walletInvalid: "Enter a valid EVM address or leave the field empty.",
    walletPlaceholder: "0x..."
  }
} as const;
