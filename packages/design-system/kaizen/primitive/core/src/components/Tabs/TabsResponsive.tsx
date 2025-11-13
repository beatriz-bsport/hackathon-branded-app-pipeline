import type { ReactNode } from "react";

import Button from "#src/components/Button";
import DropdownMenu from "#src/components/DropdownMenu";
import Popover from "#src/components/Popover";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import type { TabConfig } from "./Tabs";
import { TabsContext, useTabsContext } from "./TabsContext";

type TabsResponsiveProps = {
  className?: string;
  TabsItems: Array<ReactNode>;
  activeTab: string;
  setActiveTab: (id: string) => void;
  tabs: Array<TabConfig>;
};

/**
 * Internal component that renders tabs as a dropdown menu for mobile viewports.
 * Used automatically by the Tabs component when viewport is below "sm" breakpoint.
 *
 * Simplified to render children directly - TabsItem components automatically
 * render as DropdownMenu.Items via TabsContext.
 *
 * @internal
 */
export function TabsResponsive({
  className,
  TabsItems,
  activeTab,
  setActiveTab,
  tabs,
}: TabsResponsiveProps) {
  const i18n = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n });
  const parentContext = useTabsContext();

  const activeTabData = parentContext.activeTabData;

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    const selectedTab = tabs.find((tab) => tab.id === id);
    if (selectedTab) {
      parentContext.setActiveTabData({
        id,
        label: selectedTab.label,
        icon: selectedTab.icon,
      });
    }
  };

  // Context for hidden container: force desktop rendering for NavLink state sync
  const hiddenContainerContext = {
    ...parentContext,
    isResponsive: false,
  };

  return (
    <>
      {/* Hidden container to keep TabsItems mounted for the active tab when the dropdown content is not mounted */}
      {/* Uses non-responsive context so TabsItems render as regular tabs, not DropdownMenu.Items */}
      <TabsContext.Provider value={hiddenContainerContext}>
        <div className="hidden" aria-hidden="true">
          {TabsItems}
        </div>
      </TabsContext.Provider>

      <DropdownMenu
        className={className}
        selectedValues={activeTab ? [activeTab] : []}
        onSelectedValuesChange={(values) => handleSelectTab(values[0])}
        onSelectItem={handleSelectTab}
      >
        <DropdownMenu.Trigger>
          {({ setIsOpen, isOpen }) => (
            <Button
              kind="default"
              intent="default"
              color="main"
              size="md"
              iconLeft={activeTabData?.icon}
              iconRight="chevron-down"
              label={activeTabData?.label || t("tabs.selectTab")}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={`Tab navigation: ${activeTabData?.label}`}
            />
          )}
        </DropdownMenu.Trigger>
        <Popover.Content placement="bottom-left">
          {() => <DropdownMenu.Content>{TabsItems}</DropdownMenu.Content>}
        </Popover.Content>
      </DropdownMenu>
    </>
  );
}

TabsResponsive.displayName = "TabsResponsive";
