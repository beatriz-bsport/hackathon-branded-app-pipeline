import {
  initI18n,
  getAppI18nextProvider,
  getLanguageSwitcher,
} from "@bsport/i18n";
import { i18nNamespaces, i18nNamespacePrefix } from "../src/i18n";

const i18nInstance = initI18n({
  applicationName: i18nNamespacePrefix,
  namespaces: i18nNamespaces,
});

export const { AppI18nextProvider } = getAppI18nextProvider(i18nInstance);

export const kaizenLanguageSwitcher = getLanguageSwitcher(i18nInstance);
