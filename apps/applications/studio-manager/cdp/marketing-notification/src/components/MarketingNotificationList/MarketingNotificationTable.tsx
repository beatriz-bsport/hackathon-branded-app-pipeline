import { Table } from "@bsport/kaizen-primitive-core";

import { useFetchMarketingNotificationList } from "#src/hooks/api/use-fetch-marketing-notification-list";
import { useFormatMarketingNotificationTableRow } from "#src/hooks/layout/use-format-marketing-notification-table-row";
import { useTranslation } from "#src/utils/i18n";

import { getTableColumns } from "./MarketingNotificationTableConfig";

export const MarketingNotificationTable = () => {
  const { t } = useTranslation("marketingNotificationList");
  const { marketingNotificationsList, groupActivityMapById } =
    useFetchMarketingNotificationList();
  const { formatMarketingNotificationForTable } =
    useFormatMarketingNotificationTableRow({ groupActivityMapById });

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
  console.log("marketingNotificationsList : ", tableRows);

  return (
    <div>
      <Table columns={tableColumns} rowHeight="lg" rows={tableRows} />
    </div>
  );
};
