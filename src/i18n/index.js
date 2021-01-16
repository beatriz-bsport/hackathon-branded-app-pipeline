import i18n from 'i18next'; // import Backend from 'i18next-locize-backend';
import ChainedBackend from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import axios from 'axios';

import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import Moment from 'moment-timezone';
import HttpBackend from 'i18next-http-backend';
import config from '../config';
import languages from './languages.json';

import 'moment/locale/fr';
import 'moment/locale/de';
import 'moment/locale/nl';
import 'moment/locale/es';
import 'moment/locale/it';

import namespaces from './namespaces.json';

// const isDebug = !['production', 'test'].includes(process.env.NODE_ENV);
const customRequest = config.I18N_CUSTOM_SERVER === 'TRUE';

const backendOptions = {};

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
  backendOptions.requestOptions = {
    cache: 'public',
  };
}

i18n
  .use(initReactI18next)
  // .use(Backend)
  .use(LanguageDetector)
  .use(HttpBackend)
  .init({
    backend: backendOptions,
    /*
    backend: {
      apiKey: 'e7f5edb0-1b19-4076-8e6e-c3da67653f8a',
      projectId: 'b1c9e9ef-f0d5-4dc1-b523-fc8bbf59117e',
      referenceLng: 'fr-FR',
    },
    */
    fallbackLng: {
      ca: ['es'],
      'ca-ES': ['es'],
      'fr-FR': ['fr'],
      default: ['en', 'fr'],
    },
    // lng: 'fr-FR',
    detection: {
      order: ['navigator'],
    },

    // have a common namespace used around the full app
    defaultNS: 'translation',

    debug: false, // !['production', 'test'].includes(process.env.NODE_ENV),
    partialBundledLanguages: true,
    supportedLngs: languages,

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
    lang: 'fr',
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

Moment.locale(i18n.language);

export default i18n;
export { Moment, availableLanguages };
