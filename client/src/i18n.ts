import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from 'locales/en/translation.json';
import translationES from 'locales/es/translation.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  lng: 'en',
  resources: {
    en: {
      translation: translationEN,
    },
    es: {
      translation: translationES,
    },
  },
  returnNull: false,
});

export default i18n;
