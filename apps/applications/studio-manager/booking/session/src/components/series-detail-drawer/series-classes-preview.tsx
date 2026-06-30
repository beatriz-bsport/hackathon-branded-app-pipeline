import { type FC, useMemo } from "react";
import { useHref } from "react-router";

import type { Session, Teacher } from "@bsport/api-book";
import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import { fromIsoString } from "@bsport/datetime-manipulation";
import {
  Body,
  Button,
  Chip,
  type GenericTableColumn,
  Icon,
  Table,
  Title,
} from "@bsport/kaizen-primitive-core";

import { SectionErrorFallback } from "#src/components/query-boundary/fallbacks";
import {
  type SessionTimeStatus,
  getSessionTimeStatus,
} from "#src/components/session-occurrence-table/get-session-time-status";
import {
  resolveBookingsManagementRevampPath,
  resolveSeriesClassesPath,
} from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

const CLASS_PREVIEW_PAGE_SIZE = 10;

const CLASS_STATUS_CHIP_COLORS: Record<
  SessionTimeStatus,
  "critical" | "default" | "info" | "positive"
> = {
  cancelled: "critical",
  ongoing: "positive",
  past: "default",
  upcoming: "info",
};

type SeriesDetailClassRowLabels = {
  missingTeacher: string;
  statuses: Record<SessionTimeStatus, string>;
};

type SeriesDetailClassTableRow = {
  id: number;
  available: boolean;
  classDate: string;
  classStartTime: string;
  effectif: number;
  onRowClick: () => void;
  status: SessionTimeStatus;
  teacherName: string;
  validatedBookingCount: number;
};

type BuildSeriesDetailClassColumnsParams = {
  labels: SeriesDetailClassRowLabels;
};

const formatClassDate = ({
  dateStart,
  locale,
  timeZone,
}: {
  dateStart: string;
  locale: string;
  timeZone: string;
}) => {
  const date = fromIsoString(dateStart, { locale, zone: timeZone });

  return formatDateTimeFromDate(
    date,
    DATETIME_FORMATS.MEDIUM_DATE_WITH_WEEKDAY,
  );
};

const formatClassStartTime = ({
  dateStart,
  locale,
  timeZone,
}: {
  dateStart: string;
  locale: string;
  timeZone: string;
}) => {
  const date = fromIsoString(dateStart, { locale, zone: timeZone });

  return formatDateTimeFromDate(date, DATETIME_FORMATS.TIME_SIMPLE);
};

const buildSeriesDetailClassColumns = ({
  labels,
}: BuildSeriesDetailClassColumnsParams): GenericTableColumn<SeriesDetailClassTableRow>[] => [
  {
    header: "",
    id: "class",
    type: "custom",
    colClassName: "w-full max-w-0",
    render: (row) => (
      <div className="min-w-0">
        <Body
          htmlVariant="p"
          size="lg"
          className={`truncate ${row.available ? "" : "line-through"}`}
          color={row.available ? "default" : "weak"}
        >
          {row.classDate} - {row.classStartTime}
        </Body>
        <Body htmlVariant="p" size="md" color="weak" className="truncate">
          {row.teacherName}
        </Body>
      </div>
    ),
  },
  {
    header: "",
    id: "metadata",
    type: "custom",
    align: "end",
    render: (row) => (
      <div className="flex shrink-0 items-center gap-xs">
        <div className="flex items-center gap-2xs rounded-sm border-stroke-thin border-stroke-default px-xs py-2xs text-onsurface-default">
          <Icon icon="users-01" size="sm" />
          <Body htmlVariant="span" size="sm">
            {row.validatedBookingCount}/{row.effectif}
          </Body>
        </div>
        <Chip
          label={labels.statuses[row.status]}
          color={CLASS_STATUS_CHIP_COLORS[row.status]}
          type="weak"
          size="lg"
        />
      </div>
    ),
  },
];

type SeriesClassesPreviewProps = {
  classesPreviewPage: number;
  hasError: boolean;
  isRefreshing: boolean;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  previewClasses: Session[];
  seriesId: number;
  statusSummaryParts: string[];
  teachersById: Record<string, Teacher>;
  totalClasses: number;
};

