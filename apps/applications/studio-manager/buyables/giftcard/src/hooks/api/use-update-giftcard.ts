import { toast } from "@bsport/kaizen-primitive-core";
import {
  type Giftcard,
  updateGiftcardAction,
} from "@bsport/store-buyables-giftcard";
import { useAsync } from "@bsport/use-async";

import { xhr } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const updateGiftcardBound = updateGiftcardAction.bind(null, xhr);

export const useUpdateGiftcard = ({
  onSuccess,
}: {
  onSuccess: (value: Giftcard) => void;
}) => {
  const { t } = useTranslation("giftcard-details");

  const [{ isLoading }, updateGiftcard] = useAsync<typeof updateGiftcardBound>({
    asyncFn: updateGiftcardBound,
    onSuccess: ({ value }) => {
      onSuccess(value);
      toast({
        status: "positive",
        icon: "save",
        title: t("editor.submitResponse.success"),
        buttonIcon: "x-close",
      });
    },
    onFailure: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("editor.submitResponse.error"),
        buttonIcon: "x-close",
      });
    },
  });

  return {
    isUpdating: isLoading,
    updateGiftcard,
  };
};
