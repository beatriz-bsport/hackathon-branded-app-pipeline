import { useState } from "react";

import { Card, Modal, Table, Title } from "@bsport/kaizen-primitive-core";
import type { MarketingNotification } from "@bsport/store-cdp-marketing-notification";
import { CommunicationKind } from "@bsport/store-communicate-communication";

import { CommunicationStatusHelper } from "#src/components/MarketingNotificationDetails/Performance/CommunicationStatusHelper";
import { useFetchCommunicationRecipients } from "#src/hooks/api/use-fetch-communication-recipients";
import { useFormatMarketingNotificationRecipientsTableColumns } from "#src/hooks/layout/use-format-marketing-notification-recipients-table-config";
import { ESCAPE_KEYBOARD_KEY } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

import { HTMLPreview } from "../Content/HTMLPreview";
import { PushNotificationPreview } from "../Content/PushNotificationPreview";

type CommunicationSentRecipientTableProps = {
  notification: MarketingNotification;
};

export const CommunicationSentRecipientTable = ({
  notification,
}: CommunicationSentRecipientTableProps) => {
  const [notificationContent, setNotificationContent] = useState<
    | {
        title: string;
        body: string;
        communicationKind: number;
      }
    | undefined
  >();
  const { t } = useTranslation("marketingNotificationDetails");
  const { communicationRecipients, paginationParams } =
    useFetchCommunicationRecipients({
      communicationObjectId: notification.id,
    });

  const tableColumns = useFormatMarketingNotificationRecipientsTableColumns();

  const tableRows = communicationRecipients.map((recipient) => ({
    ...recipient,
    onRowClick: () => {
      setNotificationContent({
        ...recipient.notificationContent,
        communicationKind: recipient.communicationKind,
      });
    },
  }));

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
          rows={tableRows}
          paginationProps={paginationParams}
        />
      </Card>
      {notificationContent !== undefined ? (
        <Modal
          open={true}
          size="lg"
          title={t("drawer.performance.contentPreviewModal.title")}
          confirmButton={{
            label: t("drawer.performance.contentPreviewModal.buttons.confirm"),
            color: "main",
            onClick: () => {
              setNotificationContent(undefined);
            },
          }}
          onClose={() => {
            setNotificationContent(undefined);
          }}
          onKeyDownCapture={(event) => {
            event.stopPropagation();
            if (event.key === ESCAPE_KEYBOARD_KEY) {
              setNotificationContent(undefined);
            }
          }}
        >
          <div className="flex flex-col gap-md">
            {notificationContent.communicationKind ===
            CommunicationKind.EMAIL ? (
              <div>
                <Title htmlVariant="h2">{notificationContent.title}</Title>
                <HTMLPreview htmlContent={notificationContent.body} />
              </div>
            ) : null}
            {notificationContent.communicationKind ===
            CommunicationKind.PUSH_NOTIFICATION ? (
              <div>
                <PushNotificationPreview
                  sender=""
                  title={notificationContent.title}
                  content={notificationContent.body}
                />
              </div>
            ) : null}
          </div>
        </Modal>
      ) : null}
    </div>
  );
};
