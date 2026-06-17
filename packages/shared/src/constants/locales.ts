export const LOCALES = ['en', 'es'] as const;
export const DEFAULT_LOCALE = 'en' as const;

export const LOCALE_CONFIG = {
  en: { name: 'English', nativeName: 'English', direction: 'ltr' as const },
  es: { name: 'Spanish', nativeName: 'Español', direction: 'ltr' as const },
} as const;

export type LocaleCode = (typeof LOCALES)[number];
