export type Locale = "pt" | "en";

type HighlightItem = {
  description: string;
  title: string;
};

type FeatureItem = {
  description: string;
  title: string;
};

type StatItem = {
  label: string;
  value: string;
};

type Dictionary = {
  common: {
    adminDashboard: string;
    backHome: string;
    brand: string;
    footerSummary: string;
    footerStatusAuth: string;
    footerStatusLive: string;
    github: string;
    investorDashboard: string;
    landing: string;
    language: string;
    signOut: string;
  };
  landing: {
    adminCta: string;
    analyticsDisabled: string;
    analyticsEnabled: string;
    ctaBody: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaTitle: string;
    featureKicker: string;
    features: FeatureItem[];
    featuresTitle: string;
    heroBadge: string;
    heroSubtext: string;
    investorCta: string;
    joinCta: string;
    previewCards: FeatureItem[];
    previewLabel: string;
    productTour: string;
    securityItems: FeatureItem[];
    securityTitle: string;
    stats: StatItem[];
    steps: FeatureItem[];
    stepsTitle: string;
    subtitle: string;
    title: string;
  };
  login: {
    admin: string;
    connectWallet: string;
    connectingWallet: string;
    genericError: string;
    highlights: HighlightItem[];
    highlightsTitle: string;
    invalidEmail: string;
    invalidMfa: string;
    invalidWallet: string;
    investor: string;
    mfa: string;
    mfaHelp: string;
    mfaPlaceholder: string;
    provider: string;
    providerDemoDescription: string;
    providerDemoTitle: string;
    providerGoogleDescription: string;
    providerGoogleTitle: string;
    providerHelp: string;
    providerWalletDescription: string;
    providerWalletTitle: string;
    registeredBody: string;
    registeredTitle: string;
    registerHint: string;
    registerLink: string;
    role: string;
    roleHelp: string;
    submit: string;
    submitting: string;
    subjectEmailHelp: string;
    subjectEmailLabel: string;
    subjectEmailPlaceholder: string;
    subjectWalletHelp: string;
    subjectWalletLabel: string;
    subjectWalletPlaceholder: string;
    subtitle: string;
    title: string;
    walletUnavailable: string;
  };
  register: {
    admin: string;
    alreadyHaveAccount: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    email: string;
    emailPlaceholder: string;
    highlights: HighlightItem[];
    highlightsTitle: string;
    invalidEmail: string;
    investor: string;
    loginLink: string;
    noteText: string;
    password: string;
    passwordCheckLength: string;
    passwordCheckNumber: string;
    passwordCheckSpecial: string;
    passwordCheckUppercase: string;
    passwordHelp: string;
    passwordMismatch: string;
    passwordPlaceholder: string;
    passwordStrength: string;
    role: string;
    roleHelp: string;
    strengthFair: string;
    strengthGood: string;
    strengthStrong: string;
    strengthWeak: string;
    submit: string;
    submitError: string;
    submitting: string;
    subtitle: string;
    successAction: string;
    successBody: string;
    successTitle: string;
    title: string;
    walletAddress: string;
    walletHelp: string;
    walletInvalid: string;
    walletPlaceholder: string;
  };
};

