import { useMemo, useState } from "react";
import { NavLink } from "react-router";

import { Button, Card, NavigationMenu } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import { LOGIN_URL, logoutAction } from "@bsport/store-auth";

import "#src/index.css";
import { AppI18nextProvider, useTranslation } from "#src/utils/i18n";

import FeedbackDialog, { useFeedbackDialog } from "./FeedbackDialog";
import LanguageDropdown from "./LanguageDropdown";
import NavigationSidebarHeader, {
  type MenuOption,
} from "./NavigationSidebarHeader";
import {
  type MenuSet,
  NavigationSidebarSubItem,
  isDividerElement,
  isGroupElement,
  isItemElement,
  useNavigationElements,
} from "./navigation-items";
import { getNavigationUrls } from "./navigation-urls";

export type NavigationSidebarProps = {
  navigate?: (to: string) => void;
};

const NavigationSidebarContent = ({ navigate }: NavigationSidebarProps) => {
  const { t } = useTranslation("default");

  const isBridged = !!navigate;

  const [menuSet, setMenuSet] = useState<MenuSet>("default");

  const navigationUrls = useMemo(
    () => getNavigationUrls({ revampedBoEnabled: true }),
    [],
  );

  const navigationElements = useNavigationElements({ menuSet, navigationUrls });

  const { open, openDialog, closeDialog } = useFeedbackDialog();

  const renderNavigationItems = () => {
    if (menuSet === "settings") {
      return (
        <>
          <NavigationMenu.Group label={t("menus.settings.title")} />
          {navigationElements.map((item) => {
            if (isGroupElement(item)) return null;

            if (isItemElement(item)) {
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
          if (isDividerElement(element)) {
            return <NavigationMenu.Divider key={`divider-${index}`} />;
          }

          if (isGroupElement(element)) {
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
              {...(isBridged &&
                navigate &&
                element.href && { onClick: () => navigate(element.href!) })}
            >
              {element.subItems?.map((subItem: NavigationSidebarSubItem) => {
                const subItemElement = ({
                  isActive,
                }: { isActive?: boolean } = {}) => (
                  <NavigationMenu.SubItem
                    key={subItem.id}
                    id={subItem.id}
                    label={subItem.label}
                    active={isActive}
                    {...(isBridged &&
                      navigate &&
                      subItem.href && {
                        onClick: () => navigate(subItem.href!),
                      })}
                  />
                );

                if (!subItem.href) {
                  return subItemElement();
                }

                return !isBridged ? (
                  <NavLink key={subItem.id} to={subItem.href}>
                    {subItemElement}
                  </NavLink>
                ) : (
                  subItemElement()
                );
              })}
            </NavigationMenu.Item>
          );

          if (!element.href) {
            return item();
          }

          return !isBridged ? (
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

  const companyTheme = dataAccessLayer.useCompanyTheme();
  const {
    company: companyId,
    company_name: companyName,
    cover: companyLogo,
  } = companyTheme ?? {};

  return (
    <div
      className={
        "h-screen w-[240px] py-md " +
        "bg-surface-page-navigation shrink-0 flex flex-col"
      }
    >
      <NavigationSidebarHeader
        avatarUrl={companyLogo}
        label={companyName ?? ""}
        menuSet={menuSet}
        onSelectItem={(id: MenuOption) => {
          if (id === "settings") {
            setMenuSet(id);
          }
          if (id === "logout") {
            const navigateToLoginPage = () => {
              const loginUrl = `${LOGIN_URL}/signout${companyId ? `?membership=${companyId}` : ""}`;
              if (isBridged) {
                navigate(loginUrl);
              } else {
                window.location.href = loginUrl;
              }
            };
            logoutAction(navigateToLoginPage);
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

const NavigationSidebar = (props: NavigationSidebarProps) => {
  return (
    <AppI18nextProvider>
      <NavigationSidebarContent {...props} />
    </AppI18nextProvider>
  );
};

export default NavigationSidebar;
