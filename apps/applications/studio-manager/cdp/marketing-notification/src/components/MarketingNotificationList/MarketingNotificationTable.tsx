import { Table } from "@bsport/kaizen-primitive-core";

import { getTableColumns } from "#src/components/MarketingNotificationList/MarketingNotificationTableConfig";
import { useFetchMarketingNotificationList } from "#src/hooks/api/use-fetch-marketing-notification-list";
import { useGetMarketingNotificationDependenciesData } from "#src/hooks/api/use-get-marketing-notification-dependencies-data";
import { useFormatMarketingNotificationTableRow } from "#src/hooks/layout/use-format-marketing-notification-table-row";
import { useTranslation } from "#src/utils/i18n";

export const MarketingNotificationTable = () => {
  const { t } = useTranslation("marketingNotificationList");
  const { marketingNotificationsList } = useFetchMarketingNotificationList();
  const { groupActivitiesById } = useGetMarketingNotificationDependenciesData();
  const { formatMarketingNotificationForTable } =
    useFormatMarketingNotificationTableRow({
      groupActivitiesById,
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
    toggleMarketingNotification: () => {
      console.log("toggle marketing notification");
    },
    permissions: {
      isPushNotificationEnabled: true,
      isUserMarketingNotificationManager: true,
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
