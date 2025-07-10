import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import type translations from "#src/i18n/locales/en/translations.json";
import namespaces from "#src/i18n/namespaces.json";

const applicationName = __NAVIGATION_SIDEBAR__.__I18N_NAMESPACE_PREFIX__;
const applicationUrl = __NAVIGATION_SIDEBAR__.__APPLICATION_BASE_URL__;

export const { i18nInstance, useTranslation, AppI18nextProvider } =
  instanciateAppI18n<typeof translations>({
    applicationName,
    namespaces,
    applicationUrl,
    debug: import.meta.env.DEV,
  });

export type TFunction = TFunctionGeneric<typeof translations>;

export {
  Trans,
  LANGUAGES,
  LOCALES,
  type Locale,
  instanciateAppI18n,
} from "@bsport/i18n";
