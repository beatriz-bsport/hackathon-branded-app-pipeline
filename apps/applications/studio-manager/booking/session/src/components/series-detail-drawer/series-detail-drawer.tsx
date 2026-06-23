import { type FC, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
  DetailDrawer,
  Divider,
  useLoadingState,
} from "@bsport/kaizen-primitive-core";

import { SectionErrorFallback } from "#src/components/query-boundary/fallbacks";
import { SeriesBookingRuleSection } from "#src/components/series-detail-drawer/series-booking-rule-section";
import { SeriesClassesPreview } from "#src/components/series-detail-drawer/series-classes-preview";
import { SeriesDetailDrawerHeader } from "#src/components/series-detail-drawer/series-detail-drawer-header";
import { SeriesDetailMetadata } from "#src/components/series-detail-drawer/series-detail-metadata";
import { useSeriesDetailDrawerData } from "#src/hooks/series/use-series-detail-drawer-data";
import { useSeriesDetailDrawerViewModel } from "#src/hooks/series/use-series-detail-drawer-view-model";
import { useUrls } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type SeriesDetailDrawerProps = {
  hasNextSeries: boolean;
  hasPreviousSeries: boolean;
  onClose: () => void;
  onOpenCancelSeries: (seriesId: number) => void;
  onOpenDuplicateSeries: (seriesId: number) => void;
  onSelectNextSeries: () => void;
  onSelectPreviousSeries: () => void;
  selectedSeriesId: number | null;
};

export const SeriesDetailDrawer: FC<SeriesDetailDrawerProps> = ({
  hasNextSeries,
  hasPreviousSeries,
  onClose,
  onOpenCancelSeries,
  onOpenDuplicateSeries,
  onSelectNextSeries,
  onSelectPreviousSeries,
  selectedSeriesId,
}) => {
  const { t } = useTranslation("series");
  const navigate = useNavigate();
  const { resolveSeriesClassesPath } = useUrls();
  const [classesPreviewPage, setClassesPreviewPage] = useState(1);

  // Reset the classes preview to the first page when the selected series changes.
  useEffect(() => {
    setClassesPreviewPage(1);
  }, [selectedSeriesId]);

  const {
    activity,
    activityQuery,
    allClasses,
    allClassesQuery,
    level,
    levelsQuery,
    previewClasses,
    previewClassesQuery,
    series,
    seriesQuery,
    teachersById,
    teachersQuery,
  } = useSeriesDetailDrawerData({
    classesPreviewPage,
    seriesId: selectedSeriesId,
  });

  const isOpen = selectedSeriesId !== null;

  const hasShellError =
    seriesQuery.isError ||
    allClassesQuery.isError ||
    activityQuery.isError ||
    levelsQuery.isError;

  const isShellLoading =
    seriesQuery.isLoading ||
    allClassesQuery.isLoading ||
    activityQuery.isLoading ||
    levelsQuery.isLoading;

  const hasClassPreviewError =
    previewClassesQuery.isError || teachersQuery.isError;

  const isClassPreviewRefreshing =
    previewClassesQuery.isFetching || teachersQuery.isFetching;

  const { LoadingState, shouldRenderLoadingState } = useLoadingState({
    isLoading: isShellLoading,
    message: t("seriesDetailDrawer.loading"),
  });

  const handleRetry = useCallback(() => {
    void seriesQuery.refetch();
    void allClassesQuery.refetch();
    void previewClassesQuery.refetch();
    if (series) {
      void activityQuery.refetch();
      void levelsQuery.refetch();
      void teachersQuery.refetch();
    }
  }, [
    activityQuery,
    allClassesQuery,
    levelsQuery,
    previewClassesQuery,
    series,
    seriesQuery,
    teachersQuery,
  ]);

  const handleClassPreviewRetry = useCallback(() => {
    void previewClassesQuery.refetch();
    void teachersQuery.refetch();
  }, [previewClassesQuery, teachersQuery]);

  const handleClassesPreviewPageChange = useCallback((page: number) => {
    setClassesPreviewPage(page);
  }, []);

  const {
    bookingRule,
    isCancelled,
    metadataRows,
    moreDetailsSessionId,
    statusSummaryParts,
    totalClasses,
  } = useSeriesDetailDrawerViewModel({
    activityName: activity?.name,
    allClasses,
    levelName: level?.name,
    previewClassesCount: previewClassesQuery.data?.count,
    series,
  });

  const handleMoreDetailsClick = useCallback(() => {
    if (selectedSeriesId !== null) {
      navigate(resolveSeriesClassesPath(selectedSeriesId));
    }
  }, [navigate, resolveSeriesClassesPath, selectedSeriesId]);

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label={t("seriesDetailDrawer.closeOverlay")}
          className="fixed inset-0 z-[997] cursor-default bg-transparent"
          onClick={onClose}
        />
      ) : null}

      <DetailDrawer
        id="series-detail-drawer"
        isOpen={isOpen}
        onClose={onClose}
        className="lg:w-[540px] lg:min-w-[540px] lg:max-w-[540px]"
        actionsConfig={[
          {
            id: "series-detail-drawer-previous",
            color: "main",
            disabled: !hasPreviousSeries,
            icon: "chevron-up",
            intent: "default",
            kind: "icon-button",
            label: t("seriesDetailDrawer.previousSeries"),
            onClick: onSelectPreviousSeries,
            size: "sm",
          },
          {
            id: "series-detail-drawer-next",
            color: "main",
            disabled: !hasNextSeries,
            icon: "chevron-down",
            intent: "default",
            kind: "icon-button",
            label: t("seriesDetailDrawer.nextSeries"),
            onClick: onSelectNextSeries,
            size: "sm",
          },
        ]}
      >
        {hasShellError ? (
          <SectionErrorFallback onRetry={handleRetry} />
        ) : shouldRenderLoadingState || !series ? (
          <LoadingState />
        ) : (
          <div className="flex flex-col gap-lg">
            <SeriesDetailDrawerHeader
              isCancelled={isCancelled}
              onOpenCancelSeries={onOpenCancelSeries}
              onOpenDuplicateSeries={onOpenDuplicateSeries}
              seriesId={series.id}
              title={series.name}
            />

            <SeriesDetailMetadata rows={metadataRows} />

            <Divider orientation="horizontal" weight="extra-thin" />

            <SeriesBookingRuleSection bookingRule={bookingRule} />

            <Divider orientation="horizontal" weight="extra-thin" />

            <SeriesClassesPreview
              classesPreviewPage={classesPreviewPage}
              hasError={hasClassPreviewError}
              isRefreshing={isClassPreviewRefreshing}
              moreDetailsSessionId={moreDetailsSessionId}
              onMoreDetailsClick={handleMoreDetailsClick}
              onPageChange={handleClassesPreviewPageChange}
              onRetry={handleClassPreviewRetry}
              previewClasses={previewClasses}
              statusSummaryParts={statusSummaryParts}
              teachersById={teachersById}
              totalClasses={totalClasses}
            />
          </div>
        )}
      </DetailDrawer>
    </>
  );
};
