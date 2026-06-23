import { QueryBoundary } from "#src/components/QueryBoundary/QueryBoundary";

import type {
  CompanyScopedSegmentFilterCardProps,
  RenderFilterParams,
  SegmentFilterCardProps,
  SegmentFilterRenderContext,
} from "./types";

/**
 * Renders a filter card that only needs smartlist context.
 */
export const renderStandardFilterCard = <TValue,>(
  Card: React.ComponentType<SegmentFilterCardProps<TValue>>,
  smartlistId: string,
  params: RenderFilterParams<TValue>,
) => (
  <Card
    key={params.key}
    smartlistId={smartlistId}
    filterValue={params.value}
    cleanDraftComponent={params.cleanDraftComponent}
  />
);

/**
 * Renders a filter card wrapped in a query boundary with a loading skeleton.
 */
export const renderQueryBoundaryFilterCard = <TValue,>(
  Skeleton: React.ComponentType,
  Card: React.ComponentType<SegmentFilterCardProps<TValue>>,
  smartlistId: string,
  params: RenderFilterParams<TValue>,
) => (
  <QueryBoundary key={params.key} loadingFallback={<Skeleton />}>
    <Card
      smartlistId={smartlistId}
      filterValue={params.value}
      cleanDraftComponent={params.cleanDraftComponent}
    />
  </QueryBoundary>
);

/**
 * Renders a company-scoped filter card when company id is available.
 */
export const renderCompanyScopedFilterCard = <TValue,>(
  Skeleton: React.ComponentType,
  Card: React.ComponentType<CompanyScopedSegmentFilterCardProps<TValue>>,
  context: SegmentFilterRenderContext,
  params: RenderFilterParams<TValue>,
) => {
  const { companyId, smartlistId } = context;

  if (typeof companyId !== "number" || companyId <= 0) {
    return <Skeleton key={params.key} />;
  }

  return (
    <QueryBoundary key={params.key} loadingFallback={<Skeleton />}>
      <Card
        smartlistId={smartlistId}
        companyId={companyId}
        filterValue={params.value}
        cleanDraftComponent={params.cleanDraftComponent}
      />
    </QueryBoundary>
  );
};
