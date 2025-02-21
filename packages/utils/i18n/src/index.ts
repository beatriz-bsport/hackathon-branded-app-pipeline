export { I18nextProvider, Trans } from "react-i18next";
export type { TFunction, i18n as I18n } from "i18next";
export { LOCALES, LANGUAGES, type Locale } from "./constants";
export { initI18n } from "./initI18n";
export { getWithTranslation } from "./translation.hoc";
export { getUseTranslation } from "./translation.hook";
export { getNamespacePrefixer, getLanguageSwitcher } from "./utils";
