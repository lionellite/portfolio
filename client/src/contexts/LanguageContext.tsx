import { createContext, useContext, useMemo, useState } from "react";

type Language = "en" | "fr";
type TranslationKey = keyof typeof translations.en;

const translations = {
  en: {
    navHome: "ROOT", navHomeCaption: "profile", navProjects: "SYSTEMS", navProjectsCaption: "projects", navBlog: "LOGS", navBlogCaption: "notes", navContact: "CONTACT", navContactCaption: "contact", contactCommand: "init_contact()", languageLabel: "Language", english: "English", french: "French", homeAria: "Lionel Adoukonou portfolio home", status: "SYSTEM_STATUS: NOMINAL", available: "AVAILABLE", profileModule: "PROFILE_MODULE", focus: "FOCUS", stack: "STACK", zone: "ZONE", backend: "BACKEND", openChannel: "OPEN A CHANNEL", contactCta: "Have a system to clarify?", contactCtaText: "API, automation, deployment or infrastructure: share the context and constraints. I will reply with a useful first read.", talkNeed: "Talk about your need", exploreProjects: "Explore my projects", startConversation: "Start a conversation", heroEyebrow: "LIONEL ADOUKONOU · BACKEND / DEVOPS / CLOUD", heroTitle: "I build reliable systems,", heroTitleAccent: "one line of code at a time.", qualityEyebrow: "QUALITY COMMITMENT", qualityTitle: "Reliability is prepared", qualityAccent: "beforehand.", selectedProjects: "SELECTED PROJECTS", projectsTitle: "Systems", projectsAccent: "running in production.", viewAll: "View all projects",
  },
  fr: {
    navHome: "ROOT", navHomeCaption: "profil", navProjects: "SYSTEMS", navProjectsCaption: "projets", navBlog: "LOGS", navBlogCaption: "notes", navContact: "CONTACT", navContactCaption: "échange", contactCommand: "init_contact()", languageLabel: "Langue", english: "Anglais", french: "Français", homeAria: "Accueil du portfolio de Lionel Adoukonou", status: "SYSTEM_STATUS: NOMINAL", available: "DISPONIBLE", profileModule: "PROFILE_MODULE", focus: "FOCUS", stack: "STACK", zone: "ZONE", backend: "BACKEND", openChannel: "OUVRIR UN CANAL", contactCta: "Un système à clarifier ?", contactCtaText: "API, automatisation, déploiement ou infrastructure : partagez le contexte et les contraintes. Je vous répondrai avec une première lecture utile.", talkNeed: "Parler de votre besoin", exploreProjects: "Explorer mes projets", startConversation: "Démarrer une conversation", heroEyebrow: "LIONEL ADOUKONOU · BACKEND / DEVOPS / CLOUD", heroTitle: "Je construis des systèmes fiables,", heroTitleAccent: "une ligne de code à la fois.", qualityEyebrow: "ENGAGEMENT QUALITÉ", qualityTitle: "La fiabilité se", qualityAccent: "prépare en amont.", selectedProjects: "PROJETS SÉLECTIONNÉS", projectsTitle: "Des systèmes", projectsAccent: "mis en production.", viewAll: "Voir tous les projets",
  },
} as const;

function detectLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem("portfolio-language");
  if (saved === "fr" || saved === "en") return saved;
  return navigator.languages?.some(language => language.toLowerCase().startsWith("fr")) || navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en";
}

type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; toggleLanguage: () => void; t: (key: TranslationKey) => string };
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectLanguage);
  const setLanguage = (next: Language) => { setLanguageState(next); window.localStorage.setItem("portfolio-language", next); };
  const value = useMemo(() => ({ language, setLanguage, toggleLanguage: () => setLanguage(language === "en" ? "fr" : "en"), t: (key: TranslationKey) => translations[language][key] }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
