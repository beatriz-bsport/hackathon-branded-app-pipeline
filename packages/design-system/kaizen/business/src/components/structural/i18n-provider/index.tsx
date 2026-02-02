import { createContext } from "react";

import type { I18n } from "@bsport/i18n";

type KaizenI18nContextType = {
  kaizenI18nInstance: I18n | undefined;
};

export const KaizenI18nContext = createContext<KaizenI18nContextType>({
  kaizenI18nInstance: undefined,
});
