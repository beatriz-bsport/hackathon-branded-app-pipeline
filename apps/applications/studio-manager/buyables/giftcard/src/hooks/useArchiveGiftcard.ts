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
 * Hook to create a complete handleArchive function that handles refresh callbacks and undo action
 */
export const useArchiveGiftcard = ({
  fetchGiftcards,
  handleCloseModal,
}: {
  fetchGiftcards: () => void;
  handleCloseModal: () => void;
}) => {
  // Retrieve generic toasts and translations
  const { handleActionFailed, handleActionUndone } = useToasts();
  const { t } = useTranslation("common");

  // ----- Undo action -----

  const restoreGiftcard = async (id: number) => {
    return restoreGiftcardAction(fetch, { id });
  };

  const [{ isLoading: isLoadingUndo }, handleUndo] = useAsync<
    typeof restoreGiftcard
  >({
    asyncFn: restoreGiftcard,
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

  const archiveGiftcard = async ({ giftcardId }: { giftcardId: number }) => {
    return archiveGiftcardAction(fetch, { id: giftcardId });
  };

  const [{ isLoading: isLoadingArchive }, handleArchive] = useAsync<
    typeof archiveGiftcard
  >({
    asyncFn: archiveGiftcard,
    onSuccess: ({ args: [{ giftcardId }] }) => {
      fetchGiftcards();
      toast({
        status: "default",
        icon: "archive",
        title: t("toasts.successMessages.archiveGiftcard"),
        buttonLabel: t("toasts.actions.undo"),
        onButtonClick: () => handleUndo(giftcardId),
      });
      handleCloseModal();
    },
    onFailure: () => {
      handleActionFailed(t("toasts.errorMessages.archiveGiftcard"));
      handleCloseModal();
    },
    dependencies: [handleActionFailed, handleActionUndone, fetchGiftcards],
  });

  return {
    isLoading: isLoadingArchive || isLoadingUndo,
    handleArchive,
  };
};
