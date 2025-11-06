import { DetailDrawer, Table } from "@bsport/kaizen-primitive-core";

import { MarketingNotificationDetailsContent } from "#src/components/MarketingNotificationDetails/MarketingNotificationDetailsContent";
import { getTableColumns } from "#src/components/MarketingNotificationList/MarketingNotificationTableConfig";
import { useDrawerQueryParam } from "#src/hooks/actions/use-drawer-query-params";
import { useMarketingNotificationNavigation } from "#src/hooks/actions/use-marketing-notification-navigation";
import { useFetchMarketingNotificationList } from "#src/hooks/api/use-fetch-marketing-notification-list";
import { useGetMarketingNotificationDependenciesData } from "#src/hooks/api/use-get-marketing-notification-dependencies-data";
import { useToggleMarketingNotification } from "#src/hooks/api/use-toggle-marketing-notification";
import { useFormatMarketingNotificationTableRow } from "#src/hooks/layout/use-format-marketing-notification-table-row";
import { usePermissionsChecker } from "#src/hooks/permissions/use-permissions-checker";
import { useUpsellChecker } from "#src/hooks/permissions/use-upsell-checker";
import { useTranslation } from "#src/utils/i18n";

export const MarketingNotificationTable = () => {
  const { t } = useTranslation("marketingNotificationList");
  const { marketingNotificationsList, isLoading } =
    useFetchMarketingNotificationList();
  const { groupActivitiesById, emailTemplatesById } =
    useGetMarketingNotificationDependenciesData();

  const { handleToggleMarketingNotification } =
    useToggleMarketingNotification();

  const { isUserMarketingNotificationManager } = usePermissionsChecker();
  const { isPushNotificationUpsellActivated } = useUpsellChecker();
  const { openId, openDrawer, closeDrawer } = useDrawerQueryParam();
  const {
    selectedMarketingNotification,
    setSelectedMarketingNotification,
    navigateToNextMarketingNotification,
    navigateToPreviousMarketingNotification,
  } = useMarketingNotificationNavigation({
    baseNotificationEventId: openId ? parseInt(openId, 10) : undefined,
    marketingNotification: marketingNotificationsList,
    onNavigate: (notificationEventId: number) => {
      if (notificationEventId !== selectedMarketingNotification?.id) {
        openDrawer(notificationEventId);
      } else {
        closeDrawer();
        setSelectedMarketingNotification(null);
      }
    },
  });

  const { formatMarketingNotificationForTable } =
    useFormatMarketingNotificationTableRow({
      groupActivitiesById,
      emailTemplatesById,
      canToggleNotification: isUserMarketingNotificationManager,
    });

  const openMarketingNotificationDetail = (notificationId: number) => {
    if (selectedMarketingNotification?.id === notificationId) {
      closeDrawer();
      setSelectedMarketingNotification(null);
      return;
    }
    const marketingNotification = marketingNotificationsList.find(
      (notification) => notification.id === notificationId,
    );
    if (!marketingNotification) {
      return;
    }
    setSelectedMarketingNotification(marketingNotification);
    openDrawer(notificationId);
  };

  const tableColumns = getTableColumns({
    t,
    openPreview: openMarketingNotificationDetail,
    editNotification: () => {
      console.log("edit notification");
    },
    deleteNotification: () => {
      console.log("delete notification");
    },
    toggleMarketingNotification: handleToggleMarketingNotification,
    permissions: {
      isPushNotificationEnabled: isPushNotificationUpsellActivated,
      isUserMarketingNotificationManager,
    },
  });

  const tableRows = formatMarketingNotificationForTable({
    selectedMarketingNotificationId: selectedMarketingNotification?.id || null,
    marketingNotificationList: marketingNotificationsList,
    onRowClick: openMarketingNotificationDetail,
  });

  return (
    <div className="h-full">
      <Table
        columns={tableColumns}
        rowHeight="lg"
        rows={tableRows}
        loadingProps={{ isLoading, message: t("loading") }}
      />
      <DetailDrawer
        className="w-[650px]"
        id="marketing-notification-detail-drawer"
        isOpen={!!selectedMarketingNotification}
        onClose={() => {
          setSelectedMarketingNotification(null);
          closeDrawer();
        }}
        actionsConfig={[
          {
            id: "previous-tag-details",
            kind: "icon-button",
            label: t("table.actions.previous"),
            icon: "chevron-up",
            intent: "default",
            size: "md",
            color: "main",
            onClick: navigateToPreviousMarketingNotification,
            tooltipProps: {
              label: t("table.actions.previous"),
              placement: "bottom-right",
            },
          },
          {
            id: "next-tag-details",
            kind: "icon-button",
            label: t("table.actions.next"),
            icon: "chevron-down",
            intent: "default",
            size: "md",
            color: "main",
            onClick: navigateToNextMarketingNotification,
            tooltipProps: {
              label: t("table.actions.next"),
              placement: "bottom-right",
            },
          },
        ]}
      >
        <MarketingNotificationDetailsContent
          notification={selectedMarketingNotification}
        />
      </DetailDrawer>
    </div>
  );
};
