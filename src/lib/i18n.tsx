'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { en, type TranslationKey } from './translations/en';
import { zh } from './translations/zh';

type Lang = 'en' | 'zh';

const translations: Record<Lang, Record<TranslationKey, string>> = { en, zh };

const STORAGE_KEY = 'mnemox_lang';

interface I18nContextValue {
  lang: Lang;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'zh') return stored;
  return navigator.language.startsWith('zh') ? 'zh' : 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLang(getInitialLang());
    setMounted(true);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next: Lang = prev === 'en' ? 'zh' : 'en';
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next === 'zh' ? 'zh-Hant' : 'en';
      return next;
    });
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>): string => {
      let text: string = translations[lang][key] ?? translations.en[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          text = text.replace(`{${k}}`, String(v));
        }
      }
      return text;
    },
    [lang],
  );

  // Avoid hydration mismatch — render English on server, real lang after mount
  const value: I18nContextValue = {
    lang: mounted ? lang : 'en',
    t: mounted ? t : (key, vars) => {
      let text: string = en[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          text = text.replace(`{${k}}`, String(v));
        }
      }
      return text;
    },
    toggleLang,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
