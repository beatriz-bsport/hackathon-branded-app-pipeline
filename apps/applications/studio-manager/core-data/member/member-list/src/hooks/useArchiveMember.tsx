import { toast } from "@bsport/kaizen-primitive-core";
import {
  archiveMemberAction,
  restoreMemberAction,
} from "@bsport/store-core-data-member";
import { useAsync } from "@bsport/use-async";

import { useGenericToasts } from "#src/hooks/useGenericToasts";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

/**
 * Hook to create a complete handleArchive function that handles refresh callbacks and undo action
 */
export const useArchiveMember = ({
  fetchMembers,
  handleCloseModal,
}: {
  fetchMembers: () => void;
  handleCloseModal: () => void;
}) => {
  // Retrieve generic toasts and translations
  const { handleActionFailed, handleActionUndone } = useGenericToasts();
  const { t } = useTranslation("common");

  // ----- Undo action -----

  const restoreMember = async (id: number) => {
    return restoreMemberAction(fetch, { memberId: id });
  };

  const [{ isLoading: isLoadingUndo }, handleUndo] = useAsync<
    typeof restoreMember
  >({
    asyncFn: restoreMember,
    onSuccess: () => {
      fetchMembers();
      handleActionUndone();
    },
    onFailure: () => {
      handleActionFailed(t("toasts.messageUndone.error"));
    },
    dependencies: [handleActionFailed, handleActionUndone, fetchMembers],
  });

  // ----- Perform action -----

  const archiveMember = async ({ memberId }: { memberId: number }) => {
    return archiveMemberAction(fetch, { memberId });
  };

  const [{ isLoading: isLoadingArchive }, handleArchive] = useAsync<
    typeof archiveMember
  >({
    asyncFn: archiveMember,
    onSuccess: ({ args: [{ memberId }] }) => {
      fetchMembers();
      toast({
        status: "default",
        icon: "archive",
        title: t("toasts.messageArchived.success"),
        buttonLabel: t("toasts.actions.undo"),
        onButtonClick: () => handleUndo(memberId),
      });
      handleCloseModal();
    },
    onFailure: () => {
      handleActionFailed(t("toasts.messageArchived.error"));
      handleCloseModal();
    },
    dependencies: [handleActionFailed, handleActionUndone, fetchMembers],
  });

  return {
    isLoading: isLoadingArchive || isLoadingUndo,
    handleArchive,
  };
};
