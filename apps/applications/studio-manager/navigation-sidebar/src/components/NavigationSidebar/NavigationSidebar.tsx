import { useMemo, useState } from "react";

import {
  Button,
  Card,
  KaizenI18nProvider,
  NavigationMenu,
  Sidebar,
  i18nNamespacePrefix,
  i18nNamespaces,
  inMemoryTranslationsLoader,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import { LOGIN_URL, logoutAction } from "@bsport/store-auth";

import { useAlerts } from "#src/api/use-alerts";
import {
  AttendanceModal,
  useAttendanceModal,
  useAttendancePermissions,
} from "#src/components/AttendanceModal";
import {
  NotificationsModal,
  useNotificationsModal,
} from "#src/components/NotificationsModal";
import {
  SearchMemberModal,
  useSearchMemberModal,
} from "#src/components/SearchMemberModal";
import { SearchMemberTopbarButton } from "#src/components/SearchMemberTopbarButton";
import {
  TemporaryPasswordDialog,
  useTemporaryPasswordDialog,
} from "#src/components/TemporaryPasswordDialog";
import { useBatchRoutingPermissions } from "#src/features/permissions";
import "#src/index.css";
import { HELP_CENTER, LEGACY_URLS } from "#src/urls";
import {
  AppI18nextProvider,
  instanciateAppI18n,
  useTranslation,
} from "#src/utils/i18n";

import FeedbackDialog, { useFeedbackDialog } from "./FeedbackDialog";
import LanguageDropdown from "./LanguageDropdown";
import { NavigationMenuElement } from "./NavigationMenuElement";
import { NavigationSidebarContainer } from "./NavigationSidebarContainer";
import NavigationSidebarHeader, {
  type MenuOption,
} from "./NavigationSidebarHeader";
import { SidebarProvider } from "./SidebarContext";
import { useNavigateInContext } from "./navigate";
import {
  type MenuSet,
  isDividerElement,
  isGroupElement,
  isItemElement,
  useNavigationElements,
} from "./navigation-items";
import { useProtectedItems } from "./navigation-protected-items";
import { getNavigationUrls } from "./navigation-urls";
import { useFilteredNavigationElements } from "./useFilteredNavigationElements";

export type NavigationSidebarProps = {
  navigate?: (to: string) => void;
  disableRevampOnLegacyStore?: () => void;
  isLoadingData?: boolean;
  onLogoutCallback?: () => void;
};

const NavigationSidebarContent = ({
  navigate,
  disableRevampOnLegacyStore,
  onLogoutCallback,
}: NavigationSidebarProps) => {
  const { t } = useTranslation("default");

  const isBridged = !!navigate;

  const navigateInContext = useNavigateInContext(navigate);

  const [menuSet, setMenuSet] = useState<MenuSet>("default");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useAlerts();

  const navigationUrls = useMemo(
    () => getNavigationUrls({ revampedBoEnabled: true }),
    [],
  );
  const attendancePermissions = useAttendancePermissions();

  const { open, openDialog, closeDialog } = useFeedbackDialog();
  const {
    handleCloseTemporaryPasswordDialog,
    handleOpenTemporaryPasswordDialog,
    isTemporaryPasswordDialogOpen,
    isLoadingTemporaryPassword,
  } = useTemporaryPasswordDialog();
  const {
    isOpen: isNotificationsModalOpen,
    openModal: openNotificationsModal,
    closeModal: closeNotificationsModal,
  } = useNotificationsModal();
  const { isAttendanceModalOpen, closeAttendanceModal, openAttendanceModal } =
    useAttendanceModal();
  const {
    isSearchMemberModalOpen,
    closeSearchMemberModal,
    openSearchMemberModal,
  } = useSearchMemberModal();

  const navigationElements = useNavigationElements({
    menuSet,
    navigationUrls,
    handleOpenTemporaryPasswordDialog,
    handleOpenNotificationsModal: openNotificationsModal,
  });

  const protectedElements = useProtectedItems(navigationElements);

  const elementsPermissions = useBatchRoutingPermissions(protectedElements);

  const filteredNavigationElements = useFilteredNavigationElements(
    navigationElements,
    elementsPermissions,
    menuSet,
  );

  const renderNavigationItems = () => {
    if (menuSet === "settings") {
      return (
        <>
          <NavigationMenu.Group label={t("menus.settings.title")} />
          {filteredNavigationElements.map((item) => {
            if (isGroupElement(item)) return null;

            if (isItemElement(item)) {
              return (
                <NavigationMenuElement
                  key={item.id}
                  kind="item"
                  item={item}
                  navigate={navigate}
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
        {filteredNavigationElements.map((element, index) => {
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

          return (
            <NavigationMenuElement
              key={element.id}
              kind="item"
              navigate={navigate}
              item={element}
            >
              {element.subItems?.map((subItem) => (
                <NavigationMenuElement
                  key={subItem.id}
                  kind="subitem"
                  item={subItem}
                  navigate={navigate}
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
  const user = dataAccessLayer.useUserAccess();

  const sidebarContent = (
    <>
      <NavigationSidebarHeader
        avatarUrl={companyLogo}
        label={companyName ?? ""}
        menuSet={menuSet}
        hiddenItems={{
          attendance: !attendancePermissions.displayFeature,
          ledger: true,
        }}
        onSelectItem={(id: MenuOption) => {
          if (id === "settings") {
            setMenuSet(id);
          }
          if (id === "feedback" && process.env.NODE_ENV === "production") {
            navigateInContext(LEGACY_URLS.feedback);
          }
          if (id === "tutorials") {
            navigateInContext(LEGACY_URLS.tutorial);
          }
          if (id === "logout") {
            onLogoutCallback?.();

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
          if (id === "attendance") {
            openAttendanceModal();
          }
          if (id === "help") {
            window.open(HELP_CENTER, "_blank");
          }
        }}
        onBack={() => setMenuSet("default")}
        onSearch={openSearchMemberModal}
      />
      <div
        role="presentation"
        className="flex-1 overflow-y-scroll hide-scrollbar min-h-0"
      >
        <NavigationMenu className="px-xs">
          {renderNavigationItems()}
        </NavigationMenu>
        {menuSet === "settings" && <LanguageDropdown />}
      </div>
      <Card elevated className="p-xs mx-xs flex flex-col gap-2xs shrink-0">
        <Button
          className="!justify-between"
          label={t("revampCard.betaFeedbackLink")}
          intent="flat"
          size="md"
          color="main"
          iconRight="link-external-02"
          fullWidth
          onClick={() => navigateInContext(LEGACY_URLS.feedback)}
        />
        <Button
          className="!justify-between"
          label={t("revampCard.goBackToOldUi")}
          intent="flat"
          size="md"
          color="default"
          iconRight="arrow-right"
          fullWidth
          onClick={openDialog}
        />
      </Card>
      <FeedbackDialog
        open={open}
        onClose={closeDialog}
        disableRevampOnLegacyStore={disableRevampOnLegacyStore}
      />
      <TemporaryPasswordDialog
        isLoading={isLoadingTemporaryPassword}
        isOpen={isTemporaryPasswordDialogOpen}
        onClose={handleCloseTemporaryPasswordDialog}
      />
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={closeNotificationsModal}
        navigate={navigate}
      />
      {isAttendanceModalOpen &&
        user &&
        attendancePermissions.displayFeature && (
          <AttendanceModal
            onClose={closeAttendanceModal}
            userId={user.id}
            userName={user.name}
            permissions={attendancePermissions}
            navigateInContext={navigateInContext}
          />
        )}
      <SearchMemberModal
        isOpen={isSearchMemberModalOpen}
        onClose={closeSearchMemberModal}
        navigate={navigate}
        navigateInContext={navigateInContext}
      />
    </>
  );

  // Use responsive Sidebar for Studio Manager apps (isBridged = false)
  // Use simple NavigationSidebarContainer for saas-legacy (isBridged = true)
  if (isBridged) {
    return (
      <NavigationSidebarContainer>{sidebarContent}</NavigationSidebarContainer>
    );
  }

  return (
    <SidebarProvider closeSidebar={() => setIsSidebarOpen(false)}>
      <Sidebar
        topbarSlot={
          <SearchMemberTopbarButton onClick={openSearchMemberModal} />
        }
        isOpen={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      >
        {sidebarContent}
      </Sidebar>
    </SidebarProvider>
  );
};

const { i18nInstance: kaizenI18nInstance } = instanciateAppI18n({
  applicationName: i18nNamespacePrefix,
  namespaces: i18nNamespaces,
  inMemoryTranslationsLoader: inMemoryTranslationsLoader,
  debug: process.env.NODE_ENV !== "production",
});

const NavigationSidebar = (props: NavigationSidebarProps) => {
  return (
    <KaizenI18nProvider kaizenI18nInstance={kaizenI18nInstance}>
      <AppI18nextProvider>
        <NavigationSidebarContent {...props} />
      </AppI18nextProvider>
    </KaizenI18nProvider>
  );
};

export default NavigationSidebar;
