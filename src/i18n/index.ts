import i18n from 'i18next';
import axios from 'axios';

import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import { getEnv } from '../utils/env';

const backendOptions: any = {};

backendOptions.request = (
  options: any,
  url: string,
  payload: any,
  callback: any,
) => {
  const { I18N_TRANSLATION_DOMAIN } = getEnv();
  const _url = `${I18N_TRANSLATION_DOMAIN}${url}`;
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

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpBackend)
  .init({
    backend: backendOptions,
    fallbackLng: {
      ca: ['es'],
      'ca-ES': ['es'],
      default: ['en', 'fr'],
    },
    detection: {
      order: ['navigator'],
    },
    load: 'languageOnly',
    defaultNS: 'translation',

    debug: false, // !['production', 'test'].includes(process.env.NODE_ENV),
    partialBundledLanguages: true,
    supportedLngs: ['fr', 'en', 'es', 'nl', 'de', 'it'],
    react: {
      wait: true,
      useSuspense: true,

      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default',
    },
  });

export default i18n;
