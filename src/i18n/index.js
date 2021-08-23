import i18n from 'i18next'; // import Backend from 'i18next-locize-backend';
import axios from 'axios';

import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import Moment from 'moment-timezone';
import HttpBackend from 'i18next-http-backend';
import config from '../config';
import languages from './languages.json';
import { getCurrencyDisplay } from '../libs/theme/selectors';

import 'moment/locale/fr';
import 'moment/locale/de';
import 'moment/locale/nl';
import 'moment/locale/es';
import 'moment/locale/it';
import 'moment/locale/en-gb';

const backendOptions = {};

const STORAGE_LANGUAGE_KEY = 'bsport:selected-language';

if (config.I18N_TRANSLATION_DOMAIN) {
  backendOptions.request = (options, url, payload, callback) => {
    const _url = `${config.I18N_TRANSLATION_DOMAIN}${url}`;
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
    fallbackLng: (code) => {
      if (!code || code === 'en') return ['en', 'fr'];
      // We maintain en-US and en-AU. Some regions will prefer en-AU.
      if (code.startsWith('en')) return ['en', 'fr'];
      if (code.startsWith('fr')) return ['fr', 'en'];
      if (code.startsWith('it')) return ['it', 'en', 'fr'];
      if (code.startsWith('nl')) return ['nl', 'en', 'fr'];
      if (code.startsWith('de')) return ['de', 'en', 'fr'];
      if (code.startsWith('ca')) return ['es', 'en', 'fr'];
      return ['en', 'fr'];
    },

    // lng: 'fr-FR',
    detection: {
      order: ['localStorage', 'navigator', 'cookie'],
    },
    load: 'languageOnly',

    // have a common namespace used around the full app
    defaultNS: 'translation',

    debug: false, // !['production', 'test'].includes(process.env.NODE_ENV),
    partialBundledLanguages: false,
    supportedLngs: languages,

    interpolation: {
      defaultVariables: { currencyDisplay: getCurrencyDisplay() },
      format(value, format) {
        if (format === 'uuid' && typeof value === 'string') {
          return value.slice(0, 8);
        }
        if (format === 'price') {
          if (typeof value === 'string')
            return `${value}${getCurrencyDisplay()}`;
          if (typeof value === 'number')
            return `${value.toFixed(2)}${getCurrencyDisplay()}`;
        }
        return value;
      },
    },
    react: {
      wait: true,
      useSuspense: false,

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
    lang: 'en-GB',
  },
  {
    lang: 'en-US',
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
  if (lng === 'en-GB') {
    Moment.locale('en-gb');
    return;
  }
  Moment.locale(lng);
});

Moment.locale(i18n.language);

const setLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
  if (window.localStorage) {
    window.localStorage.setItem(STORAGE_LANGUAGE_KEY, lng);
  }
};

export default i18n;
export { Moment, availableLanguages, setLanguage };

export const browserCountryCode = () => {
  if (navigator && navigator.language) {
    if (/[a-z]{2}-[A-Z]{2}/.test(navigator.language)) {
      return navigator.language.split('-')[1];
    }
    if (/[a-zA-Z]{2}/.test(navigator.language)) {
      return navigator.language.toUpperCase();
    }
  }
  return 'US';
};
