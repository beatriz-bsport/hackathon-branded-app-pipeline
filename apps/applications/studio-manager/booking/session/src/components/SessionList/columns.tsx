import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import {
  DateTime,
  fromIsoString,
  modifyTime,
} from "@bsport/datetime-manipulation";
import {
  Body,
  Button,
  type GenericTableColumn,
  Icon,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { i18nInstance, useTranslation } from "#src/utils/i18n";

import { SessionTypeChips } from "./SessionTypeChips";
import type { TableRowData } from "./types";

type TableColumn = GenericTableColumn<TableRowData>;

export const useSessionListColumns = () => {
  const { t } = useTranslation("sessionList");
  const intlLocale = i18nInstance?.language;
  const companyTimeZone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const timeColumn: TableColumn = {
    header: t("table.headers.time"),
    id: "time",
    type: "custom",
    align: "start",
    render: (row: TableRowData) => {
      const startDate = fromIsoString(row.date_start, {
        zone: companyTimeZone,
        locale: intlLocale,
      });
      const endDate = modifyTime({
        datetime: startDate,
        duration: { minute: row.duration_minute },
        operator: "plus",
      });

      const timeFormatter = (dateTime: DateTime) =>
        formatDateTimeFromDate(dateTime, DATETIME_FORMATS.TIME_SIMPLE);

      return (
        <Body htmlVariant="p" size="md">
          {`${timeFormatter(startDate)} - ${timeFormatter(endDate)}`}
        </Body>
      );
    },
  };
  const sessionTypeColumn: TableColumn = {
    id: "sessionType",
    header: t("table.headers.sessionType"),
    type: "custom",
    align: "start",
    render: (row: TableRowData) => {
      return <SessionTypeChips session={row} />;
    },
  };

  const sessionNameColumn: TableColumn = {
    header: t("table.headers.sessionName"),
    id: "sessionName",
    type: "string",
    align: "start",
    keyPath: "name",
    cellsClassName: "truncate max-w-[202px]",
  };

  const participantsColumn: TableColumn = {
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
  };

  const teacherNameColumn: TableColumn = {
    id: "teacherName",
    header: t("table.headers.teacher"),
    type: "string",
    align: "start",
    keyPath: "teacherName",
    cellsClassName: "truncate max-w-[140px]",
  };

  const establishmentNameColumn: TableColumn = {
    id: "establishmentName",
    header: t("table.headers.establishment"),
    type: "string",
    align: "start",
    keyPath: "establishmentName",
    cellsClassName: "truncate max-w-[128px]",
  };

  const attendanceColumn: TableColumn = {
    id: "attendance",
    header: "",
    type: "custom",
    align: "center",
    render: () => (
      <Button
        label={t("table.attendanceButton")}
        size="sm"
        intent="default"
        color="main"
      />
    ),
  };

  return [
    timeColumn,
    sessionNameColumn,
    participantsColumn,
    teacherNameColumn,
    establishmentNameColumn,
    sessionTypeColumn,
    attendanceColumn,
  ];
};
