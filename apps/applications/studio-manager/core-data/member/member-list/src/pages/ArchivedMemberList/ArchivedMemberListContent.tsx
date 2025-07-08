import React, { useEffect } from "react";

import { MemberTable } from "#src/components/MemberTable";
import { useFetchMembers } from "#src/hooks/useFetchMembers";
import { useMemberPermissions } from "#src/hooks/useMemberPermissions";
import { useRestoreMember } from "#src/hooks/useRestoreMember";

type ArchivedMemberListContentProps = {
  hasActiveFilters?: boolean;
  onAddMemberClick?: () => void;
  onClearFiltersClick?: () => void;
};

export const ArchivedMemberListContent: React.FC<
  ArchivedMemberListContentProps
> = ({ hasActiveFilters = false, onAddMemberClick, onClearFiltersClick }) => {
  // ----- Pagination settings -----

  const { fetchMemberPage, isLoading, memberList, paginationParams } =
    useFetchMembers({ archived: true });

  const { handleRestore } = useRestoreMember({
    fetchMembers: fetchMemberPage,
  });

  const permissions = useMemberPermissions();

  // ----- Load on mount -----

  useEffect(() => {
    fetchMemberPage();
  }, [fetchMemberPage]);

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
