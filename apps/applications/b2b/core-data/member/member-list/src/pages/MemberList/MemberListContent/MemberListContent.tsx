import React, { useState, useEffect, useCallback } from "react";
import { MemberTable } from "#src/components/MemberTable";
import { fetchMemberListPage, type Member } from "#src/store-api-pkg";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";
import { MemberArchiveModal } from "./MemberArchiveModal";

type MemberListContentProps = {
  hasActiveFilters?: boolean;
  onAddMemberClick?: () => void;
  onClearFiltersClick?: () => void;
};

export const MemberListContent: React.FC<MemberListContentProps> = ({
  hasActiveFilters = false,
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
    });
    setMemberList(data.results);
    setTotalItems(data.count);
    setIsLoading(false);
  }, [currentPage, currentPageSize]);

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
        hasActiveFilters={hasActiveFilters}
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
