import { toast } from "@bsport/kaizen-primitive-core";
import { duplicateGiftcardAction } from "@bsport/store-buyables-giftcard";
import { useAsync } from "@bsport/use-async";

import { useGiftcardNavigation } from "#src/hooks/useGiftcardNavigation";
import { useToasts } from "#src/hooks/useToasts";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

/**
 * Hook to create a complete handleDuplicate function that handles refresh callbacks and undo action
 */
export const useDuplicateGiftcard = ({
  fetchGiftcards,
  handleCloseModal,
}: {
  fetchGiftcards: () => void;
  handleCloseModal: () => void;
}) => {
  // Retrieve generic toast, navigation and translations
  const { handleActionFailed } = useToasts();
  const { navigateToGiftcardDetails } = useGiftcardNavigation();
  const { t } = useTranslation("common");

  // ----- Perform action -----

  const duplicateGiftcard = async ({ giftcardId }: { giftcardId: number }) => {
    return duplicateGiftcardAction(fetch, { id: giftcardId });
  };

  const [{ isLoading }, handleDuplicate] = useAsync<typeof duplicateGiftcard>({
    asyncFn: duplicateGiftcard,
    onSuccess: ({ value: giftcardCopy }) => {
      fetchGiftcards();
      toast({
        status: "default",
        icon: "copy-03",
        title: t("toasts.successMessages.duplicateGiftcard"),
        ...(giftcardCopy && "id" in giftcardCopy
          ? {
              buttonLabel: t("toasts.actions.open"),
              onButtonClick: () => {
                navigateToGiftcardDetails(giftcardCopy.id);
              },
            }
          : {}),
      });
      handleCloseModal();
    },
    onFailure: () => {
      handleActionFailed(t("toasts.errorMessages.duplicateGiftcard"));
      handleCloseModal();
    },
    dependencies: [handleActionFailed, fetchGiftcards],
  });

  return {
    isLoading,
    handleDuplicate,
  };
};
