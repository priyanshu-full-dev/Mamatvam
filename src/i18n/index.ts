import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';
import te from './locales/te.json';

export const defaultNS = 'common';
export const resources = {
  en: { common: en.common, splash: en.splash, onboarding: en.onboarding, auth: en.auth, language: en.language },
  hi: { common: hi.common, splash: hi.splash, onboarding: hi.onboarding, auth: hi.auth, language: hi.language },
  bn: { common: bn.common, splash: bn.splash, onboarding: bn.onboarding, auth: bn.auth, language: bn.language },
  te: { common: te.common, splash: te.splash, onboarding: te.onboarding, auth: te.auth, language: te.language },
} as const;

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
