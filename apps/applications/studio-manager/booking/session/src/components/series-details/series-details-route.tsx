import type { FC, ReactNode } from "react";
import { Navigate, useParams } from "react-router";

import type { Session } from "@bsport/api-book";
import { useLoadingState } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { DetailsFetchError } from "#src/components/session-details/details-fetch-error";
import { DetailsLoadingPage } from "#src/components/session-details/details-loading-page";
import { useSeriesDetailsQuery } from "#src/hooks/series/use-series-details-query";
import type { Series } from "#src/types";
import { ABSOLUTE_ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export type SeriesDetailsRouteData = {
  classes: Session[];
  series: Series;
};

type SeriesDetailsRouteProps = {
  children: (data: SeriesDetailsRouteData) => ReactNode;
};

const SeriesDetailsRouteContent: FC<SeriesDetailsRouteProps> = ({
  children,
}) => {
  const { t } = useTranslation("series");

  const { seriesId } = useParams<{ seriesId: string }>();
  const parsedSeriesId = Number(seriesId);
  const isValidSeriesId =
    Number.isInteger(parsedSeriesId) && parsedSeriesId > 0;

  const { classes, error, isLoading, series } = useSeriesDetailsQuery(
    isValidSeriesId ? parsedSeriesId : null,
  );

  const { LoadingState, shouldRenderLoadingState } = useLoadingState({
    isLoading,
    message: t("loading"),
  });

  if (!isValidSeriesId) {
    return <Navigate to={ABSOLUTE_ROUTES.SERIES_LIST} replace />;
  }

  if (shouldRenderLoadingState) {
    return <LoadingState />;
  }

  if (error) {
    throw error;
  }

  if (!series) {
    return <Navigate to={ABSOLUTE_ROUTES.SERIES_LIST} replace />;
  }

  return <>{children({ classes, series })}</>;
};

export const SeriesDetailsRoute: FC<SeriesDetailsRouteProps> = ({
  children,
}) => {
  return (
    <QueryBoundary
      loadingFallback={<DetailsLoadingPage />}
      errorFallback={(props) => <DetailsFetchError {...props} />}
    >
      <SeriesDetailsRouteContent>{children}</SeriesDetailsRouteContent>
    </QueryBoundary>
  );
};
