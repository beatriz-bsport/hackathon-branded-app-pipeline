import { useState } from "react";

import { Button, Card, NavigationMenu } from "@bsport/kaizen-primitive-core";

import { AppI18nextProvider, useTranslation } from "#src/utils/i18n";

import { useNavigationElements, type MenuSet } from "./navigation-items";
import NavigationSidebarHeader from "./NavigationSidebarHeader";
import LanguageDropdown from "./LanguageDropdown";

const NavigationSidebarContent = () => {
  const { t } = useTranslation("default");

  const [menuSet, setMenuSet] = useState<MenuSet>("default");
  const navigationElements = useNavigationElements({ menuSet });

  return (
    <div
      className={
        "h-screen hide-scrollbar w-[240px] py-md " +
        "bg-surface-page-navigation shrink-0 flex flex-col"
      }
    >
      <NavigationSidebarHeader
        // TODO: repalce with real data
        label="bsport studio"
        menuSet={menuSet}
        onSelectItem={(id) => {
          if (id === "settings") {
            setMenuSet(id);
          }
        }}
        onBack={() => setMenuSet("default")}
      />
      <div role="presentation" className="flex-1 overflow-y-scroll">
        <NavigationMenu className="px-xs" elements={navigationElements} />
        {menuSet === "settings" && <LanguageDropdown />}
      </div>
      <Card elevated className="p-xs mx-xs flex flex-col gap-2xs mt-[auto]">
        <Button
          className="justify-between"
          label={t("revampCard.betaFeedbackLink")}
          intent="flat"
          size="md"
          color="main"
          iconRight="link-external-02"
          fullWidth
        />
        <Button
          className="justify-between"
          label={t("revampCard.goBackToOldUi")}
          intent="flat"
          size="md"
          color="default"
          iconRight="arrow-right"
          fullWidth
        />
      </Card>
    </div>
  );
};

const NavigationSidebar = () => {
  return (
    <AppI18nextProvider>
      <NavigationSidebarContent />
    </AppI18nextProvider>
  );
};

export default NavigationSidebar;
