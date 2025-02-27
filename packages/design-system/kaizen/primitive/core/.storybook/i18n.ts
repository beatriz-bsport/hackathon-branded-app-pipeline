import { initI18n } from "@bsport/i18n";
import { i18nNamespaces, i18nNamespacePrefix } from "../src/i18n";

export const i18nInstance = initI18n({
  applicationName: i18nNamespacePrefix,
  namespaces: i18nNamespaces,
});
