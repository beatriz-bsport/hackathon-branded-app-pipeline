import i18n from 'i18next';
// import Backend from 'i18next-locize-backend';
import ChainedBackend from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import axios from 'axios';

import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import Moment from 'moment-timezone';
import HttpBackend from 'i18next-http-backend';
import config from '../config';

import 'moment/locale/fr';
import 'moment/locale/de';
import 'moment/locale/nl';
import 'moment/locale/es';
import 'moment/locale/it';

import namespaces from './namespaces.json';

const isDebug = !['production', 'test'].includes(process.env.NODE_ENV);
const customRequest = config.I18N_CUSTOM_SERVER === 'TRUE';

const backendOptions = {};

if (isDebug) {
  backendOptions.expirationTime = 5 * 60 * 1000;
}
if (customRequest) {
  backendOptions.request = (options, url, payload, callback) => {
    const _url = `https://backoffice.bsport.io${url}`;
    axios
      .get(_url)
      .then((res) => callback(null, res))
      .catch((err) => {
        callback(err, false);
      });
  };
  backendOptions.crossDomain = true;
  backendOptions.withCredentials = true;
}

i18n
  .use(initReactI18next)
  // .use(Backend)
  .use(ChainedBackend)
  .use(LanguageDetector)
  .init({
    backend: {
      backends: isDebug ? [HttpBackend] : [LocalStorageBackend, HttpBackend],
      backendOptions: [backendOptions],
    },
    /*
    backend: {
      apiKey: 'e7f5edb0-1b19-4076-8e6e-c3da67653f8a',
      projectId: 'b1c9e9ef-f0d5-4dc1-b523-fc8bbf59117e',
      referenceLng: 'fr-FR',
    },
    */
    fallbackLng: {
      fr: ['fr-FR'],
      ca: ['es'],
      default: ['en', 'fr-FR'],
    },
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
