import { instanciateAppI18n, type TFunctionGeneric } from "@bsport/i18n";
import { getAppPort, type APPLICATION } from "@bsport/config-federation";
import namespaceList from "#src/i18n/namespaces.json";
import type translations from "#src/i18n/locales/en/translations.json";

const i18nNamespacePrefix = import.meta.env.VITE_I18N_NAMESPACE_PREFIX;
const applicationUrl = import.meta.env.VITE_APPLICATION_BASE_URL;
const applicationName: APPLICATION = "navigation-sidebar";

export const {
  i18nInstance,
  useTranslation,
  AppI18nextProvider,
  languageSwitcher,
} = instanciateAppI18n<typeof translations>({
  applicationName: i18nNamespacePrefix,
  namespaces: namespaceList,
  applicationUrl: `${applicationUrl}:${getAppPort(applicationName)}`,
});

export type TFunction = TFunctionGeneric<typeof translations>;
