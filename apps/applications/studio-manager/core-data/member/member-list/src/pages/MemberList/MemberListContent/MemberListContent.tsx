import React, { memo, useState } from "react";

import {
  MemberTable,
  type TableRequiredPermissions,
} from "#src/components/MemberTable";
import type { FilterParams } from "#src/hooks/useFilterMembers";
import { useLoadMembers } from "#src/hooks/useLoadMembers";

import { MemberArchiveModal } from "./MemberArchiveModal";

type MemberListContentProps = {
  activeFilters: FilterParams;
  onAddMemberClick?: () => void;
  onClearFiltersClick?: () => void;
  permissions: TableRequiredPermissions;
  searchInput: string;
};

const MemberListContentInternal: React.FC<MemberListContentProps> = ({
  activeFilters,
  onAddMemberClick,
  onClearFiltersClick,
  permissions,
  searchInput,
}) => {
  // ----- Pagination settings -----

  const { fetchMemberPage, isLoading, memberList, paginationParams } =
    useLoadMembers({ archived: false, activeFilters, searchInput });

  // ----- State -----

  // Manage the selected member to archive
  const [memberToArchive, setMemberToArchive] = useState<{
    memberId: number;
    memberName: string;
  } | null>(null);

  // ----- Handlers -----

  const handleCloseArchiveModal = () => setMemberToArchive(null);

  return (
    <>
      <MemberTable
        memberList={memberList}
        isLoading={isLoading}
        paginationProps={paginationParams}
        mode="active"
        handleArchive={setMemberToArchive}
        hasActiveFilters={
          !!activeFilters.tags_excluded || !!activeFilters.tags_included
        }
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
