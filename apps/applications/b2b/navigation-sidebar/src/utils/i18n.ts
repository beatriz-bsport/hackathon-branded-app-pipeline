import { initI18n, getUseTranslation } from "@bsport/i18n";
import namespaceList from "#src/i18n/namespaces.json";
import { getAppPort, type APPLICATION } from "@bsport/config-federation";

const i18nNamespacePrefix = import.meta.env.VITE_I18N_NAMESPACE_PREFIX;
const applicationUrl = import.meta.env.VITE_APPLICATION_BASE_URL;
const applicationName: APPLICATION = "navigation-sidebar";

export const i18nInstance = initI18n({
  applicationName: i18nNamespacePrefix,
  namespaces: namespaceList,
  applicationUrl: `${applicationUrl}:${getAppPort(applicationName)}`,
});

export const useTranslation: ReturnType<typeof getUseTranslation> =
  getUseTranslation({
    applicationName: i18nNamespacePrefix,
  });

export { type TFunction, I18nextProvider } from "@bsport/i18n";
