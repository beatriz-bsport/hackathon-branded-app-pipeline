import React, { memo, useEffect, useState } from "react";

import { MemberTable } from "#src/components/MemberTable";
import { useFetchPaginatedList } from "#src/hooks/useFetchPaginatedList";
import type { FilterParams } from "#src/hooks/useMemberFilters";

import { MemberArchiveModal } from "./MemberArchiveModal";

type MemberListContentProps = {
  activeFilters: FilterParams;
  onAddMemberClick?: () => void;
  onClearFiltersClick?: () => void;
};

const MemberListContentInternal: React.FC<MemberListContentProps> = ({
  activeFilters,
  onAddMemberClick,
  onClearFiltersClick,
}) => {
  // ----- Pagination settings -----

  const { fetchMemberPage, isLoading, memberList, paginationParams } =
    useFetchPaginatedList({ archived: false, activeFilters });

  // ----- State -----

  // Manage the selected member to archive
  const [memberToArchive, setMemberToArchive] = useState<{
    memberId: number;
    memberName: string;
  } | null>(null);

  // ----- Handlers -----

  const handleCloseArchiveModal = () => setMemberToArchive(null);

  // ----- Load data -----

  useEffect(() => {
    fetchMemberPage();
  }, [fetchMemberPage]);

  return (
    <>
      <MemberTable
        memberList={memberList}
        isLoading={isLoading}
        paginationProps={paginationParams}
        mode="active"
        handleArchive={setMemberToArchive}
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

export const MemberListContent = memo(MemberListContentInternal);
