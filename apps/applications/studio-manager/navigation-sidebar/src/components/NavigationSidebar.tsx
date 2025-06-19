import { useMemo, useState } from "react";

import { Button, Card, NavigationMenu } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import { LOGIN_URL, logoutAction } from "@bsport/store-auth";

import { useBatchRoutingPermissions } from "#src/features/permissions";
import "#src/index.css";
import { AppI18nextProvider, useTranslation } from "#src/utils/i18n";

import FeedbackDialog, { useFeedbackDialog } from "./FeedbackDialog";
import LanguageDropdown from "./LanguageDropdown";
import { NavigationMenuElement } from "./NavigationMenuElement";
import NavigationSidebarHeader, {
  type MenuOption,
} from "./NavigationSidebarHeader";
import {
  TemporaryPasswordDialog,
  useTemporaryPasswordDialog,
} from "./TemporaryPasswordDialog";
import {
  type MenuSet,
  isDividerElement,
  isGroupElement,
  isItemElement,
  useNavigationElements,
} from "./navigation-items";
import { useProtectedItems } from "./navigation-protected-items";
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

  const { open, openDialog, closeDialog } = useFeedbackDialog();
  const {
    handleCloseTemporaryPasswordDialog,
    handleOpenTemporaryPasswordDialog,
    isTemporaryPasswordDialogOpen,
    isLoadingTemporaryPassword,
  } = useTemporaryPasswordDialog();

  const navigationElements = useNavigationElements({
    menuSet,
    navigationUrls,
    handleOpenTemporaryPasswordDialog,
  });

  const protectedElements = useProtectedItems(navigationElements);

  const elementsPermissions = useBatchRoutingPermissions(protectedElements);

  const renderNavigationItems = () => {
    if (menuSet === "settings") {
      return (
        <>
          <NavigationMenu.Group label={t("menus.settings.title")} />
          {navigationElements.map((item) => {
            if (isGroupElement(item)) return null;

            if (isItemElement(item)) {
              return (
                <NavigationMenuElement
                  key={item.id}
                  kind="item"
                  item={item}
                  navigate={navigate}
                  hasPermission={!!elementsPermissions.get(item.id)}
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
            /** @todo Do not render if the previous **rendered** element is also a Divider */
            // This can happen when a group of items is hidden due to permissions
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

          /** @todo When all subitems of a group are disabled / hidden, hide the group (divider and element) */
          return (
            <NavigationMenuElement
              key={element.id}
              kind="item"
              navigate={navigate}
              item={element}
              hasPermission={!!elementsPermissions.get(element.id)}
            >
              {element.subItems?.map((subItem) => (
                <NavigationMenuElement
                  key={subItem.id}
                  kind="subitem"
                  item={subItem}
                  navigate={navigate}
                  hasPermission={!!elementsPermissions.get(subItem.id)}
                />
              ))}
            </NavigationMenuElement>
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
      <TemporaryPasswordDialog
        isLoading={isLoadingTemporaryPassword}
        isOpen={isTemporaryPasswordDialogOpen}
        onClose={handleCloseTemporaryPasswordDialog}
      />
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
