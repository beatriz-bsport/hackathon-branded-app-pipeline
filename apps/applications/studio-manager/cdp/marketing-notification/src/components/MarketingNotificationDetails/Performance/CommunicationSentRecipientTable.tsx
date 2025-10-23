import { Card, Table, Title } from "@bsport/kaizen-primitive-core";
import type { MarketingNotification } from "@bsport/store-cdp-marketing-notification";

import { CommunicationStatusHelper } from "#src/components/MarketingNotificationDetails/Performance/CommunicationStatusHelper";
import { useFetchCommunicationRecipients } from "#src/hooks/api/use-fetch-communication-recipients";
import { useFormatMarketingNotificationRecipientsTableColumns } from "#src/hooks/layout/use-format-marketing-notification-recipients-table-config";
import { useTranslation } from "#src/utils/i18n";

type CommunicationSentRecipientTableProps = {
  notification: MarketingNotification;
};

export const CommunicationSentRecipientTable = ({
  notification,
}: CommunicationSentRecipientTableProps) => {
  const { t } = useTranslation("marketingNotificationDetails");
  const { communicationRecipients, paginationParams } =
    useFetchCommunicationRecipients({
      communicationObjectId: notification.id,
    });

  const tableColumns = useFormatMarketingNotificationRecipientsTableColumns();

  return (
    <div className="flex flex-col gap-sm">
      <div className="flex flex-row justify-between items-center">
        <Title htmlVariant="h3" weight="strong">
          {t("drawer.performance.allNotifications.title")}
        </Title>
        <CommunicationStatusHelper />
      </div>
      <Card padding="none" className="w-full overflow-x-scroll">
        <Table
          columns={tableColumns}
          rowHeight="sm"
          rows={communicationRecipients}
          paginationProps={paginationParams}
        />
      </Card>
    </div>
  );
};
