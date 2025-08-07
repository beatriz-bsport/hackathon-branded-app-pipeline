import React from "react";

import { MemberTable } from "#src/components/MemberTable";
import { useLoadMembers } from "#src/hooks/useLoadMembers";
import { useMemberPermissions } from "#src/hooks/useMemberPermissions";
import { useRestoreMember } from "#src/hooks/useRestoreMember";

type ArchivedMemberListContentProps = {
  hasActiveFilters?: boolean;
  onAddMemberClick?: () => void;
  onClearFiltersClick?: () => void;
  searchInput: string;
};

export const ArchivedMemberListContent: React.FC<
  ArchivedMemberListContentProps
> = ({
  hasActiveFilters = false,
  onAddMemberClick,
  onClearFiltersClick,
  searchInput,
}) => {
  // ----- Pagination settings -----

  const { fetchMemberPage, isLoading, memberList, paginationParams } =
    useLoadMembers({ archived: true, searchInput });

  const { handleRestore } = useRestoreMember({
    fetchMembers: fetchMemberPage,
  });

  const permissions = useMemberPermissions();

  return (
    <MemberTable
      memberList={memberList}
      isLoading={isLoading}
      paginationProps={paginationParams}
      mode="archived"
      handleRestore={handleRestore}
      hasActiveFilters={hasActiveFilters}
      onAddMemberClick={onAddMemberClick}
      onClearFilterClick={onClearFiltersClick}
      permissions={permissions}
    />
  );
};
