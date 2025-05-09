import { useState } from "react";
import { NavLink } from "react-router";

import { Button, Card, NavigationMenu } from "@bsport/kaizen-primitive-core";

import "#src/index.css";
import { AppI18nextProvider, useTranslation } from "#src/utils/i18n";

import FeedbackDialog, { useFeedbackDialog } from "./FeedbackDialog";
import LanguageDropdown from "./LanguageDropdown";
import NavigationSidebarHeader from "./NavigationSidebarHeader";
import { type MenuSet, useNavigationElements } from "./navigation-items";

const NavigationSidebarContent = () => {
  const { t } = useTranslation("default");

  const [menuSet, setMenuSet] = useState<MenuSet>("default");
  const navigationElements = useNavigationElements({ menuSet });

  const { open, openDialog, closeDialog } = useFeedbackDialog();

  const renderNavigationItems = () => {
    if (menuSet === "settings") {
      return (
        <>
          <NavigationMenu.Group label={t("menus.settings.title")} />
          {navigationElements.map((item) => {
            if (item.type === "group") return null;

            if ("id" in item && "label" in item) {
              return (
                <NavigationMenu.Item
                  key={item.id}
                  id={item.id}
                  label={item.label}
                />
              );
            }
            return null;
          })}
        </>
      );
    }

    return (
      <>
        {navigationElements.map((element, index) => {
          if (element.type === "divider") {
            return <NavigationMenu.Divider key={`divider-${index}`} />;
          }

          if (element.type === "group") {
            return (
              <NavigationMenu.Group
                key={`group-${index}`}
                label={element.label}
              />
            );
          }

          const item = ({ isActive }: { isActive?: boolean } = {}) => (
            <NavigationMenu.Item
              key={element.id}
              id={element.id}
              icon={element.icon}
              label={element.label}
              endSlot={element.endSlot}
              active={isActive}
            >
              {element.subItems?.map((subItem) => {
                const subItemElement = ({
                  isActive,
                }: { isActive?: boolean } = {}) => (
                  <NavigationMenu.SubItem
                    key={subItem.id}
                    id={subItem.id}
                    label={subItem.label}
                    active={isActive}
                  />
                );
                return subItem.href ? (
                  <NavLink key={subItem.id} to={subItem.href}>
                    {subItemElement}
                  </NavLink>
                ) : (
                  subItemElement()
                );
              })}
            </NavigationMenu.Item>
          );

          return element.href ? (
            <NavLink key={element.id} to={element.href}>
              {item}
            </NavLink>
          ) : (
            item()
          );
        })}
      </>
    );
  };

  return (
    <div
      className={
        "h-screen w-[240px] py-md " +
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
      <div
        role="presentation"
        className="flex-1 overflow-y-scroll hide-scrollbar"
      >
        <NavigationMenu className="px-xs">
          {renderNavigationItems()}
        </NavigationMenu>
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
          onClick={openDialog}
        />
      </Card>
      <FeedbackDialog open={open} onClose={closeDialog} />
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
