import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";
import { TranslationKeys } from "./types";

// Supported languages
type Lang = "he" | "en";

// Context value shape
type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: keyof TranslationKeys) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem("lang");
    return stored === "he" || stored === "en" ? stored : "he";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);

  const t = (key: keyof TranslationKeys) => translations[lang][key];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
};
