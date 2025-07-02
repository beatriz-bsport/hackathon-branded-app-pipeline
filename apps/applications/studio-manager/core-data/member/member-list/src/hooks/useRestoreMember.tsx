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
 * Hook to create a complete handleRestore function that handles refresh callbacks and undo action
 */
export const useRestoreMember = ({
  fetchMembers,
}: {
  fetchMembers: () => void;
}) => {
  // Retrieve generic toasts and translations
  const { handleActionFailed, handleActionUndone } = useGenericToasts();
  const { t } = useTranslation("common");

  // ----- Undo action -----

  const archiveMember = async (id: number) => {
    return archiveMemberAction(fetch, { memberId: id });
  };

  const [{ isLoading: isLoadingUndo }, handleUndo] = useAsync<
    typeof archiveMember
  >({
    asyncFn: archiveMember,
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

  const restoreMember = async ({ memberId }: { memberId: number }) => {
    return restoreMemberAction(fetch, { memberId });
  };

  const [{ isLoading: isLoadingRestore }, handleRestore] = useAsync<
    typeof restoreMember
  >({
    asyncFn: restoreMember,
    onSuccess: ({ args: [{ memberId }] }) => {
      fetchMembers();
      toast({
        status: "default",
        icon: "unarchive",
        title: t("toasts.messageRestored.success"),
        buttonLabel: t("toasts.actions.undo"),
        onButtonClick: () => handleUndo(memberId),
      });
    },
    onFailure: () => {
      handleActionFailed(t("toasts.messageRestored.error"));
    },
    dependencies: [handleActionFailed, handleActionUndone, fetchMembers],
  });

  return {
    isLoading: isLoadingRestore || isLoadingUndo,
    handleRestore,
  };
};
