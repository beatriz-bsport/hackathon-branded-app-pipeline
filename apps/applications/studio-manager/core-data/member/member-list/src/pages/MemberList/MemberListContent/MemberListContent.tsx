import React, { useCallback, useEffect, useState } from "react";

import {
  fetchMembersAction,
  selectCount,
  selectMembers,
  useMemberStore,
} from "@bsport/store-core-data-member";
import { useAsync } from "@bsport/use-async";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { MemberTable } from "#src/components/MemberTable";
import type { FilterParams } from "#src/hooks/useMemberFilters";
import fetch from "#src/utils/fetch";

import { MemberArchiveModal } from "./MemberArchiveModal";

type MemberListContentProps = {
  activeFilters: FilterParams;
  onAddMemberClick?: () => void;
  onClearFiltersClick?: () => void;
};

export const MemberListContent: React.FC<MemberListContentProps> = ({
  activeFilters,
  onAddMemberClick,
  onClearFiltersClick,
}) => {
  // ----- State management -----

  // Retrieve pagination params from the URL
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({ shouldReplace: false });

  // Retrieve pagination results from the store
  const memberList = useMemberStore(selectMembers);
  const totalItems = useMemberStore(selectCount);

  // State to store the selected member to archive
  const [memberToArchive, setMemberToArchive] = useState<{
    memberId: number;
    memberName: string;
  } | null>(null);

  // ----- Handlers -----

  const _fetchMemberPage = useCallback(async () => {
    return fetchMembersAction(fetch, {
      page_size: currentPageSize,
      page: currentPage,
      exclude_archived: true,
      ...activeFilters,
    });
  }, [currentPage, currentPageSize, activeFilters]);

  const [{ isLoading }, fetchMemberPage] = useAsync<typeof _fetchMemberPage>({
    asyncFn: _fetchMemberPage,
    dependencies: [_fetchMemberPage],
    onFailure: console.error,
  });

  const handleArchive = ({
    memberId,
    memberName,
  }: {
    memberId: number;
    memberName: string;
  }) => {
    setMemberToArchive({ memberId, memberName });
  };

  const handleCloseArchiveModal = () => setMemberToArchive(null);

  // ----- Load on mount -----

  useEffect(() => {
    fetchMemberPage();
  }, [fetchMemberPage]);

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
        mode="active"
        handleArchive={handleArchive}
        hasActiveFilters={!!activeFilters}
        onAddMemberClick={onAddMemberClick}
        onClearFilterClick={onClearFiltersClick}
      />
      {!!memberToArchive && (
        <MemberArchiveModal
          memberId={memberToArchive.memberId}
          memberName={memberToArchive.memberName}
          onClose={handleCloseArchiveModal}
          refreshPageList={fetchMemberPage}
        />
      )}
    </>
  );
};
