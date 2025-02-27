import React from "react";
import { initI18n, getLanguageSwitcher } from "@bsport/i18n";
import {
  ThemeProvider,
  i18nNamespaces,
  i18nNamespacePrefix,
  inMemoryTranslationsLoader,
  KaizenI18nProvider,
} from "@bsport/kaizen-primitive-core";

import DevTools, { type DevToolsProps } from "#src/dev-utils/DevTools";

type AppWrapperProps = {
  children: React.ReactNode;
} & DevToolsProps;

const kaizenI18nInstance = initI18n({
  applicationName: i18nNamespacePrefix,
  namespaces: i18nNamespaces,
  inMemoryTranslationsLoader: inMemoryTranslationsLoader,
  debug: true,
});

const kaizenLanguageSwitcher = getLanguageSwitcher(kaizenI18nInstance);

/**
 * A Wrapper to provide the features required for local development.
 * This should not be federated as it will be define in the Host Page.
 */
const AppWrapper: React.FC<AppWrapperProps> = ({
  children,
  i18nInstance,
  appsLanguageSwitchers = [],
}) => {
  return (
    <ThemeProvider>
      <KaizenI18nProvider kaizenI18nInstance={kaizenI18nInstance}>
        <div className="bg-surface-page min-h-screen">
          <DevTools
            i18nInstance={i18nInstance}
            appsLanguageSwitchers={[
              ...appsLanguageSwitchers,
              kaizenLanguageSwitcher,
            ]}
          />
          {children}
        </div>
      </KaizenI18nProvider>
    </ThemeProvider>
  );
};

export default AppWrapper;
