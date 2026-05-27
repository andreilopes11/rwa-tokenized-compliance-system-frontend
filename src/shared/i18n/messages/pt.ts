export const pt = {
  nav: {
    primary: "Navegação principal",
    home: "Início",
    signIn: "Entrar",
    signUp: "Criar conta",
    terms: "Termos de uso",
    privacy: "Política de privacidade",
    useCases: "Casos de uso",
    product: "Produto",
    howItWorks: "Como funciona",
    platform: "Plataforma",
    trust: "Confiança",
    language: "Idioma",
    openMenu: "Abrir menu"
  },
  wallet: {
    connect: "Conectar carteira",
    connecting: "Conectando carteira...",
    switchToChain: "Alternar para {chainName}",
    disconnectedNotice:
      "Carteira desconectada. Você ainda pode colar um endereço de carteira para verificar o status na API.",
    noWalletFound: "Nenhuma carteira injetada foi encontrada. Instale ou habilite uma carteira do navegador para continuar.",
    noConnector: "Nenhum conector de carteira injetado está disponível.",
    connectionFailed: "Falha na conexão da carteira.",
    manualMode: "Modo de carteira manual"
  },
  errors: {
    apiUnavailable:
      "A API de conformidade está temporariamente indisponível. Certifique-se de que o backend Spring Boot esteja em execução e tente novamente.",
    assetOfferingsRefreshFailed: "Não foi possível atualizar as ofertas de ativos. Tente novamente.",
    gatewayUnavailableTitle: "API de conformidade indisponível",
    authRequired: "Autenticação obrigatória.",
    sessionExpired: "Sessão expirada. Entre novamente.",
    adminSessionRequired: "Sessão de administrador obrigatória.",
    complianceSessionRequired: "Sessão de compliance obrigatória.",
    governanceSessionRequired: "Sessão de governança obrigatória.",
    auditSessionRequired: "Sessão de auditoria obrigatória.",
    investorSessionRequired:
      "Sessão de investidor obrigatória. Entre como investidor para usar este endpoint.",
    authApiNotFound:
      "API de autenticação não encontrada. Reinicie o backend Spring Boot (porta 8080) com o código mais recente.",
    backendNotFound:
      "Endpoint do backend não encontrado. Certifique-se de que o serviço de conformidade esteja em execução na porta 8080.",
    authenticationFailed: "Falha na solicitação de autenticação.",
    signOutFailed: "Não foi possível encerrar a sessão.",
    requestFailed: "Falha na solicitação.",
    documentForbidden: "Acesso a este documento é proibido."
  },
  common: {
    retry: "Tentar novamente",
    adminDashboard: "Painel administrativo",
    backHome: "Voltar ao início",
    brand: "RWA Compliance",
    footerStatusAuth: "Acesso seguro e fluxo de integração",
    footerStatusLive: "Plataforma de conformidade em produção",
    github: "GitHub",
    investorDashboard: "Painel do investidor",
    landing: "Início",
    signOut: "Sair"
  },
  footer: {
    copyright: "© 2026 RWA Compliance · Infraestrutura de tokenização regulada.",
    legalTitle: "Legal",
    privacy: "Política de privacidade",
    productLinks: [
      { href: "/login?next=%2Fdashboard&role=investor", label: "Portal do investidor" },
      { href: "/login?next=%2Fadmin&role=admin", label: "Console do emissor" },
      { href: "/register", label: "Criar conta" }
    ],
    productTitle: "Produto",
    resourceLinks: [
      { href: "/#how-to", label: "Como funciona" },
      { href: "/#use-cases", label: "Casos de uso" },
      { href: "/#tradeoffs", label: "Escopo de conformidade" }
    ],
    resourcesTitle: "Recursos",
    tagline:
      "Tokenização RWA permissionada alinhada à EU MiCA, GDPR e ERC-3643 — KYC/AML off-chain com aplicação de transferências on-chain.",
    terms: "Termos de uso"
  },
  legal: {
    privacy: {
      eyebrow: "Legal · GDPR",
      sections: [
        {
          title: "1. Escopo",
          body: "Esta política de privacidade descreve como a RWA Compliance trata dados pessoais quando você utiliza nossa plataforma de conformidade de ativos tokenizados. Aplica-se ao aplicativo web, à camada BFF e aos serviços de API de conformidade vinculados operados conforme a legislação aplicável de proteção de dados da UE e normas internacionais."
        },
        {
          title: "2. Dados que tratamos",
          body: "Podemos tratar identificadores de conta (e-mail, função), endereços de carteira opcionais, dados de verificação MFA, referências de documentos KYC/AML (hashes e metadados — não arquivos brutos de documentos, salvo upload explícito ao provedor configurado), cookies de sessão, registros de auditoria e telemetria operacional necessária para prestar serviços regulados de integração e ciclo de vida."
        },
        {
          title: "3. PII off-chain e provas on-chain",
          body: "Dados pessoais e documentos de origem permanecem off-chain por design. Apenas hashes criptográficos de documentos e o estado de elegibilidade do registro de identidade são sincronizados com a blockchain, em linha com a minimização de dados do GDPR e as práticas do setor de valores tokenizados."
        },
        {
          title: "4. Cookies, analytics e base legal",
          body: "Cookies de sessão estritamente necessários sustentam autenticação e segurança. Analytics opcional carrega apenas quando configurado pelo operador. O tratamento baseia-se na execução contratual, no interesse legítimo na segurança da plataforma e — quando exigido — no consentimento para cookies não essenciais."
        },
        {
          title: "5. Retenção, segurança e subprocessadores",
          body: "Os dados são retidos conforme a política de conformidade da sua organização e obrigações regulatórias. Aplicamos controles de acesso, criptografia em trânsito, limitação de taxa e eventos de auditoria imutáveis. Integrações de KYC, oráculos e custódia podem envolver subprocessadores avaliados sob acordos de tratamento de dados apropriados."
        },
        {
          title: "6. Seus direitos",
          body: "Conforme a jurisdição, você pode solicitar acesso, retificação, exclusão, restrição, portabilidade ou opor-se ao tratamento. Entre em contato com o controlador de dados ou operador da plataforma para exercer direitos do GDPR ou equivalentes."
        }
      ],
      title: "Política de privacidade",
      updated: "Última atualização: maio de 2026"
    },
    terms: {
      eyebrow: "Legal · Termos",
      sections: [
        {
          title: "1. Aceitação",
          body: "Ao acessar a RWA Compliance você concorda com estes termos. A plataforma fornece software para fluxos de trabalho de ativos tokenizados regulados. Não constitui assessoria de investimento, jurídica ou fiscal, nem substitui autorização das autoridades competentes quando exigida."
        },
        {
          title: "2. Uso permitido",
          body: "Você pode utilizar a plataforma para integração de investidores, revisão KYC/AML, operações do emissor e gestão do ciclo de vida de tokens permissionados em conformidade com regulamentação de valores mobiliários, AML e proteção de dados aplicável na sua jurisdição."
        },
        {
          title: "3. Contas, funções e segurança",
          body: "As funções de investidor e emissor são segregadas. Você é responsável por proteger credenciais, chaves de carteira, tokens de administrador e dispositivos MFA. Acessos não autorizados devem ser reportados ao operador imediatamente."
        },
        {
          title: "4. Conformidade regulatória",
          body: "Os emissores permanecem responsáveis por MiCA, legislação nacional de valores mobiliários, desenho do programa AML/KYC, documentação de prospecto ou oferta e adequação do investidor. A plataforma apoia controles operacionais — não aprovação regulatória em seu nome."
        },
        {
          title: "5. Disponibilidade do serviço",
          body: "Software, contratos inteligentes e integrações de terceiros são fornecidos com cuidado comercialmente razoável. Finalidade em blockchain, feeds de oráculos e provedores KYC externos dependem de condições de rede e fornecedores fora do nosso controle direto."
        },
        {
          title: "6. Responsabilidade e alterações",
          body: "A responsabilidade é limitada na medida permitida por lei. Os termos podem ser atualizados para refletir mudanças regulatórias ou de produto; o uso continuado após aviso constitui aceitação dos termos revisados."
        }
      ],
      title: "Termos de uso",
      updated: "Última atualização: maio de 2026"
    }
  },
  landing: {
    navProduct: "Produto",
    navUseCases: "Casos de uso",
    navHowTo: "Como funciona",
    navPlatform: "Plataforma",
    navTrust: "Confiança",
    adminCta: "Console do emissor",
    analyticsDisabled: "Analytics desabilitado até que NEXT_PUBLIC_GA_MEASUREMENT_ID seja configurado.",
    analyticsEnabled: "Analytics consciente da privacidade habilitado para insights do produto.",
    architectureBody:
      "Um único grafo de conformidade da integração do investidor às operações do emissor — APIs, trilhas de auditoria e aplicação on-chain permanecem alinhadas para programas de valores tokenizados preparados para MiCA.",
    architectureKicker: "Arquitetura",
    architecturePillars: [
      {
        title: "Frontend",
        description: "BFF Next.js, Wagmi, KYC vinculado à sessão, dashboards de investidor e emissor"
      },
      {
        title: "Backend",
        description: "API de conformidade Spring Boot, hash de documentos, gateways Web3j (legado + T-REX)"
      },
      {
        title: "Blockchain",
        description: "Token permissionado e registro de identidade — regras de transferência on-chain"
      }
    ],
    architectureItems: [
      "KYC vinculado à carteira com integridade de sessão BFF",
      "Filas do emissor com comprovantes de aprovação on-chain",
      "Registro legado e gateways ERC-3643 / T-REX"
    ],
    architectureTitle: "Stack híbrida: experiência, API de conformidade e aplicação on-chain",
    ctaBody:
      "Percorra o caminho do investidor, aprove KYC no console do emissor e rastreie elegibilidade do hash do documento ao registro on-chain — em uma interface regulada.",
    ctaPrimary: "Portal do investidor",
    ctaSecondary: "Console do emissor",
    ctaTitle: "Pronto para operar um programa de tokenização em conformidade?",
    featureKicker: "Capacidades",
    features: [
      {
        title: "Identidade e acesso",
        description:
          "Sessões protegidas por MFA, vinculação opcional de carteira e roteamento por função — superfícies de investidor e emissor permanecem segregadas."
      },
      {
        title: "KYC e elegibilidade",
        description:
          "Referências de documentos alinhadas a AML com hash off-chain; status em tempo real, motivos de rejeição e links do explorador quando aprovado on-chain."
      },
      {
        title: "Operações do ciclo de vida",
        description:
          "Subscrições, resgates, cotações de taxas e contexto de portfólio em um workspace — bloqueado até a identidade ser verificada."
      },
      {
        title: "Controles de conformidade",
        description:
          "Regras por ativo, eventos de auditoria, pausa/retomada e monitoramento de transações blockchain para operações do emissor."
      }
    ],
    featuresIntro:
      "Ferramentas operacionais para programas RWA permissionados — da integração regulada às barreiras de transferência on-chain.",
    featuresTitle: "Projetado para emissão regulada de ativos",
    heroBadge: "ERC-3643 · MiCA · GDPR · AML/KYC",
    heroSubtext:
      "Projetado para emissores da UE e internacionais: estados de conformidade explícitos, minimização de dados e sem PII bruto on-chain — apenas hashes e provas de registro.",
    investorCta: "Portal do investidor",
    joinCta: "Cadastrar-se",
    loginCta: "Entrar",
    previewCards: [
      {
        title: "Autenticar e vincular carteira",
        description: "Sessão segura, MFA e integridade KYC vinculada à carteira via cabeçalhos BFF."
      },
      {
        title: "Enviar e acompanhar KYC",
        description: "Integração somente por referência com status AML em tempo real até aprovar ou rejeitar."
      },
      {
        title: "Operar com barreiras",
        description: "Subscrever, resgatar e transferir apenas quando regras de conformidade e estado do registro permitirem."
      }
    ],
    previewLabel: "Fluxo de conformidade",
    productTour: "Ver como funciona",
    securityItems: [
      {
        title: "PII off-chain, provas on-chain",
        description: "Hash de documentos mantém dados sensíveis fora do ledger; apenas hashes e elegibilidade do registro sincronizam on-chain."
      },
      {
        title: "Estados de conformidade previsíveis",
        description: "Estados pendente, aprovado, rejeitado e de falha on-chain usam linguagem operacional consistente."
      },
      {
        title: "Resiliência operacional",
        description: "Nova tentativa BFF em indisponibilidade da API, limites de taxa e padrões de autorização do emissor para disponibilidade em produção."
      }
    ],
    securityIntro:
      "Padrões de segurança e UX alinhados a plataformas de tokenização regulada — clareza primeiro, aplicação on-chain.",
    securityTitle: "Confiança por design",
    stats: [
      { value: "MiCA", label: "Alinhamento UE" },
      { value: "ERC-3643", label: "valor tokenizado" },
      { value: "0", label: "PII on-chain" }
    ],
    steps: [
      {
        title: "Criar conta e entrar",
        description: "Cadastre-se com MFA, selecione a função de investidor ou emissor e acesse o workspace seguro."
      },
      {
        title: "Concluir revisão de conformidade",
        description: "Envie uma referência de documento; o emissor aprova; o registro de identidade reflete a elegibilidade."
      },
      {
        title: "Executar o ciclo de vida do ativo",
        description: "Subscreva, resgate e monitore posições com taxas e evidência de auditoria à vista."
      }
    ],
    stepsIntro: "Três etapas conectadas — sem lacunas entre integração e aplicação on-chain.",
    stepsTitle: "Jornada de ponta a ponta",
    subtitle:
      "Tokenização de ativos do mundo real permissionada com KYC/AML off-chain e regras de transferência on-chain — infraestrutura de conformidade de nível produtivo.",
    title: "Infraestrutura de conformidade",
    titleAccent: "para ativos do mundo real tokenizados",
    trustLabels: [
      "Orientado a MiCA",
      "Minimização de dados GDPR",
      "ERC-3643 / T-REX",
      "Trilha de auditoria",
      "Vinculação de carteira"
    ],
    trustTitle: "Alinhado à regulamentação de valores tokenizados da UE e internacional",
    useCasesIntro: "Três atores principais — cada um com um resultado claro no mesmo grafo de conformidade.",
    useCasesTitle: "Para quem é",
    useCases: [
      {
        title: "Emissores e administradores",
        description:
          "Aprove KYC, configure regras de ativos, pause transferências e monitore comprovantes on-chain em uma sala de controle."
      },
      {
        title: "Investidores",
        description:
          "Cadastre-se, vincule uma carteira, acompanhe o status AML e opere subscrições ou resgates quando verificado."
      },
      {
        title: "Conformidade e operações",
        description:
          "Audite hashes de documentos, estados de elegibilidade, transações blockchain e eventos do ciclo de vida sem PII bruto on-chain."
      }
    ],
    howToIntro: "Um caminho operacional padrão do cadastro à elegibilidade on-chain.",
    howToTitle: "Como funciona",
    howToSteps: [
      {
        title: "Cadastrar-se ou entrar",
        description: "Selecione a função de investidor ou emissor e conclua MFA conforme exigido pela sua organização."
      },
      {
        title: "Vincular carteira e enviar KYC",
        description: "Investidores anexam uma carteira e enviam referência de documento; o status atualiza até o estado final."
      },
      {
        title: "Aprovar no console do emissor",
        description: "A equipe de conformidade revisa a fila, aprova a identidade e confirma o registro on-chain."
      },
      {
        title: "Operar o ciclo de vida",
        description: "Subscrever, resgatar ou pausar — bloqueado pela mesma elegibilidade aplicada pelo valor tokenizado."
      }
    ],
    tradeoffsIntro: "Escopo transparente — pontos fortes da plataforma e considerações de implantação.",
    tradeoffsTitle: "Escopo de conformidade",
    tradeoffsStrengths: [
      "Rastreabilidade de ponta a ponta do hash KYC à prova de registro",
      "Duplo gateway blockchain (registro legado + ERC-3643 / T-REX)",
      "UX clara para pendente, aprovado, rejeitado e erros on-chain",
      "Integridade de sessão BFF com cabeçalho KYC vinculado à carteira"
    ],
    tradeoffsLimits: [
      "Revisão jurídica específica por jurisdição permanece obrigatória",
      "Provedores externos KYC/AML e de oráculos configurados por implantação",
      "Rede on-chain e modelo de custódia escolhidos pelo emissor",
      "Autorização regulatória é responsabilidade do emissor"
    ],
    moreFeaturesIntro: "Capacidades estendidas na stack de conformidade integrada.",
    moreFeaturesTitle: "Capacidades da plataforma",
    moreFeatures: [
      { title: "Gráfico de portfólio", description: "Visão de desempenho para investidores verificados." },
      { title: "Cotações de taxas", description: "Taxas de subscrição e resgate exibidas antes do envio." },
      { title: "Pausa / retomada", description: "Disjuntor do emissor espelhado on-chain." },
      { title: "Feed de auditoria", description: "Eventos operacionais com linguagem de status de conformidade consistente." },
      { title: "Resiliência de API", description: "Nova tentativa BFF quando a API de conformidade está temporariamente indisponível." },
      { title: "Links do explorador", description: "Verificação de comprovantes on-chain após aprovação do registro." }
    ]
  },
  login: {
    admin: "Administrador",
    connectWallet: "Conectar MetaMask",
    connectingWallet: "Conectando carteira...",
    genericError: "Não foi possível entrar. Tente novamente.",
    highlights: [
      {
        title: "Escolha a função correta",
        description: "O fluxo adapta a próxima etapa para acesso de investidor ou emissor."
      },
      {
        title: "Use o método adequado",
        description: "E-mail, OAuth e acesso por carteira permanecem visíveis no mesmo contexto seguro."
      },
      {
        title: "Entre com confiança",
        description: "MFA é a etapa final de segurança antes de acessar workspaces regulados."
      }
    ],
    highlightsTitle: "Acesso seguro",
    invalidEmail: "Informe um e-mail válido para continuar.",
    invalidMfa: "Informe um código MFA de 6 dígitos.",
    invalidWallet: "Informe um endereço EVM válido.",
    investor: "Investidor",
    mfa: "Código MFA",
    mfaHelp: "Informe o código de uso único do seu autenticador ou da política da organização.",
    mfaPlaceholder: "123456",
    provider: "Método de acesso",
    providerEmailDescription: "Entre com seu e-mail cadastrado e MFA.",
    providerEmailTitle: "E-mail",
    providerGoogleDescription: "OAuth empresarial quando Google Workspace está configurado.",
    providerGoogleTitle: "Google",
    providerHelp: "Escolha o método aprovado pela sua organização.",
    providerWalletDescription: "Use um endereço EVM verificado e conecte sua carteira.",
    providerWalletTitle: "Carteira",
    registeredBody: "Sua conta está pronta. Entre com o mesmo e-mail para continuar.",
    registeredTitle: "Cadastro concluído",
    registerHint: "Ainda não tem conta?",
    registerLink: "Criar conta",
    role: "Função",
    roleHelp: "A função selecionada define o destino padrão após a autenticação.",
    submit: "Entrar",
    submitting: "Entrando...",
    subjectEmailHelp: "Use seu e-mail corporativo cadastrado.",
    subjectEmailLabel: "E-mail",
    subjectEmailPlaceholder: "voce@empresa.com",
    subjectWalletHelp: "Conecte uma carteira ou informe o endereço manualmente.",
    subjectWalletLabel: "Endereço da carteira",
    subjectWalletPlaceholder: "0x...",
    subtitle: "Entrada segura para workspaces regulados de investidor e emissor.",
    title: "Acessar a plataforma",
    walletUnavailable: "Nenhum conector de carteira disponível neste navegador."
  },
  register: {
    admin: "Administrador",
    alreadyHaveAccount: "Já tenho conta",
    confirmPassword: "Confirmar senha",
    confirmPasswordPlaceholder: "Repita sua senha",
    email: "E-mail",
    emailPlaceholder: "voce@empresa.com",
    highlights: [
      {
        title: "Cadastro guiado",
        description: "Campos, mensagens e validação alinhados à integração de conformidade."
      },
      {
        title: "Segurança visível",
        description: "Força e requisitos da senha são exibidos antes do envio."
      },
      {
        title: "Pronto para entrar",
        description: "Após o cadastro você acessa o workspace com sessão segura ativa."
      }
    ],
    highlightsTitle: "Integração regulada",
    invalidEmail: "Informe um endereço de e-mail válido.",
    investor: "Investidor",
    loginLink: "Ir para entrar",
    noteText:
      "O cadastro cria uma conta segura para o programa de ativos tokenizados da sua organização.",
    password: "Senha",
    passwordCheckLength: "Pelo menos 8 caracteres",
    passwordCheckNumber: "Pelo menos um número",
    passwordCheckSpecial: "Caractere especial (opcional, reforço adicional)",
    passwordCheckUppercase: "Pelo menos uma letra maiúscula",
    passwordHelp: "A senha deve conter 8 caracteres, uma letra maiúscula e um número.",
    passwordMismatch: "As senhas não coincidem.",
    passwordPlaceholder: "Crie uma senha segura",
    passwordStrength: "Força da senha",
    role: "Função",
    roleHelp: "Defina o workspace regulado principal que este usuário deve acessar.",
    strengthFair: "Razoável",
    strengthGood: "Boa",
    strengthStrong: "Forte",
    strengthWeak: "Fraca",
    submit: "Criar conta",
    submitError: "Não foi possível criar a conta. Tente novamente.",
    submitting: "Criando conta...",
    subtitle: "Crie uma conta segura para acesso de investidor ou emissor.",
    successAction: "Ir ao workspace",
    successBody: "Sua sessão está ativa. Continue ao painel sem entrar novamente.",
    successTitle: "Conta criada — sessão iniciada",
    title: "Criar uma conta",
    walletAddress: "Carteira (opcional)",
    walletHelp: "Vincule opcionalmente um endereço EVM para entrada por carteira e vinculação KYC.",
    walletInvalid: "Informe um endereço EVM válido ou deixe o campo vazio.",
    walletPlaceholder: "0x..."
  },
  workspace: {
    admin: {
      heroDescription:
        "Opere a superfície do emissor com visão operacional em aprovações de identidade, filas de subscrição e resgate, regras de conformidade, feeds e monitoramento on-chain.",
      heroEyebrow: "Operações do emissor",
      heroTitle:
        "Um painel unificado para decisões de conformidade, configuração de ativos e salvaguardas on-chain",
      topbarSubtitle:
        "Fila KYC · aprovações de identidade · operações de ciclo de vida · evidências de auditoria",
      topbarTitle: "Admin / Sala de controle do emissor"
    },
    investor: {
      heroDescription:
        "Conecte uma carteira, conclua o KYC e gerencie subscrições, resgates e posições em um workspace regulado.",
      heroEyebrow: "Workspace do investidor",
      heroTitle: "Portfólio, elegibilidade e ações de ciclo de vida em um só lugar",
      topbarSubtitle:
        "Rede {chainName} {chainId} · elegibilidade off-chain · proteção de transferência on-chain",
      topbarTitle: "Investidor / Workspace de portfólio"
    }
  }
} as const;
