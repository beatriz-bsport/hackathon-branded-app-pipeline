import { createContext, useContext } from "react";

import { type IconName } from "#src/components/Icon";

export type ActiveTabData = { id: string; label: string; icon?: IconName };

export type TabsContextValue = {
  isResponsive: boolean;
  activeTab: string;
  setActiveTab: (id: string) => void;
  orientation: "vertical" | "horizontal";
  activeTabData?: Omit<ActiveTabData, "id">;
  setActiveTabData: (data: ActiveTabData) => void;
};

export const TabsContext = createContext<TabsContextValue | null>(null);

export const useTabsContext = () => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("TabsItem must be used within Tabs component");
  }

  return context;
};
