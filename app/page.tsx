"use client";

import React, { useState } from "react";

type LangKey = "English (US)" | "Tiếng Việt" | "Français" | "Español" | "Deutsch" | "日本語" | "한국어" | "中文(简体)";

interface TranslationData {
  tagline1: string;
  tagline2: string;
  tagline3: string;
  taglineHighlight: string;
  tagline4: string;
  subtitle: string;
  creatorStats: string;
  liveStatus: string;
  audioLabel: string;
  featuredBadge: string;
  featuredTitle: string;
  featuredAuthor: string;
  loginTitle: string;
  loginSubtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  forgotPassword: string;
  loginBtn: string;
  orDivider: string;
  createAccountBtn: string;
  orgText: string;
  orgLink: string;
  aboutLink: string;
  projectsLink: string;
  workspacesLink: string;
  apiHubLink: string;
  privacyLink: string;
  termsLink: string;
  guidelinesLink: string;
  helpLink: string;
  copyright: string;
  
  // Modals & toasts
  signUpTitle: string;
  signUpSubtitle: string;
  fullNamePlaceholder: string;
  usernamePlaceholder: string;
  contactPlaceholder: string;
  newPasswordPlaceholder: string;
  disciplineLabel: string;
  disciplines: {
    engineering: string;
    design: string;
    art3d: string;
    ai: string;
    audio: string;
    founder: string;
  };
  dobLabel: string;
  months: string[];
  pronounLabel: string;
  pronounShe: string;
  pronounHe: string;
  pronounThey: string;
  policyNote: string;
  termsHighlight: string;
  privacyHighlight: string;
  standardsHighlight: string;
  signUpSubmitBtn: string;

  forgotTitle: string;
  forgotSubtitle: string;
  forgotEmailLabel: string;
  cancelBtn: string;
  sendResetBtn: string;

  emptyError: string;
  loginSuccess: string;
  socialConnecting: string;
  fillRequiredError: string;
  registeredSuccess: string;
  resetSentSuccess: string;
  studioNotice: string;
  langSwitchedNotice: string;
}

