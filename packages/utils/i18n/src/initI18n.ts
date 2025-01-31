import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import backend from "i18next-http-backend";
import languageDetector from "i18next-browser-languagedetector";

import {
  setLuxonLocale,
  getFallbackLanguage,
  getNamespacePrefixer,
} from "./utils";
import { LANGUAGES, type InitConfig } from "./constants";

type I18nConfig = {
  namespaces: string[];
} & InitConfig;

export function initI18n({ applicationName, namespaces }: I18nConfig) {
  const namespacePrefixer = getNamespacePrefixer({ applicationName });
  i18n
    // load translation using http
    // learn more: https://github.com/i18next/i18next-http-backend
    .use(backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(languageDetector)
    // passes i18n down to react-i18next
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
      // language to use if translations in user language are not available
      // learn more: https://www.i18next.com/principles/fallback#language-fallback
      fallbackLng: getFallbackLanguage,
      // array of allowed languages
      supportedLngs: Object.values(LANGUAGES),
      debug: false,
      // string or array of namespaces to load
      ns: (namespaces || []).map(namespacePrefixer),
      interpolation: {
        escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
      },
    });

  i18n.on("languageChanged", (lng) => {
    setLuxonLocale(lng);
  });

  setLuxonLocale(i18n.language);

  return i18n;
}
