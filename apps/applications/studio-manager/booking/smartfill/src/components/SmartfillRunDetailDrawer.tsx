import type { FC } from "react";

import {
  DetailDrawer,
  ErrorFallback,
  Loader,
  Table,
  Title,
} from "@bsport/kaizen-primitive-core";

import {
  type SmartfillRunNotification,
  useSmartfillRunDetail,
} from "#src/hooks/use-smartfill-run-detail";
import { useTranslation } from "#src/utils/i18n";

type Props = {
  runId: number | null;
  onClose: () => void;
};

export const SmartfillRunDetailDrawer: FC<Props> = ({ runId, onClose }) => {
  const { t } = useTranslation("smartfill");
  const { data, isLoading, isError, refetch } = useSmartfillRunDetail(runId);

  return (
    <DetailDrawer
      id="smartfill-run-detail"
      isOpen={runId != null}
      onClose={onClose}
    >
      {isLoading ? (
        <div className="grid h-full w-full place-content-center">
          <Loader size="md" />
        </div>
      ) : null}

      {isError ? (
        <ErrorFallback
          title={t("error.title")}
          subtitle=""
          description={t("error.description")}
          actionProps={{
            label: t("error.retry"),
            onClick: () => {
              void refetch();
            },
          }}
        />
      ) : null}

      {data ? (
        <div className="flex flex-col gap-md">
          <Title htmlVariant="h3">Run #{data.id}</Title>

          <div className="flex flex-col gap-xs">
            <span className="text-body-sm text-content-secondary">
              Offer ID: {data.offer_id}
            </span>
            <span className="text-body-sm text-content-secondary">
              Date created: {new Date(data.date_created).toLocaleString()}
            </span>
          </div>

          <Title htmlVariant="h4">
            Notifications ({data.notifications.length})
          </Title>

          <Table<SmartfillRunNotification>
            id="smartfill-run-notifications"
            columns={[
              {
                header: "Date sent",
                id: "date_sent",
                keyPath: "date_sent",
                type: "datetime",
              },
              {
                header: "Member ID",
                id: "member_id",
                keyPath: "member_id",
                type: "string",
              },
              {
                header: "Communication ID",
                id: "communication_sent_id",
                keyPath: "communication_sent_id",
                type: "string",
              },
            ]}
            rows={data.notifications}
            emptyStateProps={{
              isEmpty: data.notifications.length === 0,
              emptyConfig: {
                title: "No notifications sent yet",
              },
            }}
          />
        </div>
      ) : null}
    </DetailDrawer>
  );
};
