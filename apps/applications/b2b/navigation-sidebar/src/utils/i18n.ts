import {
  initI18n,
  getUseTranslation,
  getAppI18nextProvider,
  type TFunction as BaseTFunction,
} from "@bsport/i18n";
import { getAppPort, type APPLICATION } from "@bsport/config-federation";
import namespaceList from "#src/i18n/namespaces.json";
import type translations from "#src/i18n/locales/en/translations.json";

const i18nNamespacePrefix = import.meta.env.VITE_I18N_NAMESPACE_PREFIX;
const applicationUrl = import.meta.env.VITE_APPLICATION_BASE_URL;
const applicationName: APPLICATION = "navigation-sidebar";

export const i18nInstance = initI18n({
  applicationName: i18nNamespacePrefix,
  namespaces: namespaceList,
  applicationUrl: `${applicationUrl}:${getAppPort(applicationName)}`,
});

export const useTranslation = getUseTranslation<typeof translations>({
  applicationName: i18nNamespacePrefix,
});

export type TFunction = BaseTFunction<typeof translations>;

export const { AppI18nextProvider } = getAppI18nextProvider(i18nInstance);
