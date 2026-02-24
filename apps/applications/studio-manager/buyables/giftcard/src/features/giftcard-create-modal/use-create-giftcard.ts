import { toast } from "@bsport/kaizen-primitive-core";
import {
  type Giftcard,
  createGiftcardAction,
} from "@bsport/store-buyables-giftcard";
import { useAsync } from "@bsport/use-async";

import { xhr } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const createGiftcardBound = createGiftcardAction.bind(null, xhr);

export const useCreateGiftcard = ({
  onSuccess,
}: {
  onSuccess: (value: Giftcard) => void;
}) => {
  const { t } = useTranslation("giftcard-details");

  const [{ isLoading }, createGiftcard] = useAsync<typeof createGiftcardBound>({
    asyncFn: createGiftcardBound,
    onSuccess: ({ value }) => {
      onSuccess(value);
      toast({
        status: "positive",
        icon: "save",
        title: t("createModal.submitResponse.success"),
        buttonIcon: "x-close",
      });
    },
    onFailure: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("createModal.submitResponse.error"),
        buttonIcon: "x-close",
      });
    },
  });

  return {
    isLoading,
    createGiftcard,
  };
};
