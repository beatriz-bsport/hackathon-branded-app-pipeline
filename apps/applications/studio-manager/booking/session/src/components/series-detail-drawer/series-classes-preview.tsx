import { type FC, useMemo } from "react";

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
  Icon,
  List,
  Title,
} from "@bsport/kaizen-primitive-core";

import { SectionErrorFallback } from "#src/components/query-boundary/fallbacks";
import {
  type SessionTimeStatus,
  getSessionTimeStatus,
} from "#src/components/session-occurrence-table/get-session-time-status";
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

type SeriesDetailClassRowProps = {
  id: string;
  labels: SeriesDetailClassRowLabels;
  locale: string;
  sessionClass: Session;
  teachersById: Record<string, Teacher>;
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

const SeriesDetailClassRow: FC<SeriesDetailClassRowProps> = ({
  labels,
  locale,
  sessionClass,
  teachersById,
}) => {
  const displayedTeacherId = sessionClass.coach_override ?? sessionClass.coach;
  const displayedTeacher = teachersById[displayedTeacherId];
  const status = getSessionTimeStatus({
    available: sessionClass.available,
    dateStart: sessionClass.date_start,
    durationMinute: sessionClass.duration_minute,
    timeZone: sessionClass.timezone_name,
  });
  const classDate = formatClassDate({
    dateStart: sessionClass.date_start,
    locale,
    timeZone: sessionClass.timezone_name,
  });
  const classStartTime = formatClassStartTime({
    dateStart: sessionClass.date_start,
    locale,
    timeZone: sessionClass.timezone_name,
  });

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-sm border-b-stroke-thin border-b-stroke-divider px-md py-sm last:border-b-0">
      <div className="min-w-0">
        <Body
          htmlVariant="p"
          size="lg"
          className={`truncate ${sessionClass.available ? "" : "line-through"}`}
          color={sessionClass.available ? "default" : "weak"}
        >
          {classDate} - {classStartTime}
        </Body>
        <Body htmlVariant="p" size="md" color="weak" className="truncate">
          {displayedTeacher?.name ?? labels.missingTeacher}
        </Body>
      </div>

      <div className="flex shrink-0 items-center gap-xs">
        <div className="flex items-center gap-2xs rounded-sm border-stroke-thin border-stroke-default px-xs py-2xs text-onsurface-default">
          <Icon icon="users-01" size="sm" />
          <Body htmlVariant="span" size="sm">
            {sessionClass.validated_booking_count}/{sessionClass.effectif}
          </Body>
        </div>
        <Chip
          label={labels.statuses[status]}
          color={CLASS_STATUS_CHIP_COLORS[status]}
          type="weak"
          size="lg"
        />
      </div>
    </div>
  );
};

type SeriesClassesPreviewProps = {
  classesPreviewPage: number;
  hasError: boolean;
  isRefreshing: boolean;
  moreDetailsSessionId: number | null;
  onMoreDetailsClick: () => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  previewClasses: Session[];
  statusSummaryParts: string[];
  teachersById: Record<string, Teacher>;
  totalClasses: number;
};

export const SeriesClassesPreview: FC<SeriesClassesPreviewProps> = ({
  classesPreviewPage,
  hasError,
  isRefreshing,
  moreDetailsSessionId,
  onMoreDetailsClick,
  onPageChange,
  onRetry,
  previewClasses,
  statusSummaryParts,
  teachersById,
  totalClasses,
}) => {
  const { t, i18n } = useTranslation("series");
  const locale = i18n.language;

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

  const rows = useMemo(
    () =>
      previewClasses.map((sessionClass) => ({
        id: String(sessionClass.id),
        labels: rowLabels,
        locale,
        sessionClass,
        teachersById,
      })),
    [locale, previewClasses, rowLabels, teachersById],
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
          disabled={moreDetailsSessionId === null}
          onClick={onMoreDetailsClick}
        />
      </div>

      {hasError ? (
        <SectionErrorFallback onRetry={onRetry} />
      ) : rows.length === 0 && !isRefreshing ? (
        <Body htmlVariant="p" size="md" color="weak">
          {t("seriesDetailDrawer.classes.empty")}
        </Body>
      ) : (
        <List
          id="series-detail-classes-preview"
          className="rounded-sm"
          items={rows}
          ListItem={SeriesDetailClassRow}
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
