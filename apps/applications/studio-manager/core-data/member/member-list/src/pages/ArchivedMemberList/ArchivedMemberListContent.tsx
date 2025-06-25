import React, { useCallback, useEffect } from "react";

import { toast } from "@bsport/kaizen-primitive-core";
import {
  archiveMemberAction,
  restoreMemberAction,
} from "@bsport/store-core-data-member";

import { MemberTable } from "#src/components/MemberTable";
import { useFetchPaginatedList } from "#src/hooks/useFetchPaginatedList";
import { fetch } from "#src/utils/fetch";
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

  // ----- Pagination settings -----

  const { fetchMemberPage, isLoading, memberList, paginationParams } =
    useFetchPaginatedList({ archived: true });

  const handleArchive = useCallback(
    async ({ memberId }: { memberId: number }) => {
      // Archive the member
      const response = await archiveMemberAction(fetch, { memberId });

      const onSuccess = () => {
        // Refresh the list
        fetchMemberPage();

        // Display a toast to inform on the success
        toast({
          status: "default",
          icon: "reverse-left",
          title: t("toasts.messageUndone.success"),
          buttonIcon: "x-close",
        });
      };

      const onFailure = (error: Error) => {
        // Display a toast to inform on the failure
        toast({
          status: "critical",
          icon: "reverse-left",
          title: t("toasts.messageUndone.error"),
          buttonIcon: "x-close",
        });

        // Debugging
        console.error(error);
      };

      response.fold(onSuccess, onFailure);
    },
    [fetchMemberPage, t],
  );

  const handleRestore = useCallback(
    async ({ memberId }: { memberId: number }) => {
      // Restore the member
      const response = await restoreMemberAction(fetch, { memberId });

      const onSuccess = () => {
        // Refresh the list
        fetchMemberPage();

        // Display a toast to "undo" the action
        toast({
          status: "default",
          icon: "unarchive",
          title: t("toasts.messageRestored.success"),
          buttonLabel: t("toasts.actions.undo"),
          onButtonClick: () => handleArchive({ memberId }),
        });
      };

      const onFailure = (error: Error) => {
        // Display a toast to inform about the failure
        toast({
          status: "critical",
          icon: "unarchive",
          title: t("toasts.messageRestored.error"),
          buttonIcon: "x-close",
        });

        // Debugging
        console.error(error);
      };

      response.fold(onSuccess, onFailure);
    },
    [fetchMemberPage, handleArchive, t],
  );

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
    />
  );
};
