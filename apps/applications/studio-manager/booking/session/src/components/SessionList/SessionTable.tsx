import React from "react";

import { Table } from "@bsport/kaizen-primitive-core";
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
          render: (row: ManagerSession) => {
            const startDate = new Date(row.date_start);
            const endDate = new Date(
              startDate.getTime() + row.duration_minute * 60 * 1000,
            );

            const timeFormatter = new Intl.DateTimeFormat(intlLocale, {
              timeStyle: "short",
            });

            return `${timeFormatter.format(startDate)} - ${timeFormatter.format(endDate)}`;
          },
        },
        {
          header: t("table.headers.sessionName"),
          id: "sessionName",
          type: "string",
          keyPath: "name",
        },
      ]}
      rowHeight="sm"
      // TODO(elisabeth): add empty state
      loadingProps={{ isLoading, message: t("table.isLoading") }}
      rows={sessions}
    ></Table>
  );
};
