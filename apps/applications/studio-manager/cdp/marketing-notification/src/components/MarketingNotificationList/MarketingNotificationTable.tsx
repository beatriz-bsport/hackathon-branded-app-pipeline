import { DetailDrawer, Table } from "@bsport/kaizen-primitive-core";

import { MarketingNotificationDetailsContent } from "#src/components/MarketingNotificationDetails/MarketingNotificationDetailsContent";
import { getTableColumns } from "#src/components/MarketingNotificationList/MarketingNotificationTableConfig";
import { useDrawerQueryParam } from "#src/hooks/actions/use-drawer-query-params";
import { useMarketingNotificationNavigation } from "#src/hooks/actions/use-marketing-notification-navigation";
import { useFetchMarketingNotificationList } from "#src/hooks/api/use-fetch-marketing-notification-list";
import { useGetMarketingNotificationDependenciesData } from "#src/hooks/api/use-get-marketing-notification-dependencies-data";
import { useToggleMarketingNotification } from "#src/hooks/api/use-toggle-marketing-notification";
import { MarketingNotificationFilterParams } from "#src/hooks/layout/use-filter-notification-type";
import { useFormatMarketingNotificationTableRow } from "#src/hooks/layout/use-format-marketing-notification-table-row";
import { usePermissionsChecker } from "#src/hooks/permissions/use-permissions-checker";
import { useUpsellChecker } from "#src/hooks/permissions/use-upsell-checker";
import type {
  NotificationModalActions,
  ToggleNotificationModalParams,
} from "#src/pages/MarketingNotificationListPage";
import { useTranslation } from "#src/utils/i18n";

export const MarketingNotificationTable = ({
  activeFilters,
  handleClearFilters,
  handleMarketingNotificationModalAction,
}: {
  activeFilters: MarketingNotificationFilterParams;
  handleClearFilters: () => void;
  handleMarketingNotificationModalAction: ({
    action,
    marketingNotification,
  }: ToggleNotificationModalParams) => void;
}) => {
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

  const handleSelectMarketingNotificationAction = ({
    marketingNotificationId,
    action,
  }: {
    marketingNotificationId: number;
    action: NotificationModalActions;
  }) => {
    const marketingNotification = marketingNotificationsList.find(
      (notification) => notification.id === marketingNotificationId,
    );
    if (!marketingNotification) {
      return;
    }
    handleMarketingNotificationModalAction({
      marketingNotification,
      action,
    });
  };

  const tableColumns = getTableColumns({
    t,
    openPreview: openMarketingNotificationDetail,
    editNotification: (notificationId) => {
      handleSelectMarketingNotificationAction({
        marketingNotificationId: notificationId,
        action: "edit",
      });
    },
    deleteNotification: (notificationId) => {
      handleSelectMarketingNotificationAction({
        marketingNotificationId: notificationId,
        action: "delete",
      });
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

  const isMarketingNotificationFilterActive =
    activeFilters.notification_type_excluded.length > 0 ||
    activeFilters.notification_type_included.length > 0;

  const marketingNotificationsToDisplay = isMarketingNotificationFilterActive
    ? tableRows.filter((row) => {
        const passesInclusion =
          activeFilters.notification_type_included.length === 0 ||
          activeFilters.notification_type_included.includes(
            row.notificationType,
          );
        const passesExclusion =
          activeFilters.notification_type_excluded.length === 0 ||
          !activeFilters.notification_type_excluded.includes(
            row.notificationType,
          );
        return passesInclusion && passesExclusion;
      })
    : tableRows;

  return (
    <div className="h-full">
      <Table
        columns={tableColumns}
        rowHeight="lg"
        rows={marketingNotificationsToDisplay}
        loadingProps={{ isLoading, message: t("loading") }}
        emptyStateProps={{
          isEmpty: tableRows?.length === 0,
          emptyConfig: {
            title: t("page.emptyState.unfiltered.title"),
            subtitle: t("page.emptyState.unfiltered.description"),
            ctaButtonConfig: {
              iconLeft: "plus",
              label: t("page.emptyState.unfiltered.primaryAction"),
              onClick: () =>
                handleMarketingNotificationModalAction({ action: "create" }),
            },
          },
          isEmptySearch: marketingNotificationsToDisplay.length === 0,
          emptySearchConfig: {
            title: t("page.emptyState.filtered.title"),
            subtitle: t("page.emptyState.filtered.description"),
            secondaryButtonConfig: {
              iconLeft: "x",
              label: t("page.emptyState.filtered.primaryAction"),
              onClick: handleClearFilters,
            },
          },
        }}
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
          handleSelectMarketingNotificationAction={
            handleMarketingNotificationModalAction
          }
          notification={selectedMarketingNotification}
        />
      </DetailDrawer>
    </div>
  );
};
