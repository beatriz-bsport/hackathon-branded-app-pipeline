import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import {
  type DateTime,
  fromIsoString,
  modifyTime,
} from "@bsport/datetime-manipulation";
import { Body } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { Columns, EnrichedSession, TableColumn } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

import { CancelledSessionName } from "./CancelledSessionName";
import { ParticipantsCell } from "./ParticipantsCell";
import { SessionTypeChips } from "./SessionTypeChips";
import { AttendanceButton } from "./attendance-button";
import { ShortcutActionsButton } from "./detail-actions/shortcut-actions-button";
import { TeacherCell } from "./teacher-cell";

export const useSessionListColumns = () => {
  const { t, i18n } = useTranslation("sessionList");
  const intlLocale = i18n?.language;
  const companyTimeZone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const timeColumn: TableColumn = {
    header: t("table.headers.time"),
    label: t("table.headers.time"),
    id: Columns.TIME,
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
    id: Columns.SESSION_TYPE,
    header: t("table.headers.sessionType"),
    label: t("table.headers.sessionType"),
    type: "custom",
    align: "start",
    render: (row: EnrichedSession) => {
      return <SessionTypeChips session={row} />;
    },
  };

  const sessionClassName = "truncate max-w-[202px]";
  const sessionNameColumn: TableColumn = {
    header: t("table.headers.sessionName"),
    label: t("table.headers.sessionName"),
    id: Columns.SESSION_NAME,
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
    label: t("table.headers.participants"),
    id: Columns.PARTICIPANTS,
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
    id: Columns.TEACHER,
    header: t("table.headers.teacher"),
    label: t("table.headers.teacher"),
    type: "custom",
    align: "start",
    render: (row: EnrichedSession) => (
      <TeacherCell
        teacherName={row.teacherName}
        originalTeacherName={row.originalTeacherName}
        coach_override={row.coach_override}
        hasPendingReplacementRequest={row.hasPendingReplacementRequest}
      />
    ),
  };

  const establishmentNameColumn: TableColumn = {
    id: Columns.ESTABLISHMENT,
    header: t("table.headers.establishment"),
    label: t("table.headers.establishment"),
    type: "string",
    align: "start",
    keyPath: "establishmentName",
    cellsClassName: "truncate max-w-[128px]",
  };

  const actionsColumn: TableColumn = {
    id: Columns.ACTIONS,
    header: "",
    label: t("table.headers.actions"),
    type: "custom",
    align: "center",
    render: (row: EnrichedSession) => (
      <div className="flex items-center gap-xs">
        <AttendanceButton
          isValidated={!row.roll_call_needs_validation}
          available={row.available}
        />
        <ShortcutActionsButton session={row} />
      </div>
    ),
  };

  return [
    timeColumn,
    sessionNameColumn,
    teacherNameColumn,
    participantsColumn,
    establishmentNameColumn,
    sessionTypeColumn,
    actionsColumn,
  ];
};
