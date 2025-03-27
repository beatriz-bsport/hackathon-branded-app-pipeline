import React, { useCallback, useEffect, useState } from "react";

import { toast } from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { MemberTable } from "#src/components/MemberTable";
import {
  type Member,
  fetchMemberListPage as apiFetchMemberListPage,
  archiveMember,
  restoreMember,
} from "#src/store-api-pkg";
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
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({ shouldReplace: false });
  const [memberList, setMemberList] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  // ----- Handlers -----

  const fetchMemberListPage = useCallback(async () => {
    setIsLoading(true);
    const data = await apiFetchMemberListPage({
      page_size: currentPageSize,
      page: currentPage,
      exclude_archived: true,
    });
    setMemberList(data.results);
    setTotalItems(data.count);
    setIsLoading(false);
  }, [currentPage, currentPageSize]);

  const handleArchive = useCallback(
    async ({ memberId }: { memberId: number }) => {
      // Archive the member
      await archiveMember({ memberId });

      // Once executed, refresh the list
      await fetchMemberListPage();
    },
    [archiveMember, fetchMemberListPage],
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
      await restoreMember({ memberId });

      // Once executed, refresh the list
      fetchMemberListPage();

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
    [restoreMember, fetchMemberListPage, handleArchive],
  );

  // ----- Load on mount -----

  useEffect(() => {
    fetchMemberListPage();
  }, [fetchMemberListPage]);

  return (
    <>
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
    </>
  );
};