export const SeriesClassesPreview: FC<SeriesClassesPreviewProps> = ({
  classesPreviewPage,
  hasError,
  isRefreshing,
  onPageChange,
  onRetry,
  previewClasses,
  seriesId,
  statusSummaryParts,
  teachersById,
  totalClasses,
}) => {
  const { t, i18n } = useTranslation("series");
  const locale = i18n.language;
  const appHref = useHref("/");
  const appRootHref = useMemo(() => appHref.replace(/\/$/, ""), [appHref]);
  const seriesClassesHref = useHref(resolveSeriesClassesPath(seriesId));

  const rowLabels = useMemo(
    () => ({
      missingTeacher: t("seriesDetailDrawer.fallbacks.notSet"),
      statuses: {
        cancelled: t("seriesDetailDrawer.classStatuses.cancelled"),
        ongoing: t("seriesDetailDrawer.classStatuses.ongoing"),
        past: t("seriesDetailDrawer.classStatuses.past"),
        upcoming: t("seriesDetailDrawer.classStatuses.upcoming"),
      },
    }),
    [t],
  );

  const columns = useMemo(
    () =>
      buildSeriesDetailClassColumns({
        labels: rowLabels,
      }),
    [rowLabels],
  );

  const rows = useMemo<SeriesDetailClassTableRow[]>(
    () =>
      previewClasses.map((sessionClass) => {
        const displayedTeacherId =
          sessionClass.coach_override ?? sessionClass.coach;
        const displayedTeacher = teachersById[displayedTeacherId];
        const detailUrl = `${appRootHref}${resolveBookingsManagementRevampPath(
          sessionClass.id,
        )}`;

        return {
          id: sessionClass.id,
          available: sessionClass.available,
          classDate: formatClassDate({
            dateStart: sessionClass.date_start,
            locale,
            timeZone: sessionClass.timezone_name,
          }),
          classStartTime: formatClassStartTime({
            dateStart: sessionClass.date_start,
            locale,
            timeZone: sessionClass.timezone_name,
          }),
          effectif: sessionClass.effectif,
          onRowClick: () => {
            window.open(detailUrl, "_blank", "noopener,noreferrer");
          },
          status: getSessionTimeStatus({
            available: sessionClass.available,
            dateStart: sessionClass.date_start,
            durationMinute: sessionClass.duration_minute,
            timeZone: sessionClass.timezone_name,
          }),
          teacherName: displayedTeacher?.name ?? rowLabels.missingTeacher,
          validatedBookingCount: sessionClass.validated_booking_count,
        };
      }),
    [
      appRootHref,
      locale,
      previewClasses,
      rowLabels.missingTeacher,
      teachersById,
    ],
  );

  return (
    <section className="flex flex-col gap-sm">
      <div className="flex items-start justify-between gap-md">
        <div className="flex min-w-0 flex-col gap-2xs">
          <div className="flex items-center gap-xs">
            <Title htmlVariant="h3" weight="strong">
              {t("seriesDetailDrawer.classes.title")}
            </Title>
            <Chip
              label={String(totalClasses)}
              color="default"
              type="weak"
              size="lg"
            />
          </div>
          <Body htmlVariant="p" size="md" color="weak">
            {statusSummaryParts.length > 0
              ? statusSummaryParts.join(", ")
              : t("seriesDetailDrawer.classes.noStatusSummary")}
          </Body>
        </div>
        <Button
          kind="icon-button"
          label={t("seriesDetailDrawer.moreDetails")}
          icon="link-external-02"
          size="md"
          intent="flat"
          color="default"
          href={seriesClassesHref}
          target="_blank"
        />
      </div>

      {hasError ? (
        <SectionErrorFallback onRetry={onRetry} />
      ) : rows.length === 0 && !isRefreshing ? (
        <Body htmlVariant="p" size="md" color="weak">
          {t("seriesDetailDrawer.classes.empty")}
        </Body>
      ) : (
        <Table
          id="series-detail-classes-preview"
          className="overflow-hidden rounded-sm"
          columns={columns}
          hideHeader
          rowHeight="lg"
          rows={rows}
          loadingProps={{
            isLoading: isRefreshing,
            message: t("seriesDetailDrawer.classes.loading"),
          }}
          paginationProps={{
            currentPage: classesPreviewPage,
            rowsPerPage: CLASS_PREVIEW_PAGE_SIZE,
            totalItems: totalClasses,
            disabled: isRefreshing,
            showRowsPerPageSelector: false,
            onPageChange,
          }}
        />
      )}
    </section>
  );
};
