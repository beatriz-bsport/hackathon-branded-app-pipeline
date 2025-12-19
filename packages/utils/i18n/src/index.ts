/* ----- Export types and constants ----- */
export * from "./constants";
export type { i18n as I18n, TOptions } from "i18next";
export type { UseTranslationOptions, FallbackNs } from "react-i18next";
export type {
  Locale,
  InMemoryTranslationsLoader,
  DeepKeys,
  GetDictValue,
} from "./types";
export type { TFunctionGeneric } from "./translation.hook";

/* ----- Export based functions that can be useful in specific cases ----- */
export { getUseTranslation } from "./translation.hook";
export { Trans, I18nextProvider } from "react-i18next";
export { switchLanguage } from "./utils";

/* ----- Export main function ----- */
export { instanciateAppI18n } from "./instanciateAppI18n";
