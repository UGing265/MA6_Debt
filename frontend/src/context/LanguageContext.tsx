"use client";

import React from "react";
import {
  defaultLocale,
  dictionaries,
  isLocale,
  localeDateTags,
  localeStorageKey,
  type I18nDictionary,
  type Locale,
} from "@/lib/i18n";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: I18nDictionary;
  dateLocale: string;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(defaultLocale);

  React.useEffect(() => {
    const storedLocale = window.localStorage.getItem(localeStorageKey);
    if (isLocale(storedLocale)) {
      setLocaleState(storedLocale);
    }
  }, []);

  const setLocale = React.useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem(localeStorageKey, nextLocale);
  }, []);

  const value = React.useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t: dictionaries[locale],
      dateLocale: localeDateTags[locale],
    }),
    [locale, setLocale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
