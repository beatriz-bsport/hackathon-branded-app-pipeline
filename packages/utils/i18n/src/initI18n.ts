import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import backend, { type HttpBackendOptions } from "i18next-http-backend";
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

/**
 * Initialize the i18n instance of the related application
 * @param applicationName Name of the application, used to prefix namespaces in i18n-management.
 * @param applicationUrl [Optional]
 * URL of the application, to indicate where to fetch public translations files.
 * If not provided, used by default the current URL (where `vite dev` is running)
 * @param namespaces List of namespaces (without prefix) related to the application
 * @returns An i18n instance fully configured, to provide to I18NextProvider
 */
export function initI18n({
  applicationName,
  applicationUrl,
  namespaces,
}: I18nConfig) {
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
    .init<HttpBackendOptions>({
      // backend options to provide to the HttpBackend object
      // learn more: https://github.com/i18next/i18next-http-backend?tab=readme-ov-file#backend-options
      backend: {
        // allow cross domain requests
        crossDomain: false,
        // allow credentials on cross domain requests
        withCredentials: false,
        // options to provide to the request
        requestOptions: {
          mode: "cors",
          cache: "default",
          method: "GET",
        },
        // url provided to the request (endpoint to fetch backend to get translations files)
        // if applicationUrl is not provided, then it uses the current url as base
        loadPath: applicationUrl
          ? `${applicationUrl}/locales/{{lng}}/{{ns}}.json`
          : "/locales/{{lng}}/{{ns}}.json",
      },
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
