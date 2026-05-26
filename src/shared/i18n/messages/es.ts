export const es = {
  nav: {
    primary: "Navegación principal",
    home: "Inicio",
    signIn: "Iniciar sesión",
    signUp: "Crear cuenta",
    terms: "Términos de uso",
    privacy: "Política de privacidad",
    useCases: "Casos de uso",
    product: "Producto",
    howItWorks: "Cómo funciona",
    platform: "Plataforma",
    trust: "Confianza",
    language: "Idioma",
    openMenu: "Abrir menú"
  },
  wallet: {
    connect: "Conectar billetera",
    connecting: "Conectando billetera...",
    switchToChain: "Cambiar a {chainName}",
    disconnectedNotice:
      "Billetera desconectada. Aún puede pegar una dirección de billetera para comprobar el estado en la API.",
    noWalletFound: "No se encontró ninguna billetera inyectada. Instale o habilite una billetera del navegador para continuar.",
    noConnector: "No hay ningún conector de billetera inyectado disponible.",
    connectionFailed: "Error al conectar la billetera.",
    manualMode: "Modo de billetera manual"
  },
  errors: {
    apiUnavailable:
      "La API de cumplimiento no está disponible temporalmente. Asegúrese de que el backend Spring Boot esté en ejecución e inténtelo de nuevo.",
    authRequired: "Se requiere autenticación.",
    sessionExpired: "Sesión expirada. Inicie sesión de nuevo.",
    adminSessionRequired: "Se requiere sesión de administrador.",
    investorSessionRequired:
      "Se requiere sesión de inversor. Inicie sesión como inversor para usar este punto de acceso.",
    authApiNotFound:
      "API de autenticación no encontrada. Reinicie el backend Spring Boot (puerto 8080) con el código más reciente.",
    backendNotFound:
      "Punto de acceso del backend no encontrado. Asegúrese de que el servicio de cumplimiento esté en ejecución en el puerto 8080.",
    authenticationFailed: "Error en la solicitud de autenticación.",
    signOutFailed: "No se pudo cerrar la sesión.",
    requestFailed: "Error en la solicitud."
  },
  common: {
    adminDashboard: "Panel de administración",
    backHome: "Volver al inicio",
    brand: "RWA Compliance",
    footerStatusAuth: "Acceso seguro y flujo de incorporación",
    footerStatusLive: "Plataforma de cumplimiento en producción",
    github: "GitHub",
    investorDashboard: "Panel del inversor",
    landing: "Inicio",
    signOut: "Cerrar sesión"
  },
  footer: {
    copyright: "© 2026 RWA Compliance · Infraestructura de tokenización regulada.",
    legalTitle: "Legal",
    privacy: "Política de privacidad",
    productLinks: [
      { href: "/login?next=%2Fdashboard&role=investor", label: "Portal del inversor" },
      { href: "/login?next=%2Fadmin&role=admin", label: "Consola del emisor" },
      { href: "/register", label: "Crear cuenta" }
    ],
    productTitle: "Producto",
    resourceLinks: [
      { href: "/#how-to", label: "Cómo funciona" },
      { href: "/#use-cases", label: "Casos de uso" },
      { href: "/#tradeoffs", label: "Alcance de cumplimiento" }
    ],
    resourcesTitle: "Recursos",
    tagline:
      "Tokenización RWA con permisos alineada con EU MiCA, GDPR y ERC-3643 — KYC/AML fuera de cadena con aplicación de transferencias en cadena.",
    terms: "Términos de uso"
  },
  legal: {
    privacy: {
      eyebrow: "Legal · GDPR",
      sections: [
        {
          title: "1. Ámbito",
          body: "Esta política de privacidad describe cómo RWA Compliance trata los datos personales cuando utiliza nuestra plataforma de cumplimiento de activos tokenizados. Se aplica a la aplicación web, la capa BFF y los servicios de API de cumplimiento vinculados operados conforme a la legislación aplicable de protección de datos de la UE y normativa internacional."
        },
        {
          title: "2. Datos que tratamos",
          body: "Podemos tratar identificadores de cuenta (correo electrónico, rol), direcciones de billetera opcionales, datos de verificación MFA, referencias de documentos KYC/AML (hashes y metadatos — no archivos de documentos en bruto salvo que se carguen explícitamente en su proveedor configurado), cookies de sesión, registros de auditoría y telemetría operativa necesaria para prestar servicios regulados de incorporación y ciclo de vida."
        },
        {
          title: "3. PII fuera de cadena y pruebas en cadena",
          body: "Los datos personales y los documentos fuente permanecen fuera de cadena por diseño. Solo los hashes criptográficos de documentos y el estado de elegibilidad del registro de identidad se sincronizan con la blockchain, en línea con la minimización de datos del GDPR y las prácticas del sector de valores tokenizados."
        },
        {
          title: "4. Cookies, analítica y base legal",
          body: "Las cookies de sesión estrictamente necesarias respaldan la autenticación y la seguridad. La analítica opcional se carga solo cuando el operador la configura. El tratamiento se basa en la ejecución del contrato, el interés legítimo en la seguridad de la plataforma y — cuando proceda — el consentimiento para cookies no esenciales."
        },
        {
          title: "5. Conservación, seguridad y encargados",
          body: "Los datos se conservan según la política de cumplimiento de su organización y las obligaciones regulatorias. Aplicamos controles de acceso, cifrado en tránsito, limitación de velocidad y eventos de auditoría inmutables. Las integraciones de KYC, oráculos y custodia pueden implicar encargados del tratamiento evaluados bajo acuerdos de tratamiento de datos apropiados."
        },
        {
          title: "6. Sus derechos",
          body: "Según su jurisdicción, puede solicitar acceso, rectificación, supresión, limitación, portabilidad u oponerse al tratamiento. Contacte con su responsable del tratamiento u operador de la plataforma para ejercer los derechos del GDPR o equivalentes."
        }
      ],
      title: "Política de privacidad",
      updated: "Última actualización: mayo de 2026"
    },
    terms: {
      eyebrow: "Legal · Términos",
      sections: [
        {
          title: "1. Aceptación",
          body: "Al acceder a RWA Compliance acepta estos términos. La plataforma proporciona software para flujos de trabajo de activos tokenizados regulados. No constituye asesoramiento de inversión, legal o fiscal, ni sustituye la autorización de las autoridades competentes cuando sea requerida."
        },
        {
          title: "2. Uso permitido",
          body: "Puede utilizar la plataforma para la incorporación de inversores, revisión KYC/AML, operaciones del emisor y gestión del ciclo de vida de tokens con permisos conforme a la normativa de valores, AML y protección de datos aplicable en su jurisdicción."
        },
        {
          title: "3. Cuentas, roles y seguridad",
          body: "Los roles de inversor y emisor están segregados. Usted es responsable de salvaguardar credenciales, claves de billetera, tokens de administrador y dispositivos MFA. Debe informar de accesos no autorizados a su operador de inmediato."
        },
        {
          title: "4. Cumplimiento normativo",
          body: "Los emisores siguen siendo responsables de MiCA, la legislación nacional de valores, el diseño del programa AML/KYC, la documentación de prospecto u oferta y la idoneidad del inversor. La plataforma respalda controles operativos — no la aprobación regulatoria en su nombre."
        },
        {
          title: "5. Disponibilidad del servicio",
          body: "El software, los contratos inteligentes y las integraciones de terceros se proporcionan con el cuidado comercialmente razonable. La finalidad en blockchain, los feeds de oráculos y los proveedores KYC externos dependen de condiciones de red y proveedores fuera de nuestro control directo."
        },
        {
          title: "6. Responsabilidad y cambios",
          body: "La responsabilidad se limita en la medida permitida por la ley. Los términos pueden actualizarse para reflejar cambios regulatorios o de producto; el uso continuado tras el aviso constituye la aceptación de los términos revisados."
        }
      ],
      title: "Términos de uso",
      updated: "Última actualización: mayo de 2026"
    }
  },
  landing: {
    navProduct: "Producto",
    navUseCases: "Casos de uso",
    navHowTo: "Cómo funciona",
    navPlatform: "Plataforma",
    navTrust: "Confianza",
    adminCta: "Consola del emisor",
    analyticsDisabled: "Analítica deshabilitada hasta que se configure NEXT_PUBLIC_GA_MEASUREMENT_ID.",
    analyticsEnabled: "Analítica respetuosa de la privacidad habilitada para información del producto.",
    architectureBody:
      "Un único grafo de cumplimiento desde la incorporación del inversor hasta las operaciones del emisor — las API, las pistas de auditoría y la aplicación en cadena permanecen alineadas para programas de valores tokenizados preparados para MiCA.",
    architectureKicker: "Arquitectura",
    architecturePillars: [
      {
        title: "Frontend",
        description: "BFF Next.js, Wagmi, KYC vinculado a sesión, paneles de inversor y emisor"
      },
      {
        title: "Backend",
        description: "API de cumplimiento Spring Boot, hash de documentos, gateways Web3j (heredado + T-REX)"
      },
      {
        title: "Blockchain",
        description: "Token permissionado y registro de identidad — reglas de transferencia en cadena"
      }
    ],
    architectureItems: [
      "KYC vinculado a billetera con integridad de sesión BFF",
      "Colas del emisor con comprobantes de aprobación en cadena",
      "Registro heredado y pasarelas ERC-3643 / T-REX"
    ],
    architectureTitle: "Pila híbrida: experiencia, API de cumplimiento y aplicación en cadena",
    ctaBody:
      "Recorra la ruta del inversor, apruebe KYC en la consola del emisor y trace la elegibilidad desde el hash del documento hasta el registro en cadena — en una interfaz regulada.",
    ctaPrimary: "Portal del inversor",
    ctaSecondary: "Consola del emisor",
    ctaTitle: "¿Listo para operar un programa de tokenización conforme?",
    featureKicker: "Capacidades",
    features: [
      {
        title: "Identidad y acceso",
        description:
          "Sesiones protegidas con MFA, vinculación opcional de billetera y enrutamiento por rol — las superficies de inversor y emisor permanecen segregadas."
      },
      {
        title: "KYC y elegibilidad",
        description:
          "Referencias de documentos alineadas con AML hasheadas fuera de cadena; estado en vivo, motivos de rechazo y enlaces al explorador cuando se aprueba en cadena."
      },
      {
        title: "Operaciones del ciclo de vida",
        description:
          "Suscripciones, reembolsos, cotizaciones de comisiones y contexto de cartera en un espacio de trabajo — restringido hasta que la identidad esté verificada."
      },
      {
        title: "Controles de cumplimiento",
        description:
          "Reglas por activo, eventos de auditoría, pausa/reanudación y supervisión de transacciones blockchain para operaciones del emisor."
      }
    ],
    featuresIntro:
      "Herramientas operativas para programas RWA con permisos — desde la incorporación regulada hasta las barreras de transferencia en cadena.",
    featuresTitle: "Diseñado para emisión regulada de activos",
    heroBadge: "ERC-3643 · MiCA · GDPR · AML/KYC",
    heroSubtext:
      "Diseñado para emisores de la UE e internacionales: estados de cumplimiento explícitos, minimización de datos y sin PII en bruto en cadena — solo hashes y pruebas de registro.",
    investorCta: "Portal del inversor",
    joinCta: "Registrarse",
    loginCta: "Iniciar sesión",
    previewCards: [
      {
        title: "Autenticar y vincular billetera",
        description: "Sesión segura, MFA e integridad KYC vinculada a billetera mediante cabeceras BFF."
      },
      {
        title: "Enviar y seguir KYC",
        description: "Incorporación solo por referencia con estado AML en vivo hasta aprobar o rechazar."
      },
      {
        title: "Operar con barreras",
        description: "Suscribir, reembolsar y transferir solo cuando las reglas de cumplimiento y el estado del registro lo permitan."
      }
    ],
    previewLabel: "Flujo de cumplimiento",
    productTour: "Ver cómo funciona",
    securityItems: [
      {
        title: "PII fuera de cadena, pruebas en cadena",
        description: "El hash de documentos mantiene los datos sensibles fuera del libro mayor; solo hashes y elegibilidad del registro se sincronizan en cadena."
      },
      {
        title: "Estados de cumplimiento predecibles",
        description: "Los estados pendiente, aprobado, rechazado y de fallo en cadena usan un lenguaje operativo coherente."
      },
      {
        title: "Resiliencia operativa",
        description: "Reintento BFF ante caídas de API, límites de velocidad y patrones de autorización del emisor para disponibilidad en producción."
      }
    ],
    securityIntro:
      "Patrones de seguridad y UX alineados con plataformas de tokenización regulada — claridad primero, aplicación en cadena.",
    securityTitle: "Confianza por diseño",
    stats: [
      { value: "MiCA", label: "Alineación UE" },
      { value: "ERC-3643", label: "valor tokenizado" },
      { value: "0", label: "PII en cadena" }
    ],
    steps: [
      {
        title: "Crear cuenta e iniciar sesión",
        description: "Regístrese con MFA, seleccione el rol de inversor o emisor y acceda al espacio de trabajo seguro."
      },
      {
        title: "Completar revisión de cumplimiento",
        description: "Envíe una referencia de documento; el emisor aprueba; el registro de identidad refleja la elegibilidad."
      },
      {
        title: "Ejecutar el ciclo de vida del activo",
        description: "Suscríbase, reembolse y supervise posiciones con comisiones y evidencia de auditoría a la vista."
      }
    ],
    stepsIntro: "Tres etapas conectadas — sin brechas entre la incorporación y la aplicación en cadena.",
    stepsTitle: "Recorrido de extremo a extremo",
    subtitle:
      "Tokenización de activos del mundo real con permisos, KYC/AML fuera de cadena y reglas de transferencia en cadena — infraestructura de cumplimiento de grado productivo.",
    title: "Infraestructura de cumplimiento",
    titleAccent: "para activos del mundo real tokenizados",
    trustLabels: [
      "Orientado a MiCA",
      "Minimización de datos GDPR",
      "ERC-3643 / T-REX",
      "Pista de auditoría",
      "Vinculación de billetera"
    ],
    trustTitle: "Alineado con la regulación de valores tokenizados de la UE e internacional",
    useCasesIntro: "Tres actores principales — cada uno con un resultado claro en el mismo grafo de cumplimiento.",
    useCasesTitle: "Para quién es",
    useCases: [
      {
        title: "Emisores y administradores",
        description:
          "Apruebe KYC, configure reglas de activos, pause transferencias y supervise comprobantes en cadena desde una sala de control."
      },
      {
        title: "Inversores",
        description:
          "Regístrese, vincule una billetera, siga el estado AML y opere suscripciones o reembolsos cuando esté verificado."
      },
      {
        title: "Cumplimiento y operaciones",
        description:
          "Audite hashes de documentos, estados de elegibilidad, transacciones blockchain y eventos del ciclo de vida sin PII en bruto en cadena."
      }
    ],
    howToIntro: "Un recorrido operativo estándar desde el registro hasta la elegibilidad en cadena.",
    howToTitle: "Cómo funciona",
    howToSteps: [
      {
        title: "Registrarse o iniciar sesión",
        description: "Seleccione el rol de inversor o emisor y complete MFA según lo exija su organización."
      },
      {
        title: "Vincular billetera y enviar KYC",
        description: "Los inversores adjuntan una billetera y envían una referencia de documento; el estado se actualiza hasta el estado final."
      },
      {
        title: "Aprobar en la consola del emisor",
        description: "El equipo de cumplimiento revisa la cola, aprueba la identidad y confirma el registro en cadena."
      },
      {
        title: "Operar el ciclo de vida",
        description: "Suscribir, reembolsar o pausar — restringido por la misma elegibilidad aplicada por el valor tokenizado."
      }
    ],
    tradeoffsIntro: "Alcance transparente — fortalezas de la plataforma y consideraciones de despliegue.",
    tradeoffsTitle: "Alcance de cumplimiento",
    tradeoffsStrengths: [
      "Trazabilidad de extremo a extremo desde el hash KYC hasta la prueba de registro",
      "Doble pasarela blockchain (registro heredado + ERC-3643 / T-REX)",
      "UX clara para pendiente, aprobado, rechazado y errores en cadena",
      "Integridad de sesión BFF con cabecera KYC vinculada a billetera"
    ],
    tradeoffsLimits: [
      "La revisión legal específica por jurisdicción sigue siendo obligatoria",
      "Proveedores externos KYC/AML y de oráculos configurados por despliegue",
      "Red en cadena y modelo de custodia elegidos por el emisor",
      "La autorización regulatoria es responsabilidad del emisor"
    ],
    moreFeaturesIntro: "Capacidades ampliadas en la pila de cumplimiento integrada.",
    moreFeaturesTitle: "Capacidades de la plataforma",
    moreFeatures: [
      { title: "Gráfico de cartera", description: "Vista de rendimiento para inversores verificados." },
      { title: "Cotizaciones de comisiones", description: "Comisiones de suscripción y reembolso mostradas antes del envío." },
      { title: "Pausa / reanudación", description: "Cortacircuitos del emisor reflejado en cadena." },
      { title: "Feed de auditoría", description: "Eventos operativos con lenguaje de estado de cumplimiento coherente." },
      { title: "Resiliencia de API", description: "Reintento BFF cuando la API de cumplimiento no está disponible temporalmente." },
      { title: "Enlaces al explorador", description: "Verificación de comprobantes en cadena tras la aprobación del registro." }
    ]
  },
  login: {
    admin: "Administrador",
    connectWallet: "Conectar MetaMask",
    connectingWallet: "Conectando billetera...",
    genericError: "No se pudo iniciar sesión. Inténtelo de nuevo.",
    highlights: [
      {
        title: "Elija el rol correcto",
        description: "El flujo adapta el siguiente paso para acceso de inversor o emisor."
      },
      {
        title: "Use el método adecuado",
        description: "Correo electrónico, OAuth y acceso por billetera permanecen visibles en el mismo contexto seguro."
      },
      {
        title: "Inicie sesión con confianza",
        description: "MFA es el paso final de seguridad antes de entrar en espacios de trabajo regulados."
      }
    ],
    highlightsTitle: "Acceso seguro",
    invalidEmail: "Introduzca un correo electrónico válido para continuar.",
    invalidMfa: "Introduzca un código MFA de 6 dígitos.",
    invalidWallet: "Introduzca una dirección EVM válida.",
    investor: "Inversor",
    mfa: "Código MFA",
    mfaHelp: "Introduzca el código de un solo uso de su autenticador o la política de su organización.",
    mfaPlaceholder: "123456",
    provider: "Método de acceso",
    providerEmailDescription: "Inicie sesión con su correo registrado y MFA.",
    providerEmailTitle: "Correo electrónico",
    providerGoogleDescription: "OAuth empresarial cuando Google Workspace está configurado.",
    providerGoogleTitle: "Google",
    providerHelp: "Elija el método aprobado por su organización.",
    providerWalletDescription: "Utilice una dirección EVM verificada y conecte su billetera.",
    providerWalletTitle: "Billetera",
    registeredBody: "Su cuenta está lista. Inicie sesión con el mismo correo para continuar.",
    registeredTitle: "Registro completado",
    registerHint: "¿Aún no tiene cuenta?",
    registerLink: "Crear cuenta",
    role: "Rol",
    roleHelp: "El rol seleccionado define el destino predeterminado tras la autenticación.",
    submit: "Iniciar sesión",
    submitting: "Iniciando sesión...",
    subjectEmailHelp: "Utilice su correo electrónico laboral registrado.",
    subjectEmailLabel: "Correo electrónico",
    subjectEmailPlaceholder: "usted@empresa.com",
    subjectWalletHelp: "Conecte una billetera o introduzca la dirección manualmente.",
    subjectWalletLabel: "Dirección de billetera",
    subjectWalletPlaceholder: "0x...",
    subtitle: "Inicio de sesión seguro para espacios de trabajo regulados de inversor y emisor.",
    title: "Acceder a la plataforma",
    walletUnavailable: "No hay conector de billetera disponible en este navegador."
  },
  register: {
    admin: "Administrador",
    alreadyHaveAccount: "Ya tengo cuenta",
    confirmPassword: "Confirmar contraseña",
    confirmPasswordPlaceholder: "Repita su contraseña",
    email: "Correo electrónico",
    emailPlaceholder: "usted@empresa.com",
    highlights: [
      {
        title: "Registro guiado",
        description: "Campos, mensajes y validación alineados con la incorporación de cumplimiento."
      },
      {
        title: "Seguridad visible",
        description: "La fortaleza y los requisitos de la contraseña se muestran antes del envío."
      },
      {
        title: "Listo para iniciar sesión",
        description: "Tras el registro accede al espacio de trabajo con una sesión segura activa."
      }
    ],
    highlightsTitle: "Incorporación regulada",
    invalidEmail: "Introduzca una dirección de correo electrónico válida.",
    investor: "Inversor",
    loginLink: "Ir a iniciar sesión",
    noteText:
      "El registro crea una cuenta segura para el programa de activos tokenizados de su organización.",
    password: "Contraseña",
    passwordCheckLength: "Al menos 8 caracteres",
    passwordCheckNumber: "Al menos un número",
    passwordCheckSpecial: "Carácter especial (opcional, refuerzo adicional)",
    passwordCheckUppercase: "Al menos una letra mayúscula",
    passwordHelp: "La contraseña debe contener 8 caracteres, una letra mayúscula y un número.",
    passwordMismatch: "Las contraseñas no coinciden.",
    passwordPlaceholder: "Cree una contraseña segura",
    passwordStrength: "Fortaleza de la contraseña",
    role: "Rol",
    roleHelp: "Defina el espacio de trabajo regulado principal al que debe acceder este usuario.",
    strengthFair: "Aceptable",
    strengthGood: "Buena",
    strengthStrong: "Fuerte",
    strengthWeak: "Débil",
    submit: "Crear cuenta",
    submitError: "No se pudo crear la cuenta. Inténtelo de nuevo.",
    submitting: "Creando cuenta...",
    subtitle: "Cree una cuenta segura para acceso de inversor o emisor.",
    successAction: "Ir al espacio de trabajo",
    successBody: "Su sesión está activa. Continúe al panel sin iniciar sesión de nuevo.",
    successTitle: "Cuenta creada — sesión iniciada",
    title: "Crear una cuenta",
    walletAddress: "Billetera (opcional)",
    walletHelp: "Vincule opcionalmente una dirección EVM para inicio de sesión por billetera y vinculación KYC.",
    walletInvalid: "Introduzca una dirección EVM válida o deje el campo vacío.",
    walletPlaceholder: "0x..."
  },
  workspace: {
    admin: {
      heroDescription:
        "Gestione la superficie del emisor con visión operativa en aprobaciones de identidad, colas de suscripción y rescate, reglas de cumplimiento, feeds y monitoreo en cadena.",
      heroEyebrow: "Operaciones del emisor",
      heroTitle:
        "Un panel unificado para decisiones de cumplimiento, configuración de activos y salvaguardas en cadena",
      topbarSubtitle:
        "Cola KYC · aprobaciones de identidad · operaciones del ciclo de vida · evidencia de auditoría",
      topbarTitle: "Admin / Sala de control del emisor"
    },
    investor: {
      heroDescription:
        "Conecte una billetera, complete KYC y gestione suscripciones, rescates y posiciones en un workspace regulado.",
      heroEyebrow: "Workspace del inversor",
      heroTitle: "Portafolio, elegibilidad y acciones del ciclo de vida en un solo lugar",
      topbarSubtitle:
        "Red {chainName} {chainId} · elegibilidad off-chain · protección de transferencia en cadena",
      topbarTitle: "Inversor / Workspace de portafolio"
    }
  }
} as const;
