import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import { fromIsoString } from "@bsport/datetime-manipulation";
import {
  Body,
  Chip,
  type GenericTableColumn,
  Icon,
} from "@bsport/kaizen-primitive-core";

import { CancelledSessionName } from "#src/components/SessionList/CancelledSessionName";
import { ParticipantsCell } from "#src/components/SessionList/ParticipantsCell";
import { TeacherCell } from "#src/components/common/teacher-cell";
import { formatSessionTimeRange } from "#src/utils/session-time-range";

import { getSessionTimeStatus } from "./get-session-time-status";

export type OccurrenceRow = {
  id: number;
  date_start: string;
  duration_minute: number;
  timezone_name: string;
  validated_booking_count: number;
  effectif: number;
  nb_option: number;
  waiting_list_max_size: number;
  coach: number;
  coach_override: number | null;
  establishment: number;
  available: boolean;
  teacherName?: string;
  originalTeacherName?: string;
  teacherAvatar?: string;
  teacherInitials?: string;
  establishmentName?: string;
  /** React Router destination used when rows should stay in the same window. */
  detailPath?: string;
  /** Absolute URL to the session's management page (trailing link column). */
  detailUrl?: string;
  isCurrentSession?: boolean;
};

export type OccurrenceColumnLabels = {
  date: string;
  time: string;
  participants: string;
  teacher: string;
  establishment: string;
  status: string;
  statusUpcoming: string;
  statusOngoing: string;
  statusPast: string;
  statusCancelled: string;
  openSession: string;
  thisClass?: string;
};

type OccurrenceColumnsOptions = {
  showExternalLinkColumn?: boolean;
};

const STATUS_CHIP: Record<
  ReturnType<typeof getSessionTimeStatus>,
  {
    color: "default" | "positive" | "info" | "critical";
    labelKey: keyof OccurrenceColumnLabels;
  }
> = {
  past: { color: "default", labelKey: "statusPast" },
  ongoing: { color: "positive", labelKey: "statusOngoing" },
  upcoming: { color: "info", labelKey: "statusUpcoming" },
  cancelled: { color: "critical", labelKey: "statusCancelled" },
};

const buildExternalLinkColumns = (
  labels: OccurrenceColumnLabels,
  showExternalLinkColumn?: boolean,
): GenericTableColumn<OccurrenceRow>[] => {
  if (showExternalLinkColumn === false) {
    return [];
  }

  return [
    {
      header: "",
      id: "open",
      type: "custom",
      align: "end",
      render: (row) =>
        row.detailUrl ? (
          <a
            href={row.detailUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels.openSession}
            // mr-xs: right-edge inset to mirror the first column (cell already has `xs`).
            className="mr-xs text-onsurface-weak hover:text-onsurface-default"
            onClick={(event) => event.stopPropagation()}
          >
            <Icon icon="link-external-02" size="sm" />
          </a>
        ) : null,
    },
  ];
};

export const buildOccurrenceColumns = (
  labels: OccurrenceColumnLabels,
  locale?: string,
  options: OccurrenceColumnsOptions = { showExternalLinkColumn: true },
): GenericTableColumn<OccurrenceRow>[] => [
  {
    header: labels.date,
    id: "date",
    type: "custom",
    render: (row) => {
      const start = fromIsoString(row.date_start, {
        zone: row.timezone_name,
        locale,
      });
      const formatted = formatDateTimeFromDate(
        start,
        DATETIME_FORMATS.MEDIUM_DATE_WITH_WEEKDAY,
      );
      const dateLabel = !row.available ? (
        <CancelledSessionName name={formatted} />
      ) : (
        <Body htmlVariant="span">{formatted}</Body>
      );

      if (!row.isCurrentSession || !labels.thisClass) {
        return dateLabel;
      }

      return (
        <div className="flex items-center gap-xs">
          {dateLabel}
          <Chip label={labels.thisClass} color="main" type="weak" size="lg" />
        </div>
      );
    },
  },
  {
    header: labels.time,
    id: "time",
    type: "custom",
    render: (row) => (
      <Body htmlVariant="span">
        {formatSessionTimeRange({
          dateStart: row.date_start,
          durationMinute: row.duration_minute,
          zone: row.timezone_name,
          locale,
        })}
      </Body>
    ),
  },
  {
    header: labels.participants,
    id: "participants",
    type: "custom",
    render: (row) => (
      <ParticipantsCell
        nb_bookings={row.validated_booking_count}
        effectif={row.effectif}
        nb_option={row.nb_option}
        waiting_list_max_size={row.waiting_list_max_size}
        available={row.available}
      />
    ),
  },
  {
    header: labels.teacher,
    id: "teacher",
    type: "custom",
    render: (row) => (
      <TeacherCell
        teacherName={row.teacherName}
        originalTeacherName={row.originalTeacherName}
        coach_override={row.coach_override}
        teacherAvatar={row.teacherAvatar}
        teacherInitials={row.teacherInitials}
      />
    ),
  },
  {
    header: labels.establishment,
    id: "establishment",
    type: "custom",
    render: (row) => (
      <Body htmlVariant="span">{row.establishmentName ?? ""}</Body>
    ),
  },
  {
    header: labels.status,
    id: "status",
    type: "custom",
    render: (row) => {
      const status = getSessionTimeStatus({
        dateStart: row.date_start,
        durationMinute: row.duration_minute,
        available: row.available,
        timeZone: row.timezone_name,
      });
      const cfg = STATUS_CHIP[status];
      return (
        <Chip
          label={labels[cfg.labelKey]}
          color={cfg.color}
          type="weak"
          size="lg"
        />
      );
    },
  },
  ...buildExternalLinkColumns(labels, options.showExternalLinkColumn),
];
