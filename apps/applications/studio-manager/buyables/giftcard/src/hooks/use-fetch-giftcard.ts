import { useEffect } from "react";

import { toast } from "@bsport/kaizen-primitive-core";
import {
  type Giftcard,
  fetchGiftcardAction,
} from "@bsport/store-buyables-giftcard";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const fetchGiftcardBound = fetchGiftcardAction.bind(null, fetch);

export const useFetchGiftcard = ({
  id,
  onSuccess,
  onError,
}: {
  id?: number;
  onSuccess?: (giftcard: Giftcard) => void;
  onError?: () => void;
}) => {
  const { t } = useTranslation("giftcard-details");

  const [{ isLoading, error }, fetchGiftcard] = useAsync<
    typeof fetchGiftcardBound
  >({
    asyncFn: fetchGiftcardBound,
    onSuccess: ({ value }) => {
      onSuccess?.(value);
    },
    onFailure: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("details.canNotFindGiftcard.title"),
        buttonIcon: "x-close",
      });
      onError?.();
    },
  });

  useEffect(() => {
    if (id) {
      fetchGiftcard({ id });
    }
  }, [id, fetchGiftcard]);

  return {
    isLoading,
    fetchGiftcard,
    error,
  };
};
