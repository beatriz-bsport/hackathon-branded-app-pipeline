import { useEffect, useEffectEvent, useRef } from "react";
import { useOutletContext } from "react-router";

import { Alert, Card, Table } from "@bsport/kaizen-primitive-core";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import { useTranslation } from "#src/utils/i18n";

import {
  type PrebuiltSegmentDetailOutletContext,
  PrebuiltSegmentTabLayout,
} from "./prebuilt-segment-detail-page";
import {
  usePrebuiltSegmentDefinition,
  usePrebuiltSegmentMembers,
} from "./prebuilt-segment-mocks";
import {
  usePrebuiltSegmentTableColumns,
  usePrebuiltSegmentTableRows,
} from "./prebuilt-segment-table-columns";

export const PrebuiltSegmentPage = () => {
  const { t } = useTranslation("list");
  const { prebuiltSegmentId } =
    useOutletContext<PrebuiltSegmentDetailOutletContext>();
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();
  const previousSegmentIdRef = useRef(prebuiltSegmentId);

  const definition = usePrebuiltSegmentDefinition(prebuiltSegmentId);
  const membersPage = usePrebuiltSegmentMembers(
    prebuiltSegmentId,
    currentPage,
    currentPageSize,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(membersPage.count / currentPageSize),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const tableRows = usePrebuiltSegmentTableRows(membersPage.results);
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
    <PrebuiltSegmentTabLayout
      layout="list"
      prebuiltSegmentId={prebuiltSegmentId}
    >
      <div className="flex flex-col gap-md w-full p-md">
        {definition.fallback_description ? (
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
              isLoading: false,
              message: t("prebuilt.details.segment.loading"),
            }}
            emptyStateProps={{
              isEmpty: membersPage.count === 0,
              emptyConfig: {
                title: t("prebuilt.details.segment.emptyState.title"),
                subtitle: t("prebuilt.details.segment.emptyState.subtitle"),
              },
            }}
            paginationProps={{
              currentPage: safeCurrentPage,
              rowsPerPage: currentPageSize,
              totalItems: membersPage.count,
              onPageSettingsChange: setPageSettings,
            }}
          />
        </Card>
      </div>
    </PrebuiltSegmentTabLayout>
  );
};

export default PrebuiltSegmentPage;
