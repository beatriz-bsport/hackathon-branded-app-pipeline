import i18n from "i18next";
import httpBackend from "i18next-http-backend";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

import { getCurrencyDisplay } from "@bsport/currency";

import {
  LANGUAGES,
  LANGUAGE_SWITCHER_ACTION,
  LANGUAGE_SWITCHER_CHANNEL,
} from "./constants";
import { detectorOrder, languageDetector } from "./languageDetector";
import type { InMemoryTranslationsLoader, InitConfig } from "./types";
import {
  format,
  getFallbackLanguage,
  getNamespacePrefixer,
  setLuxonLocale,
} from "./utils";

type I18nConfig = {
  namespaces: string[];
} & InitConfig;

/**
 * Initialize the i18n instance of the related application
 * @param applicationName Name of the application, used to prefix namespaces in i18n-management.
 * @param applicationUrl [Optional]
 * URL of the application, to indicate where to fetch public translations files.
 * If not provided, used by default the current URL (where `vite dev` is running)
 * @param debug [Optional] Whether to active the debug mode that shows missing keys
 * @param inMemoryTranslationsLoader [Optional]
 * Async function which returns, given an (unprefixed) namespace and locale, the related translation object
 * If provided, i18n will load translations with in memory method. Else, it uses backend method (public/locales).
 * @param namespaces List of namespaces (without prefix) related to the application
 * @returns An i18n instance fully configured, to provide to I18NextProvider
 */
export function initI18n({
  applicationName,
  applicationUrl,
  debug = false,
  inMemoryTranslationsLoader,
  namespaces,
}: I18nConfig) {
  // ----- UTILS -----
  // Function to prefix a given namespace with the provided applicationName
  const namespacePrefixer = getNamespacePrefixer({ applicationName });
  // Function to remove the prefix of a namespace
  const namespaceUnprefixer = (namespace: string) =>
    namespace.split(`${applicationName}_`)[1];

  // ----- BACKEND INITIALISATORS -----
  // Initialize an HTTP Backend that loads translations using http from /public/locales
  // learn more: https://github.com/i18next/i18next-http-backend
  const getHttpBackend = () =>
    new httpBackend(
      null,
      // backend options to provide to the HttpBackend object
      // learn more: https://github.com/i18next/i18next-http-backend?tab=readme-ov-file#backend-options
      {
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
    );

  // Initialize a "in memory" backend that uses either an object or a loader
  // CF example : https://github.com/i18next/i18next-resources-to-backend/blob/main/test/chained-backend.spec.js
  const getInMemoryBackend = () => {
    if (!inMemoryTranslationsLoader) {
      // Fallback with a default resource to be sure we don't break i18n
      return resourcesToBackend({});
    }
    // The input of resourcesToBackend contains prefixed namespaces
    // While the applications will read unprefixed namespaces within their src/i18n/locales files
    const fixedInMemoryLoader: InMemoryTranslationsLoader = async (
      locale,
      namespace,
    ) =>
      await inMemoryTranslationsLoader(locale, namespaceUnprefixer(namespace));
    return resourcesToBackend(fixedInMemoryLoader);
  };

  // ----- CREATE I18N INSTANCE -----
  const i18nInstance = i18n.createInstance();
  i18nInstance
    .use(inMemoryTranslationsLoader ? getInMemoryBackend() : getHttpBackend())
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
      // strategy to define which language codes to lookup. Example: given set language is en-US:
      //  - 'all' ⇒ ['en-US', 'en', 'dev']
      //  - 'currentOnly' ⇒ 'en-US'
      //  - 'languageOnly' ⇒ 'en'
      load: "languageOnly",
      debug: debug,
      // language detector options
      detection: {
        order: detectorOrder,
      },
      // string or array of namespaces to load
      ns: (namespaces ?? []).map(namespacePrefixer),
      interpolation: {
        // global variables to use in interpolation replacements
        defaultVariables: {
          currencyDisplay: getCurrencyDisplay(),
          format,
        },
        escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
      },
    });

  // ----- LISTENERS -----
  const broadcast = new BroadcastChannel(LANGUAGE_SWITCHER_CHANNEL);
  broadcast.addEventListener("message", (event) => {
    const { action, payload } = event.data;
    if (action === LANGUAGE_SWITCHER_ACTION) {
      i18nInstance.changeLanguage(payload);
    }
  });

  i18nInstance.on("languageChanged", (lng) => {
    setLuxonLocale(lng);
  });

  i18nInstance.on("failedLoading", (language, namespace, message) =>
    console.error({ language, namespace, message }),
  );

  setLuxonLocale(i18nInstance.language);

  return i18nInstance;
}
