import { useEffect, useEffectEvent, useRef } from "react";
import { useOutletContext } from "react-router";

import { SMARTLIST_MEMBERS_DEFAULT_PAGE_SIZE } from "@bsport/api-cdp/smartlist";
import { useMatchMedia } from "@bsport/kaizen-primitive-core";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import { useSmartlistMembersQuery } from "#src/api/use-smartlist-members-query";
import { SectionErrorFallback } from "#src/components/QueryBoundary";
import { SmartlistMembersTable } from "#src/components/smartlist-members-table/smartlist-members-table";
import type { DetailsPageOutletContext } from "#src/pages/DetailsPage/details-page-outlet-context";
import { useTranslation } from "#src/utils/i18n";

import { formatSmartlistMembersTableRows } from "../smartlist-members-table/format-smartlist-members-table-rows";
import { useSmartlistMembersTableColumns } from "../smartlist-members-table/use-smartlist-members-table-columns";

type SmartlistMembersListProps = {
  smartlistId: string;
};

/**
 * Loads smartlist members and renders the members table with loading and error fallbacks.
 */
export const SmartlistMembersList = ({
  smartlistId,
}: SmartlistMembersListProps) => {
  const { t } = useTranslation("details");
  const isMobile = !useMatchMedia("md");
  const { openParameterDrawer } = useOutletContext<DetailsPageOutletContext>();
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({
      defaultValues: {
        page: DEFAULT_PAGE,
        page_size: SMARTLIST_MEMBERS_DEFAULT_PAGE_SIZE,
      },
    });
  const previousSmartlistIdRef = useRef(smartlistId);

  const {
    data: membersPage,
    isPending,
    isError,
    refetch,
  } = useSmartlistMembersQuery({
    smartlistId,
    page: currentPage,
    page_size: currentPageSize,
  });

  const totalPages = membersPage
    ? Math.max(1, Math.ceil(membersPage.count / currentPageSize))
    : currentPage;
  const safeCurrentPage = membersPage
    ? Math.min(currentPage, totalPages)
    : currentPage;
  const tableRows = formatSmartlistMembersTableRows(membersPage?.results ?? []);
  const tableColumns = useSmartlistMembersTableColumns(isMobile);

  const resetPageOnSmartlistChange = useEffectEvent(() => {
    if (currentPage !== DEFAULT_PAGE) {
      setPageSettings(DEFAULT_PAGE, currentPageSize);
    }
  });

  useEffect(() => {
    if (previousSmartlistIdRef.current !== smartlistId) {
      previousSmartlistIdRef.current = smartlistId;
      resetPageOnSmartlistChange();
    }
  }, [smartlistId]);

  const updatePageWhenOutOfRange = useEffectEvent(() => {
    if (safeCurrentPage !== currentPage) {
      setPageSettings(safeCurrentPage, currentPageSize);
    }
  });

  useEffect(() => {
    updatePageWhenOutOfRange();
  }, [currentPage, safeCurrentPage]);

  if (isError) {
    return (
      <SectionErrorFallback
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <SmartlistMembersTable
        columns={tableColumns}
        rows={tableRows}
        isLoading={isPending}
        hideHeader={isMobile}
        paginationProps={{
          currentPage: safeCurrentPage,
          rowsPerPage: currentPageSize,
          totalItems: membersPage?.count ?? 0,
          onPageSettingsChange: setPageSettings,
          disabled: isPending,
        }}
        emptyStateProps={{
          isEmpty: !isPending && (membersPage?.count ?? 0) === 0,
          emptyConfig: {
            title: t("membersTable.emptyState.title"),
            subtitle: t("membersTable.emptyState.subtitle"),
            secondaryButtonConfig: {
              label: t("membersTable.emptyState.updateFilters"),
              iconLeft: "filter-lines",
              onClick: openParameterDrawer,
            },
          },
        }}
      />
    </div>
  );
};
