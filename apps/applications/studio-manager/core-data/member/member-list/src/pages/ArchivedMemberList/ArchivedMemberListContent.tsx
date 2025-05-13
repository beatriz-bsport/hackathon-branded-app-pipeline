import React, { useCallback, useEffect } from "react";

import { toast } from "@bsport/kaizen-primitive-core";
import {
  archiveMemberAction,
  fetchMembersAction,
  restoreMemberAction,
  selectCount,
  selectMembers,
  useMemberStore,
} from "@bsport/store-core-data-member";
import { useAsync } from "@bsport/use-async";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { MemberTable } from "#src/components/MemberTable";
import fetch from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type ArchivedMemberListContentProps = {
  hasActiveFilters?: boolean;
  onAddMemberClick?: () => void;
  onClearFiltersClick?: () => void;
};

export const ArchivedMemberListContent: React.FC<
  ArchivedMemberListContentProps
> = ({ hasActiveFilters = false, onAddMemberClick, onClearFiltersClick }) => {
  const { t } = useTranslation("common");

  // ----- State management -----

  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({ shouldReplace: false });

  const memberList = useMemberStore(selectMembers);
  const totalItems = useMemberStore(selectCount);

  // ----- Handlers -----

  const _fetchMemberPage = useCallback(async () => {
    return fetchMembersAction(fetch, {
      page_size: currentPageSize,
      page: currentPage,
      exclude_archived: false,
    });
  }, [currentPage, currentPageSize]);

  const [{ isLoading }, fetchMemberPage] = useAsync<typeof _fetchMemberPage>({
    asyncFn: _fetchMemberPage,
    dependencies: [_fetchMemberPage],
    onFailure: console.error,
  });

  const handleArchive = useCallback(
    async ({ memberId }: { memberId: number }) => {
      // Archive the member
      await archiveMemberAction(fetch, { memberId });

      // Once executed, refresh the list
      await fetchMemberPage();
    },
    [fetchMemberPage],
  );

  const handleRestore = useCallback(
    async ({
      memberId,
      memberName,
    }: {
      memberId: number;
      memberName: string;
    }) => {
      // Restore the member
      await restoreMemberAction(fetch, { memberId });

      // Once executed, refresh the list
      fetchMemberPage();

      // Display a toast to "undo" the action
      toast({
        status: "default",
        icon: "unarchive",
        title: t("archivedListPage.toasts.messageUnarchived", {
          name: memberName,
        }),
        buttonLabel: t("archivedListPage.toasts.actionUndo"),
        onButtonClick: () => handleArchive({ memberId }),
      });
    },
    [fetchMemberPage, handleArchive],
  );

  // ----- Load on mount -----

  useEffect(() => {
    fetchMemberPage();
  }, [fetchMemberPage]);

  return (
    <MemberTable
      memberList={memberList}
      isLoading={isLoading}
      paginationProps={{
        currentPage: currentPage,
        rowsPerPage: currentPageSize,
        totalItems: totalItems,
        onPageSettingsChange: setPageSettings,
        showRowsPerPageSelector: true,
      }}
      mode="archived"
      handleRestore={handleRestore}
      hasActiveFilters={hasActiveFilters}
      onAddMemberClick={onAddMemberClick}
      onClearFilterClick={onClearFiltersClick}
    />
  );
};
