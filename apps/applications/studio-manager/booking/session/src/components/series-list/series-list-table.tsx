import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import type { DateTime } from "@bsport/datetime-manipulation";
import {
  Table,
  useLoadingState,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import { SectionErrorFallback } from "#src/components/query-boundary/fallbacks";
import { SeriesCancelModal } from "#src/components/series-cancel/series-cancel-modal";
import { SeriesDetailDrawer } from "#src/components/series-detail-drawer/series-detail-drawer";
import { SeriesDuplicateModal } from "#src/components/series-duplicate/series-duplicate-modal";
import { hasActiveSeriesFilters } from "#src/components/series-list/filters/get-params-from-filters";
import { SeriesListCards } from "#src/components/series-list/series-list-cards";
import {
  type SeriesListColumnLabels,
  type SeriesListRow,
  buildSeriesListColumns,
} from "#src/components/series-list/series-list-columns";
import { SeriesListDateSummary } from "#src/components/series-list/series-list-date-summary";
import {
  getSeriesBookingRule,
  getSeriesDateBounds,
} from "#src/components/series-list/series-list-helpers";
import { useSeriesListQuery } from "#src/hooks/series/use-series-list-query";
import { useFetchActivitiesByIds } from "#src/hooks/use-fetch-activities-by-ids";
import { useModal } from "#src/hooks/use-modal";
import { useToday } from "#src/hooks/use-today";
import {
  selectSelectedDate,
  selectSeriesDisplayedColumns,
  selectSeriesFilters,
  selectSeriesOrdering,
  selectSeriesShowCancelled,
  setCalendarView,
  setSelectedDate,
  setUniqueDate,
  useCalendarStore,
} from "#src/stores/calendar";
import { CalendarView } from "#src/types";
import { useUrls } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

type SeriesListDateRange = [DateTime, DateTime | null];

type SeriesDetailDrawerSelectionSeries = {
  id: number;
};

const getUniqueActivityIds = (rows: { meta_activity: number }[]) =>
  Array.from(new Set(rows.map((row) => row.meta_activity)));

type SeriesListTableProps = {
  canCreateSeries: boolean;
  onAddSeriesClick: () => void;
  searchQuery: string;
};

const useSeriesDetailDrawerSelection = (
  series: SeriesDetailDrawerSelectionSeries[],
) => {
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(null);

  const openSeriesDetails = useCallback((seriesId: number) => {
    setSelectedSeriesId(seriesId);
  }, []);

  const closeSeriesDetails = useCallback(() => {
    setSelectedSeriesId(null);
  }, []);

  const selectedSeriesIndex = useMemo(
    () =>
      selectedSeriesId === null
        ? -1
        : series.findIndex(
            (selectionSeries) => selectionSeries.id === selectedSeriesId,
          ),
    [selectedSeriesId, series],
  );

  const hasPreviousSelectedSeries = selectedSeriesIndex > 0;

  const hasNextSelectedSeries =
    selectedSeriesIndex >= 0 && selectedSeriesIndex < series.length - 1;

  const selectPreviousSeries = useCallback(() => {
    const previousSeries =
      selectedSeriesIndex > 0 ? series[selectedSeriesIndex - 1] : undefined;

    if (!previousSeries) {
      return;
    }

    setSelectedSeriesId(previousSeries.id);
  }, [selectedSeriesIndex, series]);

  const selectNextSeries = useCallback(() => {
    const nextSeries =
      selectedSeriesIndex >= 0 ? series[selectedSeriesIndex + 1] : undefined;

    if (!nextSeries) {
      return;
    }

    setSelectedSeriesId(nextSeries.id);
  }, [selectedSeriesIndex, series]);

  return {
    closeSeriesDetails,
    hasNextSelectedSeries,
    hasPreviousSelectedSeries,
    openSeriesDetails,
    selectNextSeries,
    selectPreviousSeries,
    selectedSeriesId,
  };
};

export const SeriesListTable = ({
  canCreateSeries,
  onAddSeriesClick,
  searchQuery,
}: SeriesListTableProps) => {
  const { t, i18n } = useTranslation("series");
  const { t: tSessionList } = useTranslation("sessionList");
  const isMobile = !useMatchMedia("lg");
  const locale = i18n.language;
  const today = useToday();
  const selectedDate = useCalendarStore(selectSelectedDate);
  const seriesFilters = useCalendarStore(selectSeriesFilters);
  const seriesOrdering = useCalendarStore(selectSeriesOrdering);
  const seriesShowCancelled = useCalendarStore(selectSeriesShowCancelled);
  const seriesDisplayedColumns = useCalendarStore(selectSeriesDisplayedColumns);
  const hasShowCancelledSeriesPermission = useObjectLevelPermission(
    "planning.calendar.allowed_actions.readCancellations",
  );
  const selectedDateRange = useMemo<SeriesListDateRange>(() => {
    if (selectedDate.type === "single") {
      return [selectedDate.date, null];
    }

    const fromDate = selectedDate.minDate ?? today;

    return [fromDate, selectedDate.maxDate ?? null];
  }, [selectedDate, today]);

  const companyTimeZone =
    dataAccessLayer.useCompanyTheme()?.timezone_name ?? getCompanyTimezone();

  const {
    close: closeDuplicateModal,
    isOpen: isDuplicateModalOpen,
    open: openDuplicateModal,
  } = useModal();
  const [duplicateSeriesId, setDuplicateSeriesId] = useState<number | null>(
    null,
  );

  const {
    close: closeCancelModal,
    isOpen: isCancelModalOpen,
    open: openCancelModal,
  } = useModal();
  const [cancelSeriesId, setCancelSeriesId] = useState<number | null>(null);

  const navigate = useNavigate();
  const { resolveSeriesEditPath } = useUrls();

  const {
    hasAnySeries,
    isCheckingSeriesExistence,
    paginationProps,
    query,
    resetPage,
    series,
  } = useSeriesListQuery({
    filters: seriesFilters,
    minDate: selectedDateRange[0],
    maxDate: selectedDateRange[1],
    ordering: seriesOrdering,
    searchQuery,
    canShowCancelled: hasShowCancelledSeriesPermission,
    showCancelled: seriesShowCancelled,
  });

  const hasSearchOrFilters =
    searchQuery.trim().length > 0 ||
    hasActiveSeriesFilters(seriesFilters) ||
    (hasShowCancelledSeriesPermission && !seriesShowCancelled);

  const handleDateRangeChange = useCallback(
    (dateRange: SeriesListDateRange) => {
      setCalendarView(CalendarView.RANGE);
      setSelectedDate(dateRange);
      resetPage();
    },
    [resetPage],
  );

  const handleTodayClick = useCallback(() => {
    setUniqueDate(today);
    resetPage();
  }, [resetPage, today]);

  const activityIds = useMemo(() => getUniqueActivityIds(series), [series]);
  const { data: activitiesById = {}, isLoading: isLoadingActivities } =
    useFetchActivitiesByIds(activityIds, !query.isLoading);

  const {
    closeSeriesDetails,
    hasNextSelectedSeries,
    hasPreviousSelectedSeries,
    openSeriesDetails,
    selectNextSeries,
    selectPreviousSeries,
    selectedSeriesId,
  } = useSeriesDetailDrawerSelection(series);

  const openSeriesPage = useCallback(
    (seriesId: number) => {
      navigate(resolveSeriesEditPath(seriesId));
    },
    [navigate, resolveSeriesEditPath],
  );

  const openDuplicateSeries = useCallback(
    (seriesId: number) => {
      setDuplicateSeriesId(seriesId);
      openDuplicateModal();
    },
    [openDuplicateModal],
  );

  const closeDuplicateSeries = useCallback(() => {
    setDuplicateSeriesId(null);
    closeDuplicateModal();
  }, [closeDuplicateModal]);

  const openCancelSeries = useCallback(
    (seriesId: number) => {
      setCancelSeriesId(seriesId);
      openCancelModal();
    },
    [openCancelModal],
  );

  const closeCancelSeries = useCallback(() => {
    setCancelSeriesId(null);
    closeCancelModal();
  }, [closeCancelModal]);

  const { refetch: refetchSeries } = query;

  const handleCancelSeriesSuccess = useCallback(() => {
    const cancelledSeriesId = cancelSeriesId;

    closeCancelSeries();

    if (cancelledSeriesId !== null && selectedSeriesId === cancelledSeriesId) {
      closeSeriesDetails();
    }

    void refetchSeries();
  }, [
    cancelSeriesId,
    closeCancelSeries,
    closeSeriesDetails,
    refetchSeries,
    selectedSeriesId,
  ]);

  const seriesListLabels = useMemo<SeriesListColumnLabels>(
    () => ({
      actions: {
        cancel: t("seriesTable.actions.cancel"),
        duplicate: t("seriesTable.actions.duplicate"),
        edit: t("seriesTable.actions.edit"),
        menu: t("seriesTable.actions.label"),
      },
      bookingRule: t("seriesTable.headers.bookingRule"),
      bookingRuleInfo: {
        description: t("seriesTable.headerInfo.bookingRule.description"),
        fullSeriesDescription: t(
          "seriesTable.headerInfo.bookingRule.fullSeriesDescription",
        ),
        openSeriesDescription: t(
          "seriesTable.headerInfo.bookingRule.openSeriesDescription",
        ),
        singleClassDescription: t(
          "seriesTable.headerInfo.bookingRule.singleClassDescription",
        ),
        title: t("seriesTable.headerInfo.bookingRule.title"),
      },
      cancelled: t("seriesFilters.status.cancelled"),
      classes: t("seriesTable.headers.classes"),
      dates: t("seriesTable.headers.dates"),
      details: t("seriesTable.detailsButton"),
      fullSeries: t("seriesTable.bookingRules.fullSeries"),
      name: t("seriesTable.headers.name"),
      openSeries: t("seriesTable.bookingRules.openSeries"),
      singleClass: t("seriesTable.bookingRules.singleClass"),
    }),
    [t],
  );

  const columns = useMemo(
    () =>
      buildSeriesListColumns({
        displayedColumns: seriesDisplayedColumns,
        labels: seriesListLabels,
      }),
    [seriesDisplayedColumns, seriesListLabels],
  );
  const isLoadingSeries =
    query.isLoading || (query.isFetching && query.isPlaceholderData);

  const rows = useMemo<SeriesListRow[]>(
    () =>
      series.map((seriesItem) => {
        const activity = activitiesById[seriesItem.meta_activity];
        const isSelectedSeries = seriesItem.id === selectedSeriesId;
        const { firstDate, lastDate } = getSeriesDateBounds(seriesItem);
        const dateFormatOptions = { locale, timeZone: companyTimeZone };
        const formattedFirstDate = firstDate
          ? formatDateTime(
              firstDate,
              DATETIME_FORMATS.MEDIUM_DATE,
              dateFormatOptions,
            )
          : "";
        const formattedLastDate = lastDate
          ? formatDateTime(
              lastDate,
              DATETIME_FORMATS.MEDIUM_DATE,
              dateFormatOptions,
            )
          : "";
        // Example outputs: "Jun 7, 2026" or "Jun 7, 2026 - Jun 13, 2026".
        const formattedDates =
          formattedFirstDate &&
          formattedLastDate &&
          formattedFirstDate !== formattedLastDate
            ? `${formattedFirstDate} - ${formattedLastDate}`
            : formattedFirstDate;

        return {
          id: seriesItem.id,
          available: seriesItem.available !== false,
          bookingRule: getSeriesBookingRule(seriesItem),
          classesCount: seriesItem.offers.length,
          color: activity?.color,
          dates: formattedDates || t("seriesTable.fallbacks.missingDate"),
          editPath: resolveSeriesEditPath(seriesItem.id),
          isActive: isSelectedSeries,
          name: seriesItem.name,
          onOpenCancel:
            seriesItem.available === false
              ? undefined
              : () => openCancelSeries(seriesItem.id),
          onOpenDuplicate: () => openDuplicateSeries(seriesItem.id),
          onOpenDetails: () => openSeriesDetails(seriesItem.id),
          onRowClick: () => openSeriesPage(seriesItem.id),
        };
      }),
    [
      activitiesById,
      companyTimeZone,
      locale,
      openCancelSeries,
      openDuplicateSeries,
      openSeriesDetails,
      openSeriesPage,
      resolveSeriesEditPath,
      selectedSeriesId,
      series,
      t,
    ],
  );
  const loadingProps = {
    isLoading:
      isLoadingSeries || isCheckingSeriesExistence || isLoadingActivities,
    message: t("seriesTable.isLoading"),
  };
  const { LoadingState, shouldRenderLoadingState } =
    useLoadingState(loadingProps);
  const emptyStateProps = {
    isEmpty:
      !isLoadingSeries && !isCheckingSeriesExistence && rows.length === 0,
    emptyConfig: {
      title: t("seriesTable.emptyState.title"),
      subtitle: t("seriesTable.emptyState.subtitle"),
      ctaButtonConfig: canCreateSeries
        ? {
            label: t("seriesTable.emptyState.addSeriesButton"),
            onClick: onAddSeriesClick,
          }
        : undefined,
    },
    isEmptySearch:
      !isLoadingSeries &&
      !isCheckingSeriesExistence &&
      hasAnySeries &&
      rows.length === 0,
    emptySearchConfig: {
      title: hasSearchOrFilters
        ? t("seriesTable.emptySearchState.title")
        : t("seriesTable.emptyUpcomingState.title"),
      subtitle: hasSearchOrFilters
        ? t("seriesTable.emptySearchState.subtitle")
        : t("seriesTable.emptyUpcomingState.subtitle"),
    },
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface-default">
      <SeriesListDateSummary
        fromDate={selectedDateRange[0]}
        onDateRangeChange={handleDateRangeChange}
        onTodayClick={handleTodayClick}
        todayLabel={tSessionList("dateNavigation.todayButton")}
        toDate={selectedDateRange[1]}
      />
      {query.isError ? (
        <SectionErrorFallback onRetry={() => void query.refetch()} />
      ) : shouldRenderLoadingState ? (
        <div className="min-h-0 flex-1">
          <LoadingState />
        </div>
      ) : isMobile ? (
        <SeriesListCards
          columns={columns}
          emptyStateProps={emptyStateProps}
          loadingProps={loadingProps}
          paginationProps={paginationProps}
          rows={rows}
        />
      ) : (
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            rowHeight="lg"
            rows={rows}
            paginationProps={paginationProps}
            loadingProps={loadingProps}
            emptyStateProps={emptyStateProps}
          />
        </div>
      )}
      <SeriesDetailDrawer
        hasNextSeries={hasNextSelectedSeries}
        hasPreviousSeries={hasPreviousSelectedSeries}
        onClose={closeSeriesDetails}
        onOpenCancelSeries={openCancelSeries}
        onOpenDuplicateSeries={openDuplicateSeries}
        onSelectNextSeries={selectNextSeries}
        onSelectPreviousSeries={selectPreviousSeries}
        selectedSeriesId={selectedSeriesId}
      />
      {isDuplicateModalOpen && duplicateSeriesId !== null ? (
        <SeriesDuplicateModal
          key={duplicateSeriesId}
          onClose={closeDuplicateSeries}
          seriesId={duplicateSeriesId}
        />
      ) : null}
      {isCancelModalOpen && cancelSeriesId !== null ? (
        <SeriesCancelModal
          key={cancelSeriesId}
          onClose={closeCancelSeries}
          onSuccess={handleCancelSeriesSuccess}
          seriesId={cancelSeriesId}
        />
      ) : null}
    </div>
  );
};
