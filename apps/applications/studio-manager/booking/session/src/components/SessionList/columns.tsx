import { useMemo } from "react";

import { Body, GenericTableColumn, Icon } from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/utils/i18n";

import { TableRowData } from "./types";

type TableColumn = GenericTableColumn<TableRowData>;

export const useSessionListColumns = () => {
  const { t } = useTranslation("sessionList");
  const intlLocale = i18nInstance?.language;

  const timeColumn: TableColumn = useMemo(
    () => ({
      header: t("table.headers.time"),
      id: "time",
      type: "custom",
      align: "start",
      render: (row: TableRowData) => {
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
    }),
    [t, intlLocale],
  );

  const sessionNameColumn: TableColumn = useMemo(
    () => ({
      header: t("table.headers.sessionName"),
      id: "sessionName",
      type: "string",
      align: "start",
      keyPath: "name",
      cellsClassName: "truncate max-w-[202px]",
    }),
    [t],
  );

  const participantsColumn: TableColumn = useMemo(
    () => ({
      header: t("table.headers.participants"),
      id: "participants",
      type: "custom",
      align: "start",
      render: (row: TableRowData) => {
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
    }),
    [t],
  );

  const teacherNameColumn: TableColumn = useMemo(
    () => ({
      id: "teacherName",
      header: t("table.headers.teacher"),
      type: "string",
      align: "start",
      keyPath: "teacherName",
      cellsClassName: "truncate max-w-[140px]",
    }),
    [t],
  );

  const establishmentNameColumn: TableColumn = useMemo(
    () => ({
      id: "establishmentName",
      header: t("table.headers.establishment"),
      type: "string",
      align: "start",
      keyPath: "establishmentName",
      cellsClassName: "truncate max-w-[128px]",
    }),
    [t],
  );

  return [
    timeColumn,
    sessionNameColumn,
    participantsColumn,
    teacherNameColumn,
    establishmentNameColumn,
  ];
};
