import React, { memo, useEffect, useState } from "react";

import {
  MemberTable,
  type TableRequiredPermissions,
} from "#src/components/MemberTable";
import { useFetchMembers } from "#src/hooks/useFetchMembers";
import type { FilterParams } from "#src/hooks/useFilterMembers";

import { MemberArchiveModal } from "./MemberArchiveModal";

type MemberListContentProps = {
  activeFilters: FilterParams;
  onAddMemberClick?: () => void;
  onClearFiltersClick?: () => void;
  permissions: TableRequiredPermissions;
};

const MemberListContentInternal: React.FC<MemberListContentProps> = ({
  activeFilters,
  onAddMemberClick,
  onClearFiltersClick,
  permissions,
}) => {
  // ----- Pagination settings -----

  const { fetchMemberPage, isLoading, memberList, paginationParams } =
    useFetchMembers({ archived: false, activeFilters });

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
        permissions={permissions}
      />
      {!!memberToArchive && permissions.archive && (
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
