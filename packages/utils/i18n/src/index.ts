import { getUseTranslation } from "./translation.hook";
import { getWithTranslation } from "./translation.hoc";

type UseTranslation = ReturnType<typeof getUseTranslation>;
type WithTranslation = ReturnType<typeof getWithTranslation>;

export type { UseTranslation, WithTranslation };
export { getUseTranslation, getWithTranslation };

export { I18nextProvider, Trans } from "react-i18next";
export type { TFunction, i18n as I18n } from "i18next";
export * from "./constants";
export { initI18n } from "./initI18n";
export { getNamespacePrefixer, getLanguageSwitcher } from "./utils";
