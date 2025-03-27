import React, { useCallback, useEffect, useState } from "react";

import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { MemberTable } from "#src/components/MemberTable";
import type { FilterParams } from "#src/hooks/useMemberFilters";
import { type Member, fetchMemberListPage } from "#src/store-api-pkg";

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
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({ shouldReplace: false });
  const [memberList, setMemberList] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [memberToArchive, setMemberToArchive] = useState<{
    memberId: number;
    memberName: string;
  } | null>(null);

  // ----- Handlers -----

  const fetchMemberPageList = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchMemberListPage({
      page_size: currentPageSize,
      page: currentPage,
      exclude_archived: true,
      ...activeFilters,
    });
    setMemberList(data.results);
    setTotalItems(data.count);
    setIsLoading(false);
  }, [currentPage, currentPageSize, activeFilters]);

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
    fetchMemberPageList();
  }, [fetchMemberPageList]);

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
          refreshPageList={fetchMemberPageList}
        />
      )}
    </>
  );
};
