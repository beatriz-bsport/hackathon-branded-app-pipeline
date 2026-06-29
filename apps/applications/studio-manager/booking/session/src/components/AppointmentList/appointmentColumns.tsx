import { useMemo } from "react";

import { Avatar, Body, Icon } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { AppointmentShortcutActionsButton } from "#src/components/AppointmentList/AppointmentShortcutActionsButton";
import { getEstablishmentCellVariant } from "#src/components/AppointmentList/get-establishment-cell-variant";
import { CancelledSessionName } from "#src/components/SessionList/CancelledSessionName";
import { RecurringIconChip } from "#src/components/common/RecurringIconChip";
import { ResponsiveTooltip } from "#src/components/common/responsive-tooltip";
import {
  AppointmentColumn,
  type AppointmentTableColumn,
  type EnrichedAppointment,
} from "#src/types";
import { useTranslation } from "#src/utils/i18n";
import { formatSessionTimeRange } from "#src/utils/session-time-range";

export const useAppointmentColumns = (): AppointmentTableColumn[] => {
  const { t, i18n } = useTranslation("sessionList");
  const intlLocale = i18n?.language;
  const companyTimeZone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  return useMemo(
    () => getColumns(t, intlLocale, companyTimeZone),
    [t, intlLocale, companyTimeZone],
  );
};

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
    render: (row: EnrichedAppointment) => (
      <Body htmlVariant="p" size="md">
        {formatSessionTimeRange({
          dateStart: row.date_start,
          dateEnd: row.date_end,
          zone: companyTimeZone,
          locale: intlLocale,
        })}
      </Body>
    ),
  };

  const nameColumn: AppointmentTableColumn = {
    header: t("appointmentTable.headers.name"),
    label: t("appointmentTable.headers.name"),
    id: AppointmentColumn.NAME,
    type: "custom",
    align: "start",
    render: (row: EnrichedAppointment) =>
      row.isCancelled ? (
        <CancelledSessionName
          name={row.name}
          className="truncate max-w-[202px]"
        />
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
    render: (row: EnrichedAppointment) =>
      row.teacherName ? (
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
      ) : (
        <Body
          htmlVariant="p"
          size="md"
          color="weak"
          className="truncate max-w-[140px]"
        >
          {t("appointmentTable.noTeacher")}
        </Body>
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
    type: "custom",
    align: "start",
    render: (row: EnrichedAppointment) => {
      const variant = getEstablishmentCellVariant(row);
      if (variant.kind === "name") {
        return (
          <Body htmlVariant="p" size="md" className="truncate max-w-[128px]">
            {variant.name}
          </Body>
        );
      }
      if (variant.kind === "atHome") {
        return (
          <Body htmlVariant="p" size="md" className="truncate max-w-[128px]">
            {t("appointmentTable.atHome")}
          </Body>
        );
      }
      return (
        <Body
          htmlVariant="p"
          size="md"
          color="weak"
          className="truncate max-w-[128px]"
        >
          {t("appointmentTable.noVenue")}
        </Body>
      );
    },
  };

  const typeColumn: AppointmentTableColumn = {
    id: AppointmentColumn.TYPE,
    header: t("appointmentTable.headers.type"),
    label: t("appointmentTable.headers.type"),
    type: "custom",
    align: "start",
    render: (row: EnrichedAppointment) =>
      row.isRecurring ? (
        <RecurringIconChip tooltip={t("appointmentTable.recurringTooltip")} />
      ) : null,
  };

  const actionsColumn: AppointmentTableColumn = {
    id: AppointmentColumn.ACTIONS,
    header: "",
    label: t("appointmentTable.headers.actions"),
    type: "custom",
    align: "end",
    cellsClassName: "w-xl",
    render: (row: EnrichedAppointment) => (
      <AppointmentShortcutActionsButton appointment={row} />
    ),
  };

  return [
    timeColumn,
    nameColumn,
    teacherColumn,
    participantColumn,
    passUsedColumn,
    establishmentColumn,
    typeColumn,
    actionsColumn,
  ];
};
