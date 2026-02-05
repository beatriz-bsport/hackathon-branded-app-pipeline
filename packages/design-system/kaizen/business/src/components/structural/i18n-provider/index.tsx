import { createContext } from "react";

import type { I18n } from "@bsport/i18n";

type KaizenI18nContextType = {
  kaizenI18nInstance: I18n | undefined;
};

export const KaizenBusinessI18nContext = createContext<KaizenI18nContextType>({
  kaizenI18nInstance: undefined,
});

/**
 * Provide i18nInstance to Kaizen components inside an application.
 */
export const KaizenBusinessI18nProvider = ({
  kaizenI18nInstance,
  children,
}: {
  kaizenI18nInstance: I18n;
  children: React.ReactNode;
}) => (
  <KaizenBusinessI18nContext.Provider value={{ kaizenI18nInstance }}>
    {children}
  </KaizenBusinessI18nContext.Provider>
);