const TRANSLATIONS: Record<LangKey, TranslationData> = {
  "English (US)": {
    tagline1: "Ignite",
    tagline2: "ideas.",
    tagline3: "Connect",
    taglineHighlight: "your creative",
    tagline4: "universe.",
    subtitle: "The dedicated social network engineered for visionary designers, developers, and digital pioneers across the globe.",
    creatorStats: "28,400+ Creators are actively building & sharing ideas.",
    liveStatus: "Live Gen #402",
    audioLabel: "Audio Synthesis",
    featuredBadge: "FEATURED",
    featuredTitle: "Quantum UI System",
    featuredAuthor: "Designed by @kai",
    loginTitle: "Log in to Synapse",
    loginSubtitle: "Continue your creative journey and unlock your workspace",
    emailLabel: "Email or Synapse ID",
    emailPlaceholder: "alex@creative.dev or @alex_design",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    forgotPassword: "Forgot password?",
    loginBtn: "Log In",
    orDivider: "or",
    createAccountBtn: "Create new account",
    orgText: "Representing an organization? ",
    orgLink: "Create an Enterprise Studio",
    aboutLink: "About Synapse",
    projectsLink: "Explore Projects",
    workspacesLink: "Creative Workspaces",
    apiHubLink: "API & AI Hub",
    privacyLink: "Privacy Policy",
    termsLink: "Terms of Service",
    guidelinesLink: "Community Guidelines",
    helpLink: "Help Center",
    copyright: "Synapse Network © 2026 • Creative ecosystem designed with modern social architecture",
    signUpTitle: "Create an account",
    signUpSubtitle: "It's quick, free, and instantly connects you to the creative universe.",
    fullNamePlaceholder: "Full name",
    usernamePlaceholder: "@synapse_id",
    contactPlaceholder: "Email or mobile number",
    newPasswordPlaceholder: "New password (min 6 characters)",
    disciplineLabel: "Creative Discipline",
    disciplines: {
      engineering: "Software Engineering & Development",
      design: "UI/UX & Product Design",
      art3d: "Digital Art & 3D Modeling",
      ai: "Artificial Intelligence & Machine Learning",
      audio: "Sound Design & Audio Production",
      founder: "Startup Founder & Product Leader",
    },
    dobLabel: "Date of birth",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    pronounLabel: "Pronoun / Gender",
    pronounShe: "She / Her",
    pronounHe: "He / Him",
    pronounThey: "They / Custom",
    policyNote: "By clicking Sign Up, you agree to our ",
    termsHighlight: "Terms of Service",
    privacyHighlight: "Privacy Policy",
    standardsHighlight: "Creative Guidelines",
    signUpSubmitBtn: "Sign Up",
    forgotTitle: "Find Your Account",
    forgotSubtitle: "Enter your registered email address to receive a recovery link.",
    forgotEmailLabel: "Registered Email",
    cancelBtn: "Cancel",
    sendResetBtn: "Send Reset Link",
    emptyError: "Please enter your Email or Synapse ID and Password to continue.",
    loginSuccess: "Welcome back! Successfully signed in as:",
    socialConnecting: "Connecting securely with",
    fillRequiredError: "Please fill in all required fields.",
    registeredSuccess: "Welcome to Synapse Universe! You can now log in.",
    resetSentSuccess: "Password reset link has been sent to your email. Please check your inbox.",
    studioNotice: "Synapse Studio & Team Workspaces registration will open for enterprises in Q4!",
    langSwitchedNotice: "Language switched to English (US)",
  },

  "Tiếng Việt": {
    tagline1: "Khởi tạo",
    tagline2: "ý tưởng.",
    tagline3: "Kết nối",
    taglineHighlight: "vũ trụ",
    tagline4: "sáng tạo.",
    subtitle: "Mạng lưới chuyên biệt dành riêng cho các nhà thiết kế, lập trình viên và những bộ óc tiên phong trên toàn cầu.",
    creatorStats: "28,400+ Creators đang tích cực sáng tạo & chia sẻ ý tưởng.",
    liveStatus: "Tạo sinh trực tiếp #402",
    audioLabel: "Tổng hợp âm thanh",
    featuredBadge: "NỔI BẬT",
    featuredTitle: "Hệ thống Quantum UI",
    featuredAuthor: "Thiết kế bởi @kai",
    loginTitle: "Đăng nhập vào Synapse",
    loginSubtitle: "Tiếp tục hành trình kiến tạo và mở khóa không gian của bạn",
    emailLabel: "Email hoặc Synapse ID",
    emailPlaceholder: "alex@creative.dev hoặc @alex_design",
    passwordLabel: "Mật khẩu",
    passwordPlaceholder: "Nhập mật khẩu an toàn",
    forgotPassword: "Quên mật khẩu?",
    loginBtn: "Đăng nhập",
    orDivider: "hoặc",
    createAccountBtn: "Tạo tài khoản mới",
    orgText: "Bạn đại diện cho một tổ chức? ",
    orgLink: "Tạo Studio Doanh nghiệp",
    aboutLink: "Về Synapse",
    projectsLink: "Khám phá Dự án",
    workspacesLink: "Không gian Sáng tạo",
    apiHubLink: "API & AI Hub",
    privacyLink: "Chính sách Quyền riêng tư",
    termsLink: "Điều khoản dịch vụ",
    guidelinesLink: "Quy chuẩn cộng đồng",
    helpLink: "Trung tâm Trợ giúp",
    copyright: "Synapse Network © 2026 • Hệ sinh thái sáng tạo thiết kế theo cấu trúc mạng xã hội hiện đại",
    signUpTitle: "Đăng ký thành viên",
    signUpSubtitle: "Nhanh chóng, miễn phí và kết nối tức thì với thế giới sáng tạo.",
    fullNamePlaceholder: "Họ và tên",
    usernamePlaceholder: "@synapse_id",
    contactPlaceholder: "Email hoặc số di động",
    newPasswordPlaceholder: "Mật khẩu mới (tối thiểu 6 ký tự)",
    disciplineLabel: "Lĩnh vực chuyên môn",
    disciplines: {
      engineering: "Lập trình & Kỹ thuật Phần mềm",
      design: "UI/UX & Thiết kế Sản phẩm",
      art3d: "Nghệ thuật Số & Mô hình 3D",
      ai: "Trí tuệ Nhân tạo & Học máy",
      audio: "Âm thanh & Sản xuất Đa phương tiện",
      founder: "Khởi nghiệp & Quản lý Sản phẩm",
    },
    dobLabel: "Ngày sinh",
    months: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
    pronounLabel: "Danh xưng / Giới tính",
    pronounShe: "Cô ấy / Nữ",
    pronounHe: "Anh ấy / Nam",
    pronounThey: "Khác / Tùy chỉnh",
    policyNote: "Bằng cách nhấp vào Đăng ký, bạn đồng ý với ",
    termsHighlight: "Điều khoản dịch vụ",
    privacyHighlight: "Chính sách bảo mật",
    standardsHighlight: "Tiêu chuẩn sáng tạo",
    signUpSubmitBtn: "Đăng ký",
    forgotTitle: "Tìm lại tài khoản",
    forgotSubtitle: "Nhập email đã liên kết để nhận liên kết khôi phục mật khẩu.",
    forgotEmailLabel: "Email đã đăng ký",
    cancelBtn: "Hủy",
    sendResetBtn: "Gửi liên kết khôi phục",
    emptyError: "Vui lòng nhập Email hoặc Synapse ID và Mật khẩu để tiếp tục.",
    loginSuccess: "Chào mừng trở lại! Đăng nhập thành công với tài khoản:",
    socialConnecting: "Đang kết nối an toàn với",
    fillRequiredError: "Vui lòng điền đầy đủ các thông tin bắt buộc.",
    registeredSuccess: "Chào mừng bạn gia nhập Synapse Universe! Hãy đăng nhập ngay.",
    resetSentSuccess: "Liên kết khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.",
    studioNotice: "Chương trình đăng ký Synapse Studio cho doanh nghiệp sẽ mở trong Q4!",
    langSwitchedNotice: "Đã chuyển đổi ngôn ngữ sang Tiếng Việt",
  },

  "Français": {
    tagline1: "Allumez",
    tagline2: "vos idées.",
    tagline3: "Rejoignez",
    taglineHighlight: "votre univers",
    tagline4: "créatif.",
    subtitle: "Le réseau social dédié aux designers, ingénieurs et créateurs d'avant-garde du monde entier.",
    creatorStats: "28 400+ créateurs conçoivent et partagent activement.",
    liveStatus: "Génération Direct #402",
    audioLabel: "Synthèse Audio",
    featuredBadge: "EN VEDETTE",
    featuredTitle: "Système UI Quantum",
    featuredAuthor: "Conçu par @kai",
    loginTitle: "Connexion à Synapse",
    loginSubtitle: "Poursuivez votre parcours créatif et ouvrez votre espace",
    emailLabel: "E-mail ou Identifiant Synapse",
    emailPlaceholder: "alex@creative.dev ou @alex_design",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Entrez votre mot de passe",
    forgotPassword: "Mot de passe oublié ?",
    loginBtn: "Se connecter",
    orDivider: "ou",
    createAccountBtn: "Créer un nouveau compte",
    orgText: "Vous représentez une organisation ? ",
    orgLink: "Créer un Studio Entreprise",
    aboutLink: "À propos de Synapse",
    projectsLink: "Explorer les Projets",
    workspacesLink: "Espaces Créatifs",
    apiHubLink: "Hub API & IA",
    privacyLink: "Politique de Confidentialité",
    termsLink: "Conditions d'Utilisation",
    guidelinesLink: "Règles Communautaires",
    helpLink: "Centre d'Aide",
    copyright: "Synapse Network © 2026 • Écosystème créatif inspiré de l'architecture sociale moderne",
    signUpTitle: "Créer un compte",
    signUpSubtitle: "Rapide, gratuit et immédiatement connecté à l'univers créatif.",
    fullNamePlaceholder: "Nom complet",
    usernamePlaceholder: "@synapse_id",
    contactPlaceholder: "E-mail ou numéro mobile",
    newPasswordPlaceholder: "Nouveau mot de passe (min 6 caractères)",
    disciplineLabel: "Discipline créative",
    disciplines: {
      engineering: "Génie Logiciel & Développement",
      design: "Design UI/UX & Produit",
      art3d: "Art Numérique & Modélisation 3D",
      ai: "Intelligence Artificielle & ML",
      audio: "Design Sonore & Production Audio",
      founder: "Fondateur de Startup & Product Leader",
    },
    dobLabel: "Date de naissance",
    months: ["Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"],
    pronounLabel: "Pronom / Genre",
    pronounShe: "Elle",
    pronounHe: "Il",
    pronounThey: "Iel / Personnalisé",
    policyNote: "En cliquant sur S'inscrire, vous acceptez nos ",
    termsHighlight: "Conditions de Service",
    privacyHighlight: "Politique de Confidentialité",
    standardsHighlight: "Normes Créatives",
    signUpSubmitBtn: "S'inscrire",
    forgotTitle: "Retrouver votre compte",
    forgotSubtitle: "Entrez votre e-mail pour recevoir un lien de réinitialisation.",
    forgotEmailLabel: "E-mail enregistré",
    cancelBtn: "Annuler",
    sendResetBtn: "Envoyer le lien",
    emptyError: "Veuillez saisir votre e-mail ou identifiant et mot de passe.",
    loginSuccess: "Bienvenue ! Connexion réussie en tant que :",
    socialConnecting: "Connexion sécurisée avec",
    fillRequiredError: "Veuillez remplir tous les champs obligatoires.",
    registeredSuccess: "Bienvenue sur Synapse Universe ! Vous pouvez maintenant vous connecter.",
    resetSentSuccess: "Le lien de réinitialisation a été envoyé à votre e-mail.",
    studioNotice: "Les inscriptions Synapse Studio pour entreprises ouvriront au T4 !",
    langSwitchedNotice: "Langue changée en Français",
  },

  "Español": {
    tagline1: "Enciende",
    tagline2: "ideas.",
    tagline3: "Conecta",
    taglineHighlight: "tu universo",
    tagline4: "creativo.",
    subtitle: "La red social diseñada para diseñadores visionarios, desarrolladores y pioneros digitales del mundo.",
    creatorStats: "28,400+ creadores activos construyendo y compartiendo ideas.",
    liveStatus: "Gen en Vivo #402",
    audioLabel: "Síntesis de Audio",
    featuredBadge: "DESTACADO",
    featuredTitle: "Sistema UI Quantum",
    featuredAuthor: "Diseñado por @kai",
    loginTitle: "Iniciar sesión en Synapse",
    loginSubtitle: "Continúa tu viaje creativo y desbloquea tu espacio de trabajo",
    emailLabel: "Correo o ID de Synapse",
    emailPlaceholder: "alex@creative.dev o @alex_design",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Introduce tu contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    loginBtn: "Iniciar sesión",
    orDivider: "o",
    createAccountBtn: "Crear cuenta nueva",
    orgText: "¿Representas a una organización? ",
    orgLink: "Crear un Studio Empresarial",
    aboutLink: "Acerca de Synapse",
    projectsLink: "Explorar Proyectos",
    workspacesLink: "Espacios Creativos",
    apiHubLink: "Hub de API e IA",
    privacyLink: "Política de Privacidad",
    termsLink: "Condiciones del Servicio",
    guidelinesLink: "Normas de la Comunidad",
    helpLink: "Centro de Ayuda",
    copyright: "Synapse Network © 2026 • Ecosistema creativo diseñado con arquitectura social moderna",
    signUpTitle: "Crear una cuenta",
    signUpSubtitle: "Rápido, gratis y conectado al instante con el universo creativo.",
    fullNamePlaceholder: "Nombre completo",
    usernamePlaceholder: "@synapse_id",
    contactPlaceholder: "Correo o número de teléfono",
    newPasswordPlaceholder: "Nueva contraseña (mínimo 6 caracteres)",
    disciplineLabel: "Disciplina creativa",
    disciplines: {
      engineering: "Ingeniería de Software & Desarrollo",
      design: "Diseño UI/UX & Producto",
      art3d: "Arte Digital & Modelado 3D",
      ai: "Inteligencia Artificial & ML",
      audio: "Diseño de Sonido & Producción de Audio",
      founder: "Fundador de Startup & Líder de Producto",
    },
    dobLabel: "Fecha de nacimiento",
    months: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    pronounLabel: "Pronombre / Género",
    pronounShe: "Ella",
    pronounHe: "Él",
    pronounThey: "Elle / Personalizado",
    policyNote: "Al hacer clic en Registrarte, aceptas nuestras ",
    termsHighlight: "Condiciones de Servicio",
    privacyHighlight: "Política de Privacidad",
    standardsHighlight: "Normas Creativas",
    signUpSubmitBtn: "Registrarte",
    forgotTitle: "Buscar tu cuenta",
    forgotSubtitle: "Ingresa tu correo registrado para recibir un enlace de recuperación.",
    forgotEmailLabel: "Correo registrado",
    cancelBtn: "Cancelar",
    sendResetBtn: "Enviar enlace",
    emptyError: "Por favor ingresa tu correo/ID y contraseña para continuar.",
    loginSuccess: "¡Bienvenido de nuevo! Has iniciado sesión como:",
    socialConnecting: "Conectando de forma segura con",
    fillRequiredError: "Por favor completa todos los campos requeridos.",
    registeredSuccess: "¡Bienvenido a Synapse Universe! Ya puedes iniciar sesión.",
    resetSentSuccess: "Se ha enviado el enlace de restablecimiento a tu correo.",
    studioNotice: "¡El registro de Synapse Studio para empresas abrirá en el cuarto trimestre!",
    langSwitchedNotice: "Idioma cambiado a Español",
  },

  "Deutsch": {
    tagline1: "Entfessle",
    tagline2: "Ideen.",
    tagline3: "Verbinde",
    taglineHighlight: "dein kreatives",
    tagline4: "Universum.",
    subtitle: "Das spezialisierte Netzwerk für visionäre Designer, Entwickler und digitale Pioniere weltweit.",
    creatorStats: "28.400+ Creators bauen und teilen aktiv Ideen.",
    liveStatus: "Live Gen #402",
    audioLabel: "Audio-Synthese",
    featuredBadge: "HIGHLIGHT",
    featuredTitle: "Quantum UI System",
    featuredAuthor: "Entworfen von @kai",
    loginTitle: "Bei Synapse anmelden",
    loginSubtitle: "Setze deine kreative Reise fort und öffne deinen Workspace",
    emailLabel: "E-Mail oder Synapse-ID",
    emailPlaceholder: "alex@creative.dev oder @alex_design",
    passwordLabel: "Passwort",
    passwordPlaceholder: "Passwort eingeben",
    forgotPassword: "Passwort vergessen?",
    loginBtn: "Anmelden",
    orDivider: "oder",
    createAccountBtn: "Neues Konto erstellen",
    orgText: "Vertrittst du ein Unternehmen? ",
    orgLink: "Enterprise Studio erstellen",
    aboutLink: "Über Synapse",
    projectsLink: "Projekte entdecken",
    workspacesLink: "Kreative Workspaces",
    apiHubLink: "API & KI-Hub",
    privacyLink: "Datenschutzrichtlinie",
    termsLink: "Nutzungsbedingungen",
    guidelinesLink: "Community-Richtlinien",
    helpLink: "Hilfebereich",
    copyright: "Synapse Network © 2026 • Kreatives Ökosystem mit moderner sozialer Architektur",
    signUpTitle: "Konto erstellen",
    signUpSubtitle: "Schnell, kostenlos und sofort mit dem Universum verbunden.",
    fullNamePlaceholder: "Vollständiger Name",
    usernamePlaceholder: "@synapse_id",
    contactPlaceholder: "E-Mail oder Handynummer",
    newPasswordPlaceholder: "Neues Passwort (mind. 6 Zeichen)",
    disciplineLabel: "Fachbereich",
    disciplines: {
      engineering: "Software-Entwicklung",
      design: "UI/UX & Produktdesign",
      art3d: "Digitale Kunst & 3D-Modellierung",
      ai: "Künstliche Intelligenz & ML",
      audio: "Sounddesign & Musikproduktion",
      founder: "Startup-Gründer & Product Leader",
    },
    dobLabel: "Geburtsdatum",
    months: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
    pronounLabel: "Pronomen / Geschlecht",
    pronounShe: "Sie / Ihr",
    pronounHe: "Er / Ihm",
    pronounThey: "Divers / Individuell",
    policyNote: "Mit Klick auf Registrieren stimmst du unseren ",
    termsHighlight: "Nutzungsbedingungen",
    privacyHighlight: "Datenschutzbestimmungen",
    standardsHighlight: "Kreativstandards",
    signUpSubmitBtn: "Registrieren",
    forgotTitle: "Konto finden",
    forgotSubtitle: "Gib deine E-Mail-Adresse ein, um einen Link zum Zurücksetzen zu erhalten.",
    forgotEmailLabel: "Registrierte E-Mail",
    cancelBtn: "Abbrechen",
    sendResetBtn: "Link anfordern",
    emptyError: "Bitte E-Mail/Synapse-ID und Passwort eingeben.",
    loginSuccess: "Willkommen zurück! Erfolgreich angemeldet als:",
    socialConnecting: "Sichere Verbindung mit",
    fillRequiredError: "Bitte fülle alle Pflichtfelder aus.",
    registeredSuccess: "Willkommen im Synapse Universe! Du kannst dich jetzt anmelden.",
    resetSentSuccess: "Ein Link zum Zurücksetzen des Passworts wurde gesendet.",
    studioNotice: "Synapse Studio für Unternehmen startet im 4. Quartal!",
    langSwitchedNotice: "Sprache auf Deutsch geändert",
  },

  "日本語": {
    tagline1: "ひらめきを",
    tagline2: "現実に。",
    tagline3: "繋がろう、",
    taglineHighlight: "クリエイティブな",
    tagline4: "宇宙へ。",
    subtitle: "世界中のデザイナー、エンジニア、次世代クリエイターのための専用ソーシャルネットワーク。",
    creatorStats: "28,400人以上のクリエイターがアイデアを共有中。",
    liveStatus: "ライブ生成 #402",
    audioLabel: "オーディオ合成",
    featuredBadge: "注目プロジェクト",
    featuredTitle: "Quantum UI システム",
    featuredAuthor: "Design by @kai",
    loginTitle: "Synapse にログイン",
    loginSubtitle: "あなたの創作の旅を続け、ワークスペースへアクセス",
    emailLabel: "メールアドレスまたはSynapse ID",
    emailPlaceholder: "alex@creative.dev または @alex_design",
    passwordLabel: "パスワード",
    passwordPlaceholder: "パスワードを入力",
    forgotPassword: "パスワードをお忘れですか？",
    loginBtn: "ログイン",
    orDivider: "または",
    createAccountBtn: "新しいアカウントを作成",
    orgText: "企業・団体をお持ちですか？ ",
    orgLink: "エンタープライズStudioを開設",
    aboutLink: "Synapseについて",
    projectsLink: "プロジェクトを探す",
    workspacesLink: "クリエイティブ空間",
    apiHubLink: "API & AI ハブ",
    privacyLink: "プライバシーポリシー",
    termsLink: "利用規約",
    guidelinesLink: "コミュニティ規範",
    helpLink: "ヘルプセンター",
    copyright: "Synapse Network © 2026 • 現代的なソーシャル構造に基づき設計されたクリエイティブエコシステム",
    signUpTitle: "新規アカウント登録",
    signUpSubtitle: "簡単・無料・すぐに世界中のクリエイターと繋がれます。",
    fullNamePlaceholder: "氏名",
    usernamePlaceholder: "@synapse_id",
    contactPlaceholder: "メールアドレスまたは携帯電話番号",
    newPasswordPlaceholder: "新しいパスワード（6文字以上）",
    disciplineLabel: "専門分野",
    disciplines: {
      engineering: "ソフトウェアエンジニアリング & 開発",
      design: "UI/UX & プロダクトデザイン",
      art3d: "デジタルアート & 3Dモデリング",
      ai: "人工知能 (AI) & 機械学習",
      audio: "サウンドデザイン & 楽曲制作",
      founder: "スタートアップ創業者 & プロダクトリーダー",
    },
    dobLabel: "生年月日",
    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    pronounLabel: "代名詞 / 性別",
    pronounShe: "女性 (She/Her)",
    pronounHe: "男性 (He/Him)",
    pronounThey: "カスタム / その他",
    policyNote: "「登録」をクリックすると、当社の",
    termsHighlight: "利用規約",
    privacyHighlight: "プライバシーポリシー",
    standardsHighlight: "クリエイティブガイドライン",
    signUpSubmitBtn: "アカウント登録",
    forgotTitle: "アカウントの検索",
    forgotSubtitle: "登録済みのメールアドレスを入力して再設定リンクを受信してください。",
    forgotEmailLabel: "登録メールアドレス",
    cancelBtn: "キャンセル",
    sendResetBtn: "リンクを送信",
    emptyError: "メールアドレス/Synapse IDとパスワードを入力してください。",
    loginSuccess: "おかえりなさい！ログインに成功しました：",
    socialConnecting: "安全に接続中：",
    fillRequiredError: "必須項目をすべて入力してください。",
    registeredSuccess: "Synapse Universeへようこそ！今すぐログインできます。",
    resetSentSuccess: "パスワード再設定リンクを送信しました。メールをご確認ください。",
    studioNotice: "企業向け Synapse Studio 登録は第4四半期に開始予定です！",
    langSwitchedNotice: "言語を日本語に切り替えました",
  },

  "한국어": {
    tagline1: "아이디어를",
    tagline2: "점화하라.",
    tagline3: "연결되는",
    taglineHighlight: "당신의 창의적",
    tagline4: "우주.",
    subtitle: "전 세계 비전 있는 디자이너, 소프트웨어 엔지니어, 디지털 창작자들을 위한 소셜 네트워크.",
    creatorStats: "28,400명 이상의 크리에이터가 아이디어를 나누고 있습니다.",
    liveStatus: "라이브 생성 #402",
    audioLabel: "오디오 신디사이저",
    featuredBadge: "추천 프로젝트",
    featuredTitle: "Quantum UI 시스템",
    featuredAuthor: "디자인: @kai",
    loginTitle: "Synapse 로그인",
    loginSubtitle: "창작의 여정을 이어가고 워크스페이스를 잠금 해제하세요",
    emailLabel: "이메일 또는 Synapse ID",
    emailPlaceholder: "alex@creative.dev 또는 @alex_design",
    passwordLabel: "비밀번호",
    passwordPlaceholder: "비밀번호 입력",
    forgotPassword: "비밀번호를 잊으셨나요?",
    loginBtn: "로그인",
    orDivider: "또는",
    createAccountBtn: "새 계정 만들기",
    orgText: "기업이나 단체를 대표하시나요? ",
    orgLink: "엔터프라이즈 스튜디오 개설",
    aboutLink: "Synapse 소개",
    projectsLink: "프로젝트 탐색",
    workspacesLink: "창작 워크스페이스",
    apiHubLink: "API & AI 허브",
    privacyLink: "개인정보 처리방침",
    termsLink: "이용약관",
    guidelinesLink: "커뮤니티 가이드라인",
    helpLink: "고객센터",
    copyright: "Synapse Network © 2026 • 현대적 소셜 구조로 설계된 크리에이티브 에코시스템",
    signUpTitle: "가입하기",
    signUpSubtitle: "빠르고 간편하게 크리에이티브 세계와 연결되세요.",
    fullNamePlaceholder: "성명",
    usernamePlaceholder: "@synapse_id",
    contactPlaceholder: "이메일 또는 휴대폰 번호",
    newPasswordPlaceholder: "새 비밀번호 (6자 이상)",
    disciplineLabel: "전문 분야",
    disciplines: {
      engineering: "소프트웨어 엔지니어링 & 개발",
      design: "UI/UX & 제품 디자인",
      art3d: "디지털 아트 & 3D 모델링",
      ai: "인공지능 & 머신러닝",
      audio: "사운드 디자인 & 오디오 제작",
      founder: "스타트업 창업자 & 제품 리더",
    },
    dobLabel: "생년월일",
    months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    pronounLabel: "성별 / 호칭",
    pronounShe: "여성 (She/Her)",
    pronounHe: "남성 (He/Him)",
    pronounThey: "기타 / 맞춤",
    policyNote: "가입하기를 클릭하면 Synapse의 ",
    termsHighlight: "이용약관",
    privacyHighlight: "개인정보 처리방침",
    standardsHighlight: "크리에이티브 기준",
    signUpSubmitBtn: "가입하기",
    forgotTitle: "계정 찾기",
    forgotSubtitle: "등록된 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다.",
    forgotEmailLabel: "등록된 이메일",
    cancelBtn: "취소",
    sendResetBtn: "재설정 링크 받기",
    emptyError: "계속하려면 이메일/Synapse ID와 비밀번호를 입력하세요.",
    loginSuccess: "환영합니다! 다음 계정으로 로그인되었습니다:",
    socialConnecting: "안전하게 연결 중:",
    fillRequiredError: "모든 필수 입력 사항을 기재해 주세요.",
    registeredSuccess: "Synapse Universe에 오신 것을 환영합니다! 이제 로그인하세요.",
    resetSentSuccess: "비밀번호 재설정 링크가 이메일로 전송되었습니다.",
    studioNotice: "기업용 Synapse Studio 등록은 4분기에 오픈됩니다!",
    langSwitchedNotice: "언어가 한국어로 변경되었습니다",
  },

  "中文(简体)": {
    tagline1: "点燃",
    tagline2: "创意火花。",
    tagline3: "连接",
    taglineHighlight: "你的专属创意",
    tagline4: "宇宙。",
    subtitle: "专为全球富有远见的设计师、软件工程师与数字先锋打造的专属社交宇宙。",
    creatorStats: "超过 28,400 位创作者正在活跃构建与分享想法。",
    liveStatus: "实时生成 #402",
    audioLabel: "音频合成",
    featuredBadge: "精选项目",
    featuredTitle: "Quantum UI 系统",
    featuredAuthor: "设计者 @kai",
    loginTitle: "登录 Synapse",
    loginSubtitle: "开启你的创作者旅程，解锁无限工作空间",
    emailLabel: "邮箱或 Synapse ID",
    emailPlaceholder: "alex@creative.dev 或 @alex_design",
    passwordLabel: "密码",
    passwordPlaceholder: "输入您的密码",
    forgotPassword: "忘记密码？",
    loginBtn: "登录",
    orDivider: "或",
    createAccountBtn: "创建新账户",
    orgText: "代表企业或团队？ ",
    orgLink: "创建企业级 Studio",
    aboutLink: "关于 Synapse",
    projectsLink: "探索创意项目",
    workspacesLink: "创意工作区",
    apiHubLink: "API & AI 枢纽",
    privacyLink: "隐私政策",
    termsLink: "服务条款",
    guidelinesLink: "社区准则",
    helpLink: "帮助中心",
    copyright: "Synapse Network © 2026 • 汲取现代社交架构精髓的创意生态网络",
    signUpTitle: "注册账户",
    signUpSubtitle: "快捷、免费，即刻与全球创意宇宙无缝连接。",
    fullNamePlaceholder: "姓名",
    usernamePlaceholder: "@synapse_id",
    contactPlaceholder: "电子邮箱或手机号码",
    newPasswordPlaceholder: "新密码（至少 6 位字符）",
    disciplineLabel: "创意领域",
    disciplines: {
      engineering: "软件工程与系统开发",
      design: "UI/UX 与产品设计",
      art3d: "数字艺术与 3D 建模",
      ai: "人工智能与机器学习",
      audio: "声音设计与音频制作",
      founder: "初创创始人与产品负责人",
    },
    dobLabel: "出生日期",
    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    pronounLabel: "称谓 / 性别",
    pronounShe: "女性 (She/Her)",
    pronounHe: "男性 (He/Him)",
    pronounThey: "其他 / 自定义",
    policyNote: "点击注册即表示您同意我们的 ",
    termsHighlight: "服务条款",
    privacyHighlight: "隐私政策",
    standardsHighlight: "创意社区规范",
    signUpSubmitBtn: "注册",
    forgotTitle: "查找您的账户",
    forgotSubtitle: "输入您绑定的电子邮箱以接收密码重置链接。",
    forgotEmailLabel: "绑定的电子邮箱",
    cancelBtn: "取消",
    sendResetBtn: "发送重置链接",
    emptyError: "请输入邮箱/Synapse ID和密码以继续。",
    loginSuccess: "欢迎回来！已成功登录为：",
    socialConnecting: "正在安全连接：",
    fillRequiredError: "请填写所有必填字段。",
    registeredSuccess: "欢迎加入 Synapse Universe！现在您可以立即登录。",
    resetSentSuccess: "重置密码链接已发送至您的邮箱，请查收。",
    studioNotice: "面向团队的 Synapse Studio 计划将于第四季度开放！",
    langSwitchedNotice: "语言已切换为中文(简体)",
  },
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Reaction counts on creative showcase
  const [reactions, setReactions] = useState({
    sparks: 1420,
    rockets: 890,
    gems: 530,
  });
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);

  // Forgot password modal state
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  // Sign up modal state
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    username: "",
    contact: "",
    password: "",
    discipline: "engineering",
    birthDay: "15",
    birthMonth: "9",
    birthYear: "2000",
    pronoun: "she",
  });
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);

  // Active language in footer
  const [activeLang, setActiveLang] = useState<LangKey>("English (US)");

  const t = TRANSLATIONS[activeLang];

  const handleLanguageChange = (lang: LangKey) => {
    setActiveLang(lang);
    const targetT = TRANSLATIONS[lang];
    setMessage({
      text: targetT.langSwitchedNotice,
      type: "info",
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({
        text: t.emptyError,
        type: "error",
      });
      return;
    }
    setIsLoading(true);
    setMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      setMessage({
        text: `${t.loginSuccess} ${email}`,
        type: "success",
      });
    }, 1000);
  };

  const handleSocialLogin = (provider: "Google" | "GitHub") => {
    setIsLoading(true);
    setMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      setMessage({
        text: `${t.socialConnecting} ${provider}... ${t.loginSuccess} ${provider} User`,
        type: "success",
      });
    }, 1200);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setMessage({ text: t.fillRequiredError, type: "error" });
      return;
    }
    setIsForgotLoading(true);
    setTimeout(() => {
      setIsForgotLoading(false);
      setIsForgotOpen(false);
      setMessage({
        text: `${t.resetSentSuccess} (${forgotEmail})`,
        type: "success",
      });
      setForgotEmail("");
    }, 1200);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData.fullName || !signUpData.contact || !signUpData.password) {
      setMessage({ text: t.fillRequiredError, type: "error" });
      return;
    }
    setIsSignUpLoading(true);
    setTimeout(() => {
      setIsSignUpLoading(false);
      setIsSignUpOpen(false);
      setEmail(signUpData.contact);
      setMessage({
        text: `${signUpData.fullName}, ${t.registeredSuccess}`,
        type: "success",
      });
    }, 1200);
  };

  const handleBoostReaction = (type: "sparks" | "rockets" | "gems") => {
    setReactions((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-[#faf9fe] text-[#19152b] flex flex-col justify-between selection:bg-purple-200 selection:text-purple-900 font-sans relative overflow-x-hidden">
      {/* Subtle modern dot-matrix mesh across entire screen to eliminate empty feel */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70 -z-10"
        style={{
          backgroundImage: "radial-gradient(rgba(139, 92, 246, 0.15) 1.2px, transparent 1.2px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ambient background glow accents reaching edges */}
      <div className="pointer-events-none absolute -top-44 -left-32 w-[750px] h-[750px] bg-gradient-to-br from-violet-300/40 via-fuchsia-200/25 to-transparent rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-1/4 -right-32 w-[750px] h-[750px] bg-gradient-to-bl from-indigo-300/35 via-cyan-100/25 to-transparent rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 w-[650px] h-[450px] bg-gradient-to-t from-violet-200/30 to-transparent rounded-full blur-3xl -z-10" />

      {/* Floating Toast Notification */}
      {message && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 transition-all duration-300 border backdrop-blur-md ${
            message.type === "success"
              ? "bg-emerald-50/95 border-emerald-300 text-emerald-900 shadow-emerald-500/10"
              : message.type === "error"
              ? "bg-rose-50/95 border-rose-300 text-rose-900 shadow-rose-500/10"
              : "bg-indigo-50/95 border-indigo-300 text-indigo-900 shadow-indigo-500/10"
          }`}
        >
          <span className="text-lg">
            {message.type === "success" ? "✓" : message.type === "error" ? "✕" : "ℹ"}
          </span>
          <span className="font-medium text-sm">{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="ml-2 text-gray-400 hover:text-gray-700 font-bold text-sm cursor-pointer outline-none focus:outline-none"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Container - Full-width Expansive Facebook Split Layout Architecture */}
      <main className="w-full max-w-[1760px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 py-8 lg:py-12 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 2xl:gap-20 items-center">
          
          {/* LEFT HERO SECTION (~58-60% on Desktop) */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center select-none pt-2 lg:pt-0">
            {/* Unique Brand Logo: Synapse Neural Prism */}
            <div className="mb-6 lg:mb-8 flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 ring-4 ring-white">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tight text-[#16122d]">
                  Synapse<span className="text-violet-600">.</span>
                </span>
                <span className="text-[11px] uppercase tracking-widest text-violet-600 font-bold">
                  Creative Universe
                </span>
              </div>
            </div>

            {/* Split Row: Giant Typography + Floating Visual Collage */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 lg:gap-10">
              {/* Bold Expansive Typography (Facebook-inspired stacked style) */}
              <div className="flex-1">
                <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-[80px] 2xl:text-[88px] font-extrabold tracking-[-0.04em] leading-[1.04] text-[#151229]">
                  {t.tagline1}<br />
                  {t.tagline2}<br />
                  {t.tagline3}<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600">
                    {t.taglineHighlight}
                  </span><br />
                  {t.tagline4}
                </h1>
                <p className="mt-6 text-base sm:text-lg xl:text-xl text-gray-600 max-w-xl leading-relaxed font-normal">
                  {t.subtitle}
                </p>

                {/* Trending tags filling the space with interactive creativity */}
                <div className="mt-6 flex flex-wrap gap-2 pt-1">
                  {["#GenerativeAI", "#DesignSystems", "#WebGL3D", "#CreativeDev", "#SoundSynthesis"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-100/70 text-violet-800 border border-violet-200/50 hover:bg-violet-200/70 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Unique Visual Creative Showcase Mockup */}
              <div className="relative w-full max-w-[360px] sm:max-w-[400px] xl:max-w-[430px] h-[430px] sm:h-[460px] xl:h-[490px] flex-shrink-0 self-center xl:self-auto">
                
                {/* Floating Interactive Reaction Bubble */}
                <div className="absolute -top-3 left-4 z-30 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-purple-100 ring-2 ring-white">
                  <button
                    onClick={() => handleBoostReaction("sparks")}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:scale-110 transition-transform cursor-pointer outline-none focus:outline-none"
                    title="Boost Sparks"
                  >
                    ⚡ <span>{reactions.sparks.toLocaleString()}</span>
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => handleBoostReaction("rockets")}
                    className="flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:scale-110 transition-transform cursor-pointer outline-none focus:outline-none"
                    title="Launch Rockets"
                  >
                    🚀 <span>{reactions.rockets.toLocaleString()}</span>
                  </button>
                </div>

                {/* Main Showcase Art Card (Holographic Cyber Art) */}
                <div className="absolute top-2 right-4 w-[230px] sm:w-[260px] h-[340px] sm:h-[370px] rounded-[32px] overflow-hidden shadow-2xl border-[6px] border-white bg-neutral-900 group">
                  <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
                    alt="Digital generative art"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Live Status Pill */}
                  <div className="absolute top-3.5 right-3.5 bg-black/65 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-sm border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{t.liveStatus}</span>
                  </div>

                  {/* Audio visualizer bar overlay */}
                  <div className="absolute bottom-3.5 inset-x-3.5 bg-black/60 backdrop-blur-md rounded-2xl p-2.5 flex items-center justify-between text-white border border-white/20">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors text-[10px] outline-none focus:outline-none"
                      >
                        {isPlayingAudio ? "⏸" : "▶"}
                      </button>
                      <div className="flex items-end gap-0.5 h-4">
                        <span className={`w-1 bg-violet-400 rounded-full transition-all ${isPlayingAudio ? "h-3.5 animate-pulse" : "h-1"}`}></span>
                        <span className={`w-1 bg-fuchsia-400 rounded-full transition-all ${isPlayingAudio ? "h-4 animate-bounce" : "h-2"}`}></span>
                        <span className={`w-1 bg-cyan-400 rounded-full transition-all ${isPlayingAudio ? "h-2.5 animate-pulse" : "h-1.5"}`}></span>
                        <span className={`w-1 bg-white rounded-full transition-all ${isPlayingAudio ? "h-3 animate-pulse" : "h-1"}`}></span>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-purple-200">{t.audioLabel}</span>
                  </div>
                </div>

                {/* Left Mini Code / Insight Card */}
                <div className="absolute top-14 left-0 w-[135px] h-[135px] rounded-2xl overflow-hidden shadow-xl border-4 border-white z-10 bg-slate-900 p-3 text-left text-white group hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-1 mb-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="text-[10px] font-mono text-cyan-300 font-semibold">
                    const brain = new NeuralCore();
                  </div>
                  <div className="mt-1 text-[9px] text-gray-400 font-mono">
                    brain.connect()
                  </div>
                  <div className="mt-2 text-[8px] bg-violet-500/30 text-violet-300 rounded px-1.5 py-0.5 inline-block font-mono">
                    v3.4 verified ✓
                  </div>
                </div>

                {/* Front Overlapping Featured Project Card */}
                <div className="absolute bottom-6 left-2 sm:left-4 w-[200px] sm:w-[220px] bg-white rounded-2xl p-3 shadow-2xl border border-purple-100/80 z-20 transform hover:-translate-y-1 transition-transform">
                  <div className="relative h-[120px] rounded-xl overflow-hidden mb-2.5 bg-purple-50">
                    <img
                      src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80"
                      alt="Cyber aesthetics setup"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-md px-2 py-0.5 text-[10px] font-bold shadow">
                      {t.featuredBadge}
                    </div>
                  </div>
                  <div className="space-y-1 px-1">
                    <div className="text-xs font-bold text-gray-800 truncate">{t.featuredTitle}</div>
                    <div className="flex items-center justify-between text-[10px] text-gray-500">
                      <span>{t.featuredAuthor}</span>
                      <span className="text-violet-600 font-semibold">★ 4.9</span>
                    </div>
                  </div>
                </div>

                {/* Floating Gem reaction badge */}
                <div
                  onClick={() => handleBoostReaction("gems")}
                  className="absolute top-[220px] right-1 sm:right-2 z-30 transform hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  title="Drop Gem"
                >
                  <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 border-2 border-white text-white">
                    <span className="text-xl">💎</span>
                  </div>
                </div>

                {/* Bottom Active Creator Avatar Ring */}
                <div className="absolute -bottom-2 left-[140px] sm:left-[160px] z-30">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-[3.5px] border-violet-600 overflow-hidden shadow-xl bg-white ring-4 ring-white relative">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                      alt="Active Creator avatar"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live community status badge */}
            <div className="mt-9 flex items-center gap-3.5 text-sm text-gray-600">
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="Avatar" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Avatar" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" alt="Avatar" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-700">
                <strong className="text-violet-600 font-bold">28,400+ Creators</strong> are actively building & sharing ideas worldwide.
              </p>
            </div>
          </div>

          {/* RIGHT FORM SECTION (Facebook layout architecture, Synapse style) */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center lg:items-end justify-center w-full">
            <div className="w-full max-w-[480px] xl:max-w-[500px] bg-white p-7 sm:p-9 rounded-[36px] shadow-2xl shadow-indigo-950/8 border border-purple-100/90 backdrop-blur-md">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-[28px] font-bold text-[#17132f] tracking-tight">
                  {t.loginTitle}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
                  {t.loginSubtitle}
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email or Synapse ID */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    {t.emailLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-500/10 transition-all text-gray-900 bg-gray-50/40 focus:bg-white"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      {t.passwordLabel}
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotOpen(true)}
                      className="text-xs font-medium text-violet-600 hover:text-violet-700 hover:underline cursor-pointer outline-none focus:outline-none"
                    >
                      {t.forgotPassword}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-500/10 transition-all text-gray-900 bg-gray-50/40 focus:bg-white pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-1 cursor-pointer outline-none focus:outline-none"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Facebook-style Primary Login Button with Synapse styling */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 hover:opacity-95 active:scale-[0.99] text-white font-bold py-3.5 rounded-full text-base transition-all duration-150 shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 outline-none focus:outline-none"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  <span>{t.loginBtn}</span>
                </button>

                {/* Quick Social Logins */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin("Google")}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 hover:border-gray-300 rounded-2xl bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-all cursor-pointer outline-none focus:outline-none"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin("GitHub")}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 hover:border-gray-300 rounded-2xl bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-all cursor-pointer outline-none focus:outline-none"
                  >
                    <svg className="w-4 h-4 text-gray-900 fill-current" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                    <span>GitHub</span>
                  </button>
                </div>

                {/* Facebook-style Divider */}
                <div className="relative py-2 flex items-center justify-center">
                  <div className="w-full border-t border-gray-200"></div>
                  <span className="absolute bg-white px-3 text-[11px] text-gray-400 uppercase tracking-widest font-semibold">
                    {t.orDivider}
                  </span>
                </div>

                {/* Facebook-style Secondary Create Account Button */}
                <button
                  type="button"
                  onClick={() => setIsSignUpOpen(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold py-3.5 rounded-full text-base transition-all duration-150 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer outline-none focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>{t.createAccountBtn}</span>
                </button>
              </form>

              {/* Subtext like Facebook's "Create a Page" */}
              <div className="mt-7 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
                <span>{t.orgText}</span>
                <a
                  href="#studio"
                  onClick={(e) => {
                    e.preventDefault();
                    setMessage({
                      text: t.studioNotice,
                      type: "info",
                    });
                  }}
                  className="text-violet-600 hover:underline font-semibold outline-none focus:outline-none"
                >
                  {t.orgLink}
                </a>
              </div>
            </div>

            {/* Enterprise / Platform Trust Highlights Card underneath form */}
            <div className="w-full max-w-[480px] xl:max-w-[500px] mt-4 px-4 py-3 rounded-2xl bg-white/60 border border-purple-100/60 backdrop-blur-xs flex items-center justify-between text-[11px] text-gray-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Sub-ms Sync</span>
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1.5">
                <span>🔒 End-to-End Encrypted</span>
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1.5">
                <span>⭐ Global CDN</span>
              </span>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER (Facebook multi-language + links pattern, expanded to full width) */}
      <footer className="w-full max-w-[1760px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 py-6 border-t border-purple-100/60 text-xs text-gray-500 select-none">
        {/* Language bar - Click any language to switch entire page instantly */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 justify-center lg:justify-start pb-3 border-b border-gray-200/50">
          {(
            [
              "English (US)",
              "Tiếng Việt",
              "Français",
              "Español",
              "Deutsch",
              "日本語",
              "한국어",
              "中文(简体)",
            ] as LangKey[]
          ).map((lang) => {
            const isSelected = activeLang === lang;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => handleLanguageChange(lang)}
                className={`px-2.5 py-1 rounded-lg transition-all duration-150 cursor-pointer outline-none focus:outline-none text-xs ${
                  isSelected
                    ? "bg-violet-100/90 text-violet-700 font-bold shadow-xs ring-1 ring-violet-300/60"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/60"
                }`}
                title={`Switch to ${lang}`}
              >
                {lang}
              </button>
            );
          })}
        </div>

        {/* Links bar */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 justify-center lg:justify-start pt-3 text-[11px] text-gray-500">
          <a href="#" className="hover:text-violet-600 transition-colors outline-none focus:outline-none">{t.aboutLink}</a>
          <a href="#" className="hover:text-violet-600 transition-colors outline-none focus:outline-none">{t.projectsLink}</a>
          <a href="#" className="hover:text-violet-600 transition-colors outline-none focus:outline-none">{t.workspacesLink}</a>
          <a href="#" className="hover:text-violet-600 transition-colors outline-none focus:outline-none">{t.apiHubLink}</a>
          <a href="#" className="hover:text-violet-600 transition-colors outline-none focus:outline-none">{t.privacyLink}</a>
          <a href="#" className="hover:text-violet-600 transition-colors outline-none focus:outline-none">{t.termsLink}</a>
          <a href="#" className="hover:text-violet-600 transition-colors outline-none focus:outline-none">{t.guidelinesLink}</a>
          <a href="#" className="hover:text-violet-600 transition-colors outline-none focus:outline-none">{t.helpLink}</a>
        </div>

        {/* Copyright notice */}
        <div className="mt-3 text-center lg:text-left text-[11px] text-gray-400">
          {t.copyright}
        </div>
      </footer>

      {/* SIGN UP MODAL (Facebook Registration pattern, Synapse theme) */}
      {isSignUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div
            className="bg-white rounded-[28px] shadow-2xl w-full max-w-[460px] overflow-hidden border border-purple-100 transition-all transform animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-violet-50/50 to-fuchsia-50/30">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{t.signUpTitle}</h3>
                <p className="text-gray-500 text-xs mt-0.5">
                  {t.signUpSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSignUpOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer outline-none focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSignUpSubmit} className="p-5 space-y-3.5">
              {/* Full Name & Username */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder={t.fullNamePlaceholder}
                  value={signUpData.fullName}
                  onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 transition-all"
                />
                <input
                  type="text"
                  placeholder={t.usernamePlaceholder}
                  value={signUpData.username}
                  onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 transition-all"
                />
              </div>

              {/* Email / Phone */}
              <div>
                <input
                  type="text"
                  required
                  placeholder={t.contactPlaceholder}
                  value={signUpData.contact}
                  onChange={(e) => setSignUpData({ ...signUpData, contact: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <input
                  type="password"
                  required
                  placeholder={t.newPasswordPlaceholder}
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 transition-all"
                />
              </div>

              {/* Creative Discipline */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.disciplineLabel}
                </label>
                <select
                  value={signUpData.discipline}
                  onChange={(e) => setSignUpData({ ...signUpData, discipline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-violet-600"
                >
                  <option value="engineering">{t.disciplines.engineering}</option>
                  <option value="design">{t.disciplines.design}</option>
                  <option value="art3d">{t.disciplines.art3d}</option>
                  <option value="ai">{t.disciplines.ai}</option>
                  <option value="audio">{t.disciplines.audio}</option>
                  <option value="founder">{t.disciplines.founder}</option>
                </select>
              </div>

              {/* Date of birth (Facebook structure) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.dobLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={signUpData.birthDay}
                    onChange={(e) => setSignUpData({ ...signUpData, birthDay: e.target.value })}
                    className="px-2.5 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-violet-600"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <select
                    value={signUpData.birthMonth}
                    onChange={(e) => setSignUpData({ ...signUpData, birthMonth: e.target.value })}
                    className="px-2.5 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-violet-600"
                  >
                    {t.months.map((m, idx) => (
                      <option key={m} value={idx + 1}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={signUpData.birthYear}
                    onChange={(e) => setSignUpData({ ...signUpData, birthYear: e.target.value })}
                    className="px-2.5 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-violet-600"
                  >
                    {Array.from({ length: 90 }, (_, i) => 2026 - i).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pronoun / Identity */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.pronounLabel}
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                  {[
                    { label: t.pronounShe, value: "she" },
                    { label: t.pronounHe, value: "he" },
                    { label: t.pronounThey, value: "they" },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className={`flex items-center justify-between px-3 py-2 border rounded-xl cursor-pointer transition-colors ${
                        signUpData.pronoun === item.value
                          ? "border-violet-600 bg-violet-50/50 text-violet-900"
                          : "border-gray-200 bg-white text-gray-700"
                      }`}
                    >
                      <span>{item.label}</span>
                      <input
                        type="radio"
                        name="pronoun"
                        value={item.value}
                        checked={signUpData.pronoun === item.value}
                        onChange={(e) => setSignUpData({ ...signUpData, pronoun: e.target.value })}
                        className="accent-violet-600"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Policy note */}
              <p className="text-[11px] text-gray-500 leading-tight pt-1">
                {t.policyNote}
                <span className="text-violet-600 cursor-pointer hover:underline">{t.termsHighlight}</span>,{" "}
                <span className="text-violet-600 cursor-pointer hover:underline">{t.privacyHighlight}</span> và{" "}
                <span className="text-violet-600 cursor-pointer hover:underline">{t.standardsHighlight}</span>.
              </p>

              {/* Submit button */}
              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={isSignUpLoading}
                  className="w-full sm:w-4/5 mx-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-full text-base shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 outline-none focus:outline-none"
                >
                  {isSignUpLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  <span>{t.signUpSubmitBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORGOT PASSWORD MODAL */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div
            className="bg-white rounded-[28px] shadow-2xl w-full max-w-[420px] overflow-hidden border border-purple-100 transition-all transform animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{t.forgotTitle}</h3>
                <p className="text-gray-500 text-xs mt-0.5">
                  {t.forgotSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer outline-none focus:outline-none"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleForgotSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  {t.forgotEmailLabel}
                </label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 transition-all"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer outline-none focus:outline-none"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold shadow-md shadow-violet-600/20 cursor-pointer disabled:opacity-75 outline-none focus:outline-none"
                >
                  {isForgotLoading ? "..." : t.sendResetBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}