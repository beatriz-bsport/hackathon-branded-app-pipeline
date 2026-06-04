import { useEffect, useEffectEvent, useRef } from "react";
import { useOutletContext } from "react-router";

import { Alert, Card, Table } from "@bsport/kaizen-primitive-core";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import { usePrebuiltSegmentDetail } from "#src/api/use-prebuilt-segment";
import { QueryBoundary } from "#src/components/QueryBoundary";
import { useTranslation } from "#src/utils/i18n";

import {
  type PrebuiltSegmentDetailOutletContext,
  PrebuiltSegmentTabLayout,
} from "./prebuilt-segment-detail-page";
import {
  usePrebuiltSegmentTableColumns,
  usePrebuiltSegmentTableRows,
} from "./prebuilt-segment-table-columns";

type PrebuiltSegmentTableSectionProps = {
  prebuiltSegmentId: PrebuiltSegmentDetailOutletContext["prebuiltSegmentId"];
};

const PrebuiltSegmentTableSection = ({
  prebuiltSegmentId,
}: PrebuiltSegmentTableSectionProps) => {
  const { t } = useTranslation("list");
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();
  const previousSegmentIdRef = useRef(prebuiltSegmentId);

  const { definition, membersPage, isLoading } = usePrebuiltSegmentDetail(
    prebuiltSegmentId,
    currentPage,
    currentPageSize,
  );
  const totalPages = membersPage
    ? Math.max(1, Math.ceil(membersPage.count / currentPageSize))
    : currentPage;
  const safeCurrentPage = membersPage
    ? Math.min(currentPage, totalPages)
    : currentPage;
  const tableRows = usePrebuiltSegmentTableRows(membersPage?.results ?? []);
  const tableColumns = usePrebuiltSegmentTableColumns(
    prebuiltSegmentId,
    definition,
  );

  const resetPageOnSegmentChange = useEffectEvent(() => {
    if (currentPage !== DEFAULT_PAGE) {
      setPageSettings(DEFAULT_PAGE, currentPageSize);
    }
  });

  useEffect(() => {
    if (previousSegmentIdRef.current !== prebuiltSegmentId) {
      previousSegmentIdRef.current = prebuiltSegmentId;
      resetPageOnSegmentChange();
    }
  }, [prebuiltSegmentId]);

  const updatePageWhenOutOfRange = useEffectEvent(() => {
    if (safeCurrentPage !== currentPage) {
      setPageSettings(safeCurrentPage, currentPageSize);
    }
  });

  useEffect(() => {
    updatePageWhenOutOfRange();
  }, [currentPage, safeCurrentPage]);

  return (
    <div className="flex flex-col gap-md w-full p-md">
      {definition?.fallback_description ? (
        <Alert status="default" type="weak" layout="banner">
          {t(`prebuilt.segments.${prebuiltSegmentId}.description`, {
            defaultValue: definition.fallback_description,
          })}
        </Alert>
      ) : null}
      <Card padding="none">
        <Table
          columns={tableColumns}
          rows={tableRows}
          rowHeight="lg"
          loadingProps={{
            isLoading,
            message: t("prebuilt.details.segment.loading"),
          }}
          emptyStateProps={{
            isEmpty: !isLoading && (membersPage?.count ?? 0) === 0,
            emptyConfig: {
              title: t("prebuilt.details.segment.emptyState.title"),
              subtitle: t("prebuilt.details.segment.emptyState.subtitle"),
            },
          }}
          paginationProps={{
            currentPage: safeCurrentPage,
            rowsPerPage: currentPageSize,
            totalItems: membersPage?.count ?? 0,
            onPageSettingsChange: setPageSettings,
          }}
        />
      </Card>
    </div>
  );
};

export const PrebuiltSegmentPage = () => {
  const { prebuiltSegmentId } =
    useOutletContext<PrebuiltSegmentDetailOutletContext>();

  return (
    <PrebuiltSegmentTabLayout
      layout="list"
      prebuiltSegmentId={prebuiltSegmentId}
    >
      <QueryBoundary>
        <PrebuiltSegmentTableSection prebuiltSegmentId={prebuiltSegmentId} />
      </QueryBoundary>
    </PrebuiltSegmentTabLayout>
  );
};

export default PrebuiltSegmentPage;
