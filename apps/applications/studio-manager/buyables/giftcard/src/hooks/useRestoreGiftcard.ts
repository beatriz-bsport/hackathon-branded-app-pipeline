import { toast } from "@bsport/kaizen-primitive-core";
import {
  archiveGiftcardAction,
  restoreGiftcardAction,
} from "@bsport/store-buyables-giftcard";
import { useAsync } from "@bsport/use-async";

import { useToasts } from "#src/hooks/useToasts";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

/**
 * Hook to create a complete handleRestore function that handles refresh callbacks and undo action
 */
export const useRestoreGiftcard = ({
  fetchGiftcards,
}: {
  fetchGiftcards: () => void;
}) => {
  // Retrieve generic toasts and translations
  const { handleActionFailed, handleActionUndone } = useToasts();
  const { t } = useTranslation("common");

  // ----- Undo action -----

  const archiveGiftcard = async (id: number) => {
    return archiveGiftcardAction(fetch, { id });
  };

  const [{ isLoading: isLoadingUndo }, handleUndo] = useAsync<
    typeof archiveGiftcard
  >({
    asyncFn: archiveGiftcard,
    onSuccess: () => {
      fetchGiftcards();
      handleActionUndone();
    },
    onFailure: () => {
      handleActionFailed(t("toasts.errorMessages.undoAction"));
    },
    dependencies: [handleActionFailed, handleActionUndone, fetchGiftcards],
  });

  // ----- Perform action -----

  const restoreGiftcard = async ({ giftcardId }: { giftcardId: number }) => {
    return restoreGiftcardAction(fetch, { id: giftcardId });
  };

  const [{ isLoading: isLoadingRestore }, handleRestore] = useAsync<
    typeof restoreGiftcard
  >({
    asyncFn: restoreGiftcard,
    onSuccess: ({ args: [{ giftcardId }] }) => {
      fetchGiftcards();
      toast({
        status: "default",
        icon: "unarchive",
        title: t("toasts.successMessages.restoreGiftcard"),
        buttonLabel: t("toasts.actions.undo"),
        onButtonClick: () => handleUndo(giftcardId),
      });
    },
    onFailure: () => {
      handleActionFailed(t("toasts.errorMessages.restoreGiftcard"));
    },
    dependencies: [handleActionFailed, handleActionUndone, fetchGiftcards],
  });

  return {
    isLoading: isLoadingRestore || isLoadingUndo,
    handleRestore,
  };
};
