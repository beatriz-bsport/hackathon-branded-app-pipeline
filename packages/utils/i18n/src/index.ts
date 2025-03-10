import { getUseTranslation } from "./translation.hook";
import { getWithTranslation } from "./translation.hoc";

export type UseTranslation<AppResources> = ReturnType<
  typeof getUseTranslation<AppResources>
>;
export type WithTranslation<AppResources> = ReturnType<
  typeof getWithTranslation<AppResources>
>;
export type TFunction<AppResources> = ReturnType<
  UseTranslation<AppResources>
>["t"];
export { getUseTranslation, getWithTranslation };
export {
  I18nextProvider,
  Trans,
  type UseTranslationOptions,
  type FallbackNs,
} from "react-i18next";
export type { i18n as I18n, TOptions } from "i18next";
export type { Locale, InMemoryTranslationsLoader } from "./types";
export * from "./constants";
export { initI18n } from "./initI18n";
export { getNamespacePrefixer, getLanguageSwitcher } from "./utils";
export { getAppI18nextProvider } from "./i18nextProvider";
