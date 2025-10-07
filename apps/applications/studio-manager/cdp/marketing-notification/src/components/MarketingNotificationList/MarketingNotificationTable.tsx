import { Table } from "@bsport/kaizen-primitive-core";

import { getTableColumns } from "#src/components/MarketingNotificationList/MarketingNotificationTableConfig";
import { useFetchMarketingNotificationList } from "#src/hooks/api/use-fetch-marketing-notification-list";
import { useGetMarketingNotificationDependenciesData } from "#src/hooks/api/use-get-marketing-notification-dependencies-data";
import { useToggleMarketingNotification } from "#src/hooks/api/use-toggle-marketing-notification";
import { useFormatMarketingNotificationTableRow } from "#src/hooks/layout/use-format-marketing-notification-table-row";
import { usePermissionsChecker } from "#src/hooks/permissions/use-permissions-checker";
import { useUpsellChecker } from "#src/hooks/permissions/use-upsell-checker";
import { useTranslation } from "#src/utils/i18n";

export const MarketingNotificationTable = () => {
  const { t } = useTranslation("marketingNotificationList");

  const { marketingNotificationsList } = useFetchMarketingNotificationList();
  const { groupActivitiesById, emailTemplatesById } =
    useGetMarketingNotificationDependenciesData();

  const { handleToggleMarketingNotification } =
    useToggleMarketingNotification();

  const { isUserMarketingNotificationManager } = usePermissionsChecker();
  const { isPushNotificationUpsellActivated } = useUpsellChecker();

  const { formatMarketingNotificationForTable } =
    useFormatMarketingNotificationTableRow({
      groupActivitiesById,
      emailTemplatesById,
      canToggleNotification: isUserMarketingNotificationManager,
    });

  const tableColumns = getTableColumns({
    t,
    openPreview: () => {
      console.log("open preview");
    },
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
    marketingNotificationList: marketingNotificationsList,
  });

  return (
    <div>
      <Table columns={tableColumns} rowHeight="lg" rows={tableRows} />
    </div>
  );
};
