import React from "react";
import { instanciateAppI18n } from "@bsport/i18n";
import {
  ThemeProvider,
  i18nNamespaces,
  i18nNamespacePrefix,
  inMemoryTranslationsLoader,
  KaizenI18nProvider,
} from "@bsport/kaizen-primitive-core";

import DevTools from "#src/dev-utils/DevTools";

type AppWrapperProps = {
  children: React.ReactNode;
};

const { i18nInstance: kaizenI18nInstance } = instanciateAppI18n({
  applicationName: i18nNamespacePrefix,
  namespaces: i18nNamespaces,
  inMemoryTranslationsLoader: inMemoryTranslationsLoader,
  debug: true,
});

/**
 * A Wrapper to provide the features required for local development.
 * This should not be federated as it will be define in the Host Page.
 */
const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <KaizenI18nProvider kaizenI18nInstance={kaizenI18nInstance}>
        <div className="bg-surface-page min-h-screen">
          <DevTools i18nInstance={kaizenI18nInstance} />
          {children}
        </div>
      </KaizenI18nProvider>
    </ThemeProvider>
  );
};

export default AppWrapper;
