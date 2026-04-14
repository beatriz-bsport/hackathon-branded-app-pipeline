import { useMemo } from "react";

import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import { type DateTime, fromIsoString } from "@bsport/datetime-manipulation";
import { Avatar, Body, Icon } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { ResponsiveTooltip } from "#src/components/common/responsive-tooltip";
import {
  AppointmentColumn,
  type AppointmentTableColumn,
  type EnrichedAppointment,
} from "#src/types";
import { useTranslation } from "#src/utils/i18n";

export const useAppointmentColumns = (): AppointmentTableColumn[] => {
  const { t, i18n } = useTranslation("sessionList");
  const intlLocale = i18n?.language;
  const companyTimeZone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  return useMemo(
    () => getColumns(t, intlLocale, companyTimeZone),
    [t, intlLocale, companyTimeZone],
  );
};

const timeFormatter = (dateTime: DateTime) =>
  formatDateTimeFromDate(dateTime, DATETIME_FORMATS.TIME_SIMPLE);

const getColumns = (
  t: ReturnType<typeof useTranslation<"sessionList">>["t"],
  intlLocale: string | undefined,
  companyTimeZone: string | undefined,
): AppointmentTableColumn[] => {
  const timeColumn: AppointmentTableColumn = {
    header: t("appointmentTable.headers.time"),
    label: t("appointmentTable.headers.time"),
    id: AppointmentColumn.TIME,
    type: "custom",
    align: "start",
    render: (row: EnrichedAppointment) => {
      const startDate = fromIsoString(row.date_start, {
        zone: companyTimeZone,
        locale: intlLocale,
      });
      const endDate = fromIsoString(row.date_end, {
        zone: companyTimeZone,
        locale: intlLocale,
      });
      return (
        <Body htmlVariant="p" size="md">
          {`${timeFormatter(startDate)} - ${timeFormatter(endDate)}`}
        </Body>
      );
    },
  };

  const nameColumn: AppointmentTableColumn = {
    header: t("appointmentTable.headers.name"),
    label: t("appointmentTable.headers.name"),
    id: AppointmentColumn.NAME,
    type: "custom",
    align: "start",
    render: (row: EnrichedAppointment) =>
      row.isCancelled ? (
        <div className="flex items-center gap-xs">
          <Icon
            icon="x-circle-solid"
            size="sm"
            className="text-onsurface-action-weak-default"
          />
          <Body
            htmlVariant="p"
            size="md"
            color="inherit"
            className="text-onsurface-action-weak-default line-through truncate max-w-[202px]"
          >
            {row.name}
          </Body>
        </div>
      ) : (
        <Body htmlVariant="p" size="md" className="truncate max-w-[202px]">
          {row.name}
        </Body>
      ),
  };

  const teacherColumn: AppointmentTableColumn = {
    id: AppointmentColumn.TEACHER,
    header: t("appointmentTable.headers.teacher"),
    label: t("appointmentTable.headers.teacher"),
    type: "custom",
    align: "start",
    render: (row: EnrichedAppointment) => (
      <div className="flex gap-xs items-center">
        <Avatar
          shape="round"
          size="sm"
          src={row.teacherAvatar ?? undefined}
          initials={row.teacherInitials}
        />
        <Body htmlVariant="p" size="md" className="truncate max-w-[140px]">
          {row.teacherName}
        </Body>
      </div>
    ),
  };

  const participantColumn: AppointmentTableColumn = {
    id: AppointmentColumn.PARTICIPANT,
    header: t("appointmentTable.headers.participant"),
    label: t("appointmentTable.headers.participant"),
    type: "custom",
    align: "start",
    render: (row: EnrichedAppointment) => (
      <div className="flex items-center gap-xs">
        <Body htmlVariant="p" size="md" className="truncate max-w-[140px]">
          {row.participantName}
        </Body>
        {row.isUnpaid && (
          <ResponsiveTooltip
            label={t("appointmentTable.unpaidTooltip")}
            placement="top"
          >
            <span className="text-onsurface-status-critical-strong">
              <Icon icon="alert-triangle" size="sm" />
            </span>
          </ResponsiveTooltip>
        )}
      </div>
    ),
  };

  const passUsedColumn: AppointmentTableColumn = {
    id: AppointmentColumn.PASS_USED,
    header: t("appointmentTable.headers.passUsed"),
    label: t("appointmentTable.headers.passUsed"),
    type: "string",
    align: "start",
    keyPath: "passUsedName",
    cellsClassName: "truncate max-w-[128px]",
  };

  const establishmentColumn: AppointmentTableColumn = {
    id: AppointmentColumn.ESTABLISHMENT,
    header: t("appointmentTable.headers.establishment"),
    label: t("appointmentTable.headers.establishment"),
    type: "string",
    align: "start",
    keyPath: "establishmentName",
    cellsClassName: "truncate max-w-[128px]",
  };

  const typeColumn: AppointmentTableColumn = {
    id: AppointmentColumn.TYPE,
    header: t("appointmentTable.headers.type"),
    label: t("appointmentTable.headers.type"),
    type: "custom",
    align: "start",
    render: (row: EnrichedAppointment) =>
      row.isRecurring ? <Icon icon="refresh-ccw-01" size="sm" /> : null,
  };

  return [
    timeColumn,
    nameColumn,
    teacherColumn,
    participantColumn,
    passUsedColumn,
    establishmentColumn,
    typeColumn,
  ];
};
