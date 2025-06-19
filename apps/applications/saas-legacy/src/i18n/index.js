import i18n from 'i18next'; // import Backend from 'i18next-locize-backend';
import axios from 'axios';

import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import { Settings } from 'luxon';
import {
  AUDIENCE_FEATURE_NAME,
  AUDIENCE_WORKFLOW_NAME,
  AUDIENCE_WORKFLOW_NAME_PLURAL,
} from '#src/libs/sequential_marketing/constants';
import { STORAGE_KEY_BSPORT_I18NEXTLNG } from '../actions/constants';
import { getItemInStorage, setItemInStorage } from '../utils/storage';

import config from '../config';
import { LANGUAGES, AVAILABLE_LANGUAGES } from './languages';
import { getCurrencyDisplay } from '../libs/theme/selectors';
import {
  LANGUAGE_SWITCHER_ACTION,
  LANGUAGE_SWITCHER_CHANNEL,
} from './utils/switch-language';

const backendOptions = {};

const STORAGE_LANGUAGE_KEY = 'bsport:selected-language';

export const EXTRA_TIMEZONES = {
  FR: [
    'Indian/Reunion',
    'America/Martinique',
    'Indian/Antananarivo',
    'America/Cayenne',
    'Africa/Casablanca',
    'Africa/Tunis',
    'Pacific/Noumea',
  ],
  US: ['America/Jamaica', 'Asia/Manila', 'Asia/Kuala_Lumpur'],
  NL: ['America/Curacao'],
};

if (config.I18N_TRANSLATION_DOMAIN || process.env.NODE_ENV !== 'production') {
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
      const fallback = process.env.NODE_ENV === 'development' ? [] : [];
      if (!code || code === 'en') return ['en', 'fr', ...fallback];
      // We maintain en-US and en-AU. Some regions will prefer en-AU.
      if (code.startsWith('en')) return ['en', 'fr', ...fallback];
      if (code.startsWith('fr')) return ['fr', 'en', ...fallback];
      if (code.startsWith('it')) return ['it', 'en', 'fr', ...fallback];
      if (code.startsWith('nl')) return ['nl', 'en', 'fr', ...fallback];
      if (code.startsWith('de')) return ['de', 'en', 'fr', ...fallback];
      if (code.startsWith('ca')) return ['es', 'en', 'fr', ...fallback];
      if (code.startsWith('pt')) return ['pt', 'en', 'fr', ...fallback];
      if (code.startsWith('cs')) return ['cs', 'en', 'fr', ...fallback];
      return ['en', 'fr', 'af'];
    },
    detection: {
      order: ['localStorage', 'navigator', 'cookie'],
    },
    load: 'languageOnly',
    // have a common namespace used around the full app
    defaultNS: 'translation',

    debug: false, // !['production', 'test'].includes(process.env.NODE_ENV),
    partialBundledLanguages: false,
    supportedLngs: Object.values(LANGUAGES),

    interpolation: {
      defaultVariables: {
        currencyDisplay: getCurrencyDisplay(),
        audienceCamelCase: AUDIENCE_FEATURE_NAME,
        workflowCamelCase: AUDIENCE_WORKFLOW_NAME,
        workflowLowerCase: AUDIENCE_WORKFLOW_NAME.toLowerCase(),
        workflowPluralCamelCase: AUDIENCE_WORKFLOW_NAME_PLURAL,
        workflowPluralLowerCase: AUDIENCE_WORKFLOW_NAME_PLURAL.toLowerCase(),
      },
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
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default',
    },
  });

export const LOCALES_WITH_FIRST_WEEKDAY_BEING_SUNDAY = ['en-US', 'en-CA'];

const setLuxonLocale = (language: string) => {
  Settings.defaultLocale = language;
  if (LOCALES_WITH_FIRST_WEEKDAY_BEING_SUNDAY.includes(language)) {
    Settings.defaultWeekSettings = {
      firstDay: 7,
      minimalDays: 1,
      weekend: [6, 7],
    };
  } else {
    Settings.defaultWeekSettings = null;
  }
};

// Synchronize its language to broadcast event sent by the revamped Navigation Sidebar
const broadcast = new BroadcastChannel(LANGUAGE_SWITCHER_CHANNEL);
broadcast.addEventListener('message', (event) => {
  const { action, payload } = event.data;
  if (action === LANGUAGE_SWITCHER_ACTION) {
    i18n.changeLanguage(payload);
  }
});

i18n.on('languageChanged', (lng) => {
  setLuxonLocale(lng);
});

setLuxonLocale(i18n.language);

const setLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
  setItemInStorage('local', STORAGE_LANGUAGE_KEY, lng);
};

const getLanguage = () => {
  const language =
    getItemInStorage('local', STORAGE_KEY_BSPORT_I18NEXTLNG)?.slice(0, 2) ??
    'en';

  return language;
};

/**
 * Retrieves the selected bsport locale without slice
 */
export const getFullLanguage = () => {
  const language =
    getItemInStorage('local', STORAGE_KEY_BSPORT_I18NEXTLNG) ?? 'en-GB';
  return language;
};

export default i18n;
export {
  AVAILABLE_LANGUAGES,
  LANGUAGES,
  setLanguage,
  getLanguage,
  setLuxonLocale,
};

export { switchLanguage } from './utils/switch-language';

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
