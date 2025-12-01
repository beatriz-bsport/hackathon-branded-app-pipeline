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
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { EnrichedSession } from "#src/stores/session-list/types";
import { useTranslation } from "#src/utils/i18n";

import { CancelledSessionName } from "./CancelledSessionName";
import { ParticipantsCell } from "./ParticipantsCell";
import { SessionTypeChips } from "./SessionTypeChips";

type TableColumn = GenericTableColumn<EnrichedSession>;

export const useSessionListColumns = () => {
  const { t, i18n } = useTranslation("sessionList");
  const intlLocale = i18n?.language;
  const companyTimeZone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const timeColumn: TableColumn = {
    header: t("table.headers.time"),
    id: "time",
    type: "custom",
    align: "start",
    render: (row: EnrichedSession) => {
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
    render: (row: EnrichedSession) => {
      return <SessionTypeChips session={row} />;
    },
  };

  const sessionClassName = "truncate max-w-[202px]";
  const sessionNameColumn: TableColumn = {
    header: t("table.headers.sessionName"),
    id: "sessionName",
    type: "custom",
    align: "start",
    render: (row: EnrichedSession) =>
      row.available ? (
        <Body htmlVariant="p" size="md" className={sessionClassName}>
          {row.name}
        </Body>
      ) : (
        <CancelledSessionName name={row.name} className={sessionClassName} />
      ),
  };

  const participantsColumn: TableColumn = {
    header: t("table.headers.participants"),
    id: "participants",
    type: "custom",
    align: "start",
    render: (row: EnrichedSession) => {
      return (
        <ParticipantsCell
          nb_bookings={row.nb_bookings}
          effectif={row.effectif}
          nb_option={row.nb_option}
          waiting_list_max_size={row.waiting_list_max_size}
          available={row.available}
        />
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
    render: (row: EnrichedSession) => (
      <Button
        label={t("table.attendanceButton")}
        size="sm"
        intent="default"
        color="main"
        disabled={!row.available}
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
