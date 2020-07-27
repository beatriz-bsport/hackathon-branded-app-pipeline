import i18n from 'i18next';
// import Backend from 'i18next-locize-backend';
import HttpBackend from 'i18next-http-backend';
import ChainedBackend from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';

import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import Moment from 'moment';
import 'moment/locale/fr';
import 'moment/locale/de';
import 'moment/locale/nl';
import 'moment/locale/it';

import namespaces from './namespaces.json';

const isDebug = !['production', 'test'].includes(process.env.NODE_ENV);

i18n
  .use(initReactI18next)
  // .use(Backend)
  .use(ChainedBackend)
  .use(LanguageDetector)
  .init({
    backend: {
      backends: isDebug ? [HttpBackend] : [LocalStorageBackend, HttpBackend],
      backendOptions: isDebug ? [{}] : [{ expirationTime: 30 * 60 * 1000 }, {}],
    },
    /*
    backend: {
      apiKey: 'e7f5edb0-1b19-4076-8e6e-c3da67653f8a',
      projectId: 'b1c9e9ef-f0d5-4dc1-b523-fc8bbf59117e',
      referenceLng: 'fr-FR',
    },
    */
    fallbackLng: 'fr-FR',
    // lng: 'fr-FR',
    detection: {
      order: ['cookie', 'navigator'],
      caches: ['cookie'],
      lookupCookie: 'i18next',
    },

    // have a common namespace used around the full app
    defaultNS: 'translation',

    debug: false, // !['production', 'test'].includes(process.env.NODE_ENV),

    interpolation: {
      format(value, format) {
        if (format === 'uuid' && typeof value === 'string') {
          return value.slice(0, 8);
        }
        if (format === 'price') {
          if (typeof value === 'string') return `${value}€`;
          if (typeof value === 'number') return `${value.toFixed(2)}€`;
        }
        return value;
      },
    },

    react: {
      wait: true,
      useSuspense: true,

      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default',
    },
  });

const availableLanguages = [
  {
    lang: 'fr-FR',
  },
  {
    lang: 'en',
  },
  {
    lang: 'es',
  },
  {
    lang: 'nl',
  },
  {
    lang: 'de',
  },
  {
    lang: 'it',
  },
];

i18n.on('languageChanged', (lng) => {
  Moment.locale(lng);
});
i18n.loadNamespaces(namespaces);

Moment.locale(i18n.language);

export default i18n;
export { Moment, availableLanguages };
