import React, { createContext } from "react";
import type { I18n } from "@bsport/i18n";

/**
 * Context to use in internationalized Kaizen components, as they need to use kaizenI18nInstance
 */
export const KaizenI18nContext = createContext<{
  kaizenI18nInstance: I18n | undefined;
}>({
  kaizenI18nInstance: undefined,
});

/**
 * Provide i18nInstance to Kaizen components inside an application.
 */
export const KaizenI18nProvider = ({
  kaizenI18nInstance,
  children,
}: {
  kaizenI18nInstance: I18n;
  children: React.ReactNode;
}) => (
  <KaizenI18nContext.Provider value={{ kaizenI18nInstance }}>
    {children}
  </KaizenI18nContext.Provider>
);