export const dictionaries = {
  pt: {
    common: {
      adminDashboard: "Painel admin",
      backHome: "Voltar para a home",
      brand: "RWA Compliance",
      footerSummary:
        "MVP publico para onboarding, compliance e fluxos operacionais de ativos tokenizados.",
      footerStatusAuth: "Fluxo seguro de acesso e onboarding",
      footerStatusLive: "Demo pronta para exploracao",
      github: "GitHub",
      investorDashboard: "Painel do investidor",
      landing: "Landing",
      language: "Idioma",
      signOut: "Sair"
    },
    landing: {
      adminCta: "Acessar area admin",
      analyticsDisabled: "Analytics desativado ate configurar NEXT_PUBLIC_GA_MEASUREMENT_ID.",
      analyticsEnabled: "Analytics ativo para a jornada publica do produto.",
      ctaBody:
        "Entre como investidor, avalie os fluxos de compliance e acompanhe toda a operacao do ponto de vista do issuer.",
      ctaPrimary: "Entrar como investidor",
      ctaSecondary: "Entrar como admin",
      ctaTitle: "Um produto pensado para onboarding com confianca",
      featureKicker: "Fluxos conectados do inicio ao monitoramento",
      features: [
        {
          title: "Autenticacao guiada",
          description: "Email, MFA e carteira organizados em um fluxo unico, com menos friccao."
        },
        {
          title: "KYC e elegibilidade",
          description: "Onboarding com verificacoes claras, status rastreavel e decisoes auditaveis."
        },
        {
          title: "Operacao com contexto",
          description: "Dashboards com portfolio, ofertas, lifecycle e acao rapida em um mesmo espaco."
        },
        {
          title: "Controle regulatorio",
          description: "Regras de compliance, auditoria e monitoramento prontas para demonstracao."
        }
      ],
      featuresTitle: "O que esta pronto para usar",
      heroBadge: "Portugal / UE first demo",
      heroSubtext:
        "Do primeiro acesso ao monitoramento de ativos, a experiencia foi desenhada para deixar contexto, proximo passo e risco sempre claros.",
      investorCta: "Entrar como investidor",
      joinCta: "Criar conta",
      previewCards: [
        {
          title: "Entrar e validar",
          description: "Role, provider, MFA e carteira no mesmo fluxo."
        },
        {
          title: "Avaliar elegibilidade",
          description: "KYC, perfil, regras e auditoria com leitura rapida."
        },
        {
          title: "Operar o ciclo",
          description: "Subscricao, resgate, taxas e monitoramento em um unico painel."
        }
      ],
      previewLabel: "Preview do produto",
      productTour: "Ver fluxo do produto",
      securityItems: [
        {
          title: "Mensagens de estado claras",
          description: "Erros, sucesso, pending e vazios com feedback consistente."
        },
        {
          title: "Acoes com contexto",
          description: "Botoes, filtros e cards desenhados para reduzir duvida operacional."
        },
        {
          title: "Base reutilizavel",
          description: "Componentes compartilhados para crescer sem perder consistencia."
        }
      ],
      securityTitle: "UX pensada para produto regulado",
      stats: [
        { value: "3", label: "areas principais" },
        { value: "1", label: "fluxo continuo" },
        { value: "24/7", label: "visibilidade operacional" }
      ],
      steps: [
        {
          title: "1. Criar ou acessar conta",
          description: "Escolha o perfil certo e use o metodo mais adequado para a tarefa."
        },
        {
          title: "2. Completar compliance",
          description: "Envie os dados necessarios e acompanhe o status sem perder o fio da jornada."
        },
        {
          title: "3. Operar o ativo",
          description: "Peça cotacao, subscricao ou resgate com feedback imediato sobre o estado."
        }
      ],
      stepsTitle: "Como a experiencia se conecta",
      subtitle:
        "Onboarding, KYC, subscricao, resgate e enforcement on-chain apresentados como uma experiencia mais clara, guiada e pronta para demo.",
      title: "Interfaces melhores para um fluxo de compliance que parece produto, nao prototipo"
    },
    login: {
      admin: "Admin",
      connectWallet: "Conectar MetaMask",
      connectingWallet: "Conectando carteira...",
      genericError: "Nao foi possivel entrar. Tente novamente.",
      highlights: [
        {
          title: "Escolha o perfil certo",
          description: "A experiencia ajusta a proxima etapa conforme investidor ou admin."
        },
        {
          title: "Use o metodo adequado",
          description: "Demo, Google e carteira ficam visiveis no mesmo contexto."
        },
        {
          title: "Entre com seguranca",
          description: "O MFA continua visivel como parte do passo final de acesso."
        }
      ],
      highlightsTitle: "O que melhora neste fluxo",
      invalidEmail: "Informe um email valido para continuar.",
      invalidMfa: "Informe um codigo MFA de 6 digitos.",
      invalidWallet: "Informe um endereco EVM valido.",
      investor: "Investidor",
      mfa: "Codigo MFA",
      mfaHelp: "Use o codigo configurado para a demo. O campo aceita 6 digitos.",
      mfaPlaceholder: "123456",
      provider: "Metodo de acesso",
      providerDemoDescription: "Entrar com email para navegar rapidamente pelo produto.",
      providerDemoTitle: "Demo",
      providerGoogleDescription: "Fluxo preparado para OAuth quando as credenciais estiverem configuradas.",
      providerGoogleTitle: "Google",
      providerHelp: "Selecione o metodo que melhor combina com a tarefa que voce vai executar.",
      providerWalletDescription: "Use um endereco EVM valido e, se quiser, conecte a carteira agora.",
      providerWalletTitle: "Wallet",
      registeredBody: "A conta demo foi preparada. Use o mesmo email para continuar no login.",
      registeredTitle: "Cadastro concluido",
      registerHint: "Ainda nao tem conta?",
      registerLink: "Criar conta",
      role: "Perfil",
      roleHelp: "O perfil define a area de destino depois da autenticacao.",
      submit: "Entrar",
      submitting: "Entrando...",
      subjectEmailHelp: "Use um email de trabalho ou o email preparado no cadastro.",
      subjectEmailLabel: "Email",
      subjectEmailPlaceholder: "voce@empresa.com",
      subjectWalletHelp: "Voce pode conectar a carteira ou informar o endereco manualmente.",
      subjectWalletLabel: "Endereco da wallet",
      subjectWalletPlaceholder: "0x...",
      subtitle: "Entrar com contexto claro, validacao objetiva e menos retrabalho.",
      title: "Acessar a plataforma",
      walletUnavailable: "Nenhum conector de carteira esta disponivel neste navegador."
    },
    register: {
      admin: "Admin",
      alreadyHaveAccount: "Ja tenho conta",
      confirmPassword: "Confirmar senha",
      confirmPasswordPlaceholder: "Repita a senha",
      email: "Email",
      emailPlaceholder: "voce@empresa.com",
      highlights: [
        {
          title: "Cadastro orientado",
          description: "Campos, mensagens e validacoes foram organizados para evitar erro evitavel."
        },
        {
          title: "Seguranca visivel",
          description: "A senha mostra forca e requisitos antes do envio."
        },
        {
          title: "Pronto para login",
          description: "Ao concluir, o proximo passo ja aponta para o acesso com o mesmo email."
        }
      ],
      highlightsTitle: "O que melhora neste cadastro",
      invalidEmail: "Informe um email valido.",
      investor: "Investidor",
      loginLink: "Ir para login",
      noteText:
        "Este cadastro cria um acesso pronto para a demo e ajuda a manter o onboarding mais fluido.",
      password: "Senha",
      passwordCheckLength: "Pelo menos 8 caracteres",
      passwordCheckNumber: "Ao menos um numero",
      passwordCheckSpecial: "Caractere especial para aumentar a forca",
      passwordCheckUppercase: "Ao menos uma letra maiuscula",
      passwordHelp: "A senha precisa ter 8 caracteres, uma letra maiuscula e um numero.",
      passwordMismatch: "As senhas nao conferem.",
      passwordPlaceholder: "Crie uma senha segura",
      passwordStrength: "Forca da senha",
      role: "Perfil",
      roleHelp: "Defina a area principal que esse usuario deve acessar.",
      strengthFair: "Regular",
      strengthGood: "Boa",
      strengthStrong: "Forte",
      strengthWeak: "Fraca",
      submit: "Criar conta",
      submitError: "Nao foi possivel criar a conta. Tente novamente.",
      submitting: "Criando conta...",
      subtitle: "Cadastro com menos ambiguidade, validacao melhor e proximo passo mais claro.",
      successAction: "Continuar para login",
      successBody: "Use o mesmo email na tela de acesso para entrar na demo.",
      successTitle: "Conta criada com sucesso",
      title: "Criar novo acesso",
      walletAddress: "Wallet (opcional)",
      walletHelp: "Se quiser, vincule um endereco EVM para facilitar o login por carteira.",
      walletInvalid: "Informe um endereco EVM valido ou deixe o campo em branco.",
      walletPlaceholder: "0x..."
    }
  },
  en: {
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
      language: "Language",
      signOut: "Sign out"
    },
    landing: {
      adminCta: "Open admin area",
      analyticsDisabled: "Analytics disabled until NEXT_PUBLIC_GA_MEASUREMENT_ID is configured.",
      analyticsEnabled: "Analytics enabled for the public product journey.",
      ctaBody:
        "Sign in as an investor, review compliance flows, and inspect the full operating surface from the issuer point of view.",
      ctaPrimary: "Enter as investor",
      ctaSecondary: "Enter as admin",
      ctaTitle: "A product experience built for confident onboarding",
      featureKicker: "Connected flows from first access to ongoing monitoring",
      features: [
        {
          title: "Guided authentication",
          description: "Email, MFA, and wallet access organized in a single flow with less friction."
        },
        {
          title: "KYC and eligibility",
          description: "Onboarding with clear checks, traceable status, and auditable decisions."
        },
        {
          title: "Operational context",
          description: "Dashboards for portfolio, offerings, lifecycle, and action-taking in one place."
        },
        {
          title: "Regulatory control",
          description: "Compliance rules, audit visibility, and monitoring ready for demos."
        }
      ],
      featuresTitle: "What is ready to use",
      heroBadge: "Portugal / EU first demo",
      heroSubtext:
        "From first sign-in to asset monitoring, every step is designed so the user always understands context, next action, and risk.",
      investorCta: "Enter as investor",
      joinCta: "Create account",
      previewCards: [
        {
          title: "Sign in and verify",
          description: "Role, provider, MFA, and wallet in one coherent flow."
        },
        {
          title: "Assess eligibility",
          description: "KYC, profile, rules, and audit views built for quick reading."
        },
        {
          title: "Operate the lifecycle",
          description: "Subscription, redemption, fees, and monitoring in a single workspace."
        }
      ],
      previewLabel: "Product preview",
      productTour: "View product flow",
      securityItems: [
        {
          title: "Clear state messaging",
          description: "Error, success, pending, and empty states share the same logic."
        },
        {
          title: "Action with context",
          description: "Buttons, filters, and cards are designed to reduce operational doubt."
        },
        {
          title: "Reusable foundation",
          description: "Shared components keep the product consistent as it grows."
        }
      ],
      securityTitle: "UX shaped for regulated product work",
      stats: [
        { value: "3", label: "main surfaces" },
        { value: "1", label: "continuous flow" },
        { value: "24/7", label: "operational visibility" }
      ],
      steps: [
        {
          title: "1. Create or access an account",
          description: "Pick the right role and use the best method for the task at hand."
        },
        {
          title: "2. Complete compliance",
          description: "Submit the required data and track status without losing the thread."
        },
        {
          title: "3. Operate the asset",
          description: "Request quotes, subscriptions, or redemptions with immediate state feedback."
        }
      ],
      stepsTitle: "How the journey connects",
      subtitle:
        "Onboarding, KYC, subscription, redemption, and on-chain enforcement presented as a clearer, guided, demo-ready product experience.",
      title: "Better interfaces for a compliance flow that feels like a product, not a prototype"
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
      successAction: "Continue to sign in",
      successBody: "Use the same email on the sign-in screen to enter the demo.",
      successTitle: "Account created successfully",
      title: "Create a new access",
      walletAddress: "Wallet (optional)",
      walletHelp: "Optionally link an EVM address to make wallet sign-in easier later.",
      walletInvalid: "Enter a valid EVM address or leave the field empty.",
      walletPlaceholder: "0x..."
    }
  }
} satisfies Record<Locale, Dictionary>;

export function isLocale(value: string): value is Locale {
  return value === "pt" || value === "en";
}
