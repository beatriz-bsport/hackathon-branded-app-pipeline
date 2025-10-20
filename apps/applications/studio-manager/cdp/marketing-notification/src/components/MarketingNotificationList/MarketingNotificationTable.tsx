import { useSearchParams } from "react-router";

import { DetailDrawer, Table } from "@bsport/kaizen-primitive-core";
import { deletePaginationQueryParams } from "@bsport/use-pagination-query-params";

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

import { MarketingNotificationDetailsContent } from "../MarketingNotificationDetails/MarketingNotificationDetailsContent";

export const MarketingNotificationTable = () => {
  const [, setSearchParams] = useSearchParams();
  const { t } = useTranslation("marketingNotificationList");
  const { marketingNotificationsList } = useFetchMarketingNotificationList();
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
      if (notificationEventId.toString() !== openId) {
        deletePaginationQueryParams(setSearchParams);
        openDrawer(notificationEventId);
      } else {
        closeDrawer();
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
    openDrawer(notificationId);
    setSelectedMarketingNotification(marketingNotification);
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
    <div>
      <Table columns={tableColumns} rowHeight="lg" rows={tableRows} />
      <DetailDrawer
        className="w-[650px]"
        id="marketing-notification-detail-drawer"
        isOpen={!!selectedMarketingNotification}
        onClose={() => {
          setSelectedMarketingNotification(null);
        }}
        actionsConfig={[
          {
            id: "previous-tag-details",
            iconLeft: "chevron-up",
            intent: "default",
            size: "md",
            color: "main",
            onClick: navigateToPreviousMarketingNotification,
            tooltipProps: {
              label: "Previous",
              placement: "bottom-right",
            },
          },
          {
            id: "next-tag-details",
            iconLeft: "chevron-down",
            intent: "default",
            size: "md",
            color: "main",
            onClick: navigateToNextMarketingNotification,
            tooltipProps: {
              label: "Next",
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
