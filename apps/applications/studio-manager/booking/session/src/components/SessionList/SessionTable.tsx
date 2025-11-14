import React from "react";

import { Body, Icon, Table } from "@bsport/kaizen-primitive-core";
import { ManagerSession } from "@bsport/store-booking-session";

import { i18nInstance, useTranslation } from "#src/utils/i18n";

type SessionTableProps = {
  sessions: ManagerSession[];
  isLoading: boolean;
};

export const SessionTable: React.FC<SessionTableProps> = ({
  sessions,
  isLoading,
}) => {
  const { t } = useTranslation("sessionList");
  const intlLocale = i18nInstance?.language;

  return (
    <Table
      columns={[
        {
          header: t("table.headers.time"),
          id: "time",
          type: "custom",
          align: "start",
          render: (row: ManagerSession) => {
            const startDate = new Date(row.date_start);
            const endDate = new Date(
              startDate.getTime() + row.duration_minute * 60 * 1000,
            );

            const timeFormatter = new Intl.DateTimeFormat(intlLocale, {
              timeStyle: "short",
            });

            return (
              <Body htmlVariant="p" size="md">
                {`${timeFormatter.format(startDate)} - ${timeFormatter.format(endDate)}`}
              </Body>
            );
          },
        },
        {
          header: t("table.headers.sessionName"),
          id: "sessionName",
          type: "string",
          align: "start",
          keyPath: "name",
        },
        {
          header: t("table.headers.participants"),
          id: "participants",
          type: "custom",
          align: "start",
          render: (row: ManagerSession) => {
            return (
              <div className="flex gap-xs items-center">
                <Body htmlVariant="p" size="md" className="w-2xl">
                  {`${row.nb_bookings} / ${row.effectif}`}
                </Body>
                <div className="flex items-center gap-xs text-onsurface-weak">
                  <Icon icon="hourglass-03" size="sm" />
                  <Body htmlVariant="p" size="md" color="weak">
                    {`${row.nb_option} / ${row.waiting_list_max_size}`}
                  </Body>
                </div>
              </div>
            );
          },
        },
      ]}
      rowHeight="sm"
      // TODO(elisabeth): add empty state
      loadingProps={{ isLoading, message: t("table.isLoading") }}
      rows={sessions}
    ></Table>
  );
};
