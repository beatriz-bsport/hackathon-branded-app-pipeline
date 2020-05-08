import i18n from 'i18next';
// import Backend from 'i18next-locize-backend';
import backend from 'i18next-http-backend';

import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';
import Moment from 'moment';
import 'moment/locale/fr';

i18n
  .use(reactI18nextModule)
  // .use(Backend)
  .use(backend)
  .use(LanguageDetector)
  .init({
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

    debug: !['production', 'test'].includes(process.env.NODE_ENV),

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
];

i18n.on('languageChanged', (lng) => {
  Moment.locale(lng);
});

Moment.locale(i18n.lng);

export default i18n;
export { Moment, availableLanguages };
