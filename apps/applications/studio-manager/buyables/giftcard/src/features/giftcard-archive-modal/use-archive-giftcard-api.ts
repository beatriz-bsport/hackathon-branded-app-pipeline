import { toast } from "@bsport/kaizen-primitive-core";
import {
  archiveGiftcardAction,
  restoreGiftcardAction,
} from "@bsport/store-buyables-giftcard";
import { useAsync } from "@bsport/use-async";

import { useToasts } from "#src/hooks/useToasts";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const restoreGiftcardBound = restoreGiftcardAction.bind(null, fetch);
const archiveGiftcardBound = archiveGiftcardAction.bind(null, fetch);

/**
 * Hook to create a complete handleArchive function that handles refresh callbacks and undo action
 */
export const useArchiveGiftcard = ({
  onSuccess,
  onUndoSuccess,
  onError,
  closeModal,
}: {
  onSuccess?: () => void;
  onUndoSuccess: () => void;
  onError?: () => void;
  closeModal: () => void;
}) => {
  // Retrieve generic toasts and translations
  const { handleActionFailed, handleActionUndone } = useToasts();
  const { t, i18n } = useTranslation("common");

  // ----- Undo action -----

  const [{ isLoading: isLoadingUndo }, handleUndo] = useAsync<
    typeof restoreGiftcardBound
  >({
    asyncFn: restoreGiftcardBound,
    onSuccess: () => {
      onUndoSuccess?.();
      handleActionUndone();
    },
    onFailure: () => {
      handleActionFailed(t("toasts.errorMessages.undoAction"));
    },
    dependencies: [
      handleActionFailed,
      handleActionUndone,
      onUndoSuccess,
      i18n.language,
    ],
  });

  // ----- Perform action -----

  const [{ isLoading: isLoadingArchive }, handleArchive] = useAsync<
    typeof archiveGiftcardBound
  >({
    asyncFn: archiveGiftcardBound,
    onSuccess: ({ args: [{ id }] }) => {
      onSuccess?.();
      toast({
        status: "default",
        icon: "archive",
        title: t("toasts.successMessages.archiveGiftcard"),
        buttonLabel: t("toasts.actions.undo"),
        onButtonClick: () => handleUndo({ id }),
      });
      closeModal();
    },
    onFailure: () => {
      onError?.();
      handleActionFailed(t("toasts.errorMessages.archiveGiftcard"));
      closeModal();
    },
    dependencies: [
      handleActionFailed,
      handleActionUndone,
      handleActionUndone,
      i18n.language,
      closeModal,
    ],
  });

  return {
    isLoading: isLoadingArchive || isLoadingUndo,
    handleArchive,
  };
};
