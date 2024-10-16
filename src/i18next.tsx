import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from '../src/assets/i18n/en.json';
import platformLanguages from './libs/constants/platFormLanguages';

const resources = {
  en: {
    translation: translationEN
  }
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    interpolation: {
      escapeValue: false 
    },
    load: 'languageOnly',
    saveMissingPlurals: false,
    supportedLngs: platformLanguages.languageArray,
    fallbackLng: 'en',
    debug: false,
    react: {
      useSuspense: true
    },
    detection: {
      order: ['path', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    initImmediate: false,
    resources
  });

export default i18n;