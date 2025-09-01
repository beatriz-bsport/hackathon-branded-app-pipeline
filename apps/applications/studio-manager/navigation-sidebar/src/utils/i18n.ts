import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import namespaces from "#src/i18n/namespaces.json";
import type defaultTranslations from "#src/i18n/source/default.json";
import type featuresTranslations from "#src/i18n/source/features.json";
import type feedbackDialogTranslations from "#src/i18n/source/feedbackDialog.json";

type Translations = {
  default: typeof defaultTranslations;
  feedbackDialog: typeof feedbackDialogTranslations;
  features: typeof featuresTranslations;
};

const applicationName = __NAVIGATION_SIDEBAR__.__I18N_NAMESPACE_PREFIX__;
const applicationUrl = __NAVIGATION_SIDEBAR__.__APPLICATION_BASE_URL__;

export const { i18nInstance, useTranslation, AppI18nextProvider } =
  instanciateAppI18n<Translations>({
    applicationName,
    namespaces,
    applicationUrl,
    debug: import.meta.env.DEV,
  });

export type TFunction = TFunctionGeneric<Translations>;

export {
  Trans,
  LANGUAGES,
  LOCALES,
  type Locale,
  instanciateAppI18n,
} from "@bsport/i18n";
