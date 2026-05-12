// DUPLICATE OF: apps/applications/studio-manager/booking/session/src/hooks/wellhub/use-update-wellhub-product-id.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type UpdateWellhubProductIdPayload,
  updateWellhubProductIdAPI,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import { WELLHUB_MISSING_OFFERS_QUERY_KEY } from "./use-fetch-offers-missing-wellhub-product";

interface Variables {
  offerId: number;
  payload: UpdateWellhubProductIdPayload;
}

export const useUpdateWellhubProductId = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("common");

  return useMutation<void, Error, Variables>({
    mutationFn: ({ offerId, payload }) =>
      updateWellhubProductIdAPI(fetch, offerId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [WELLHUB_MISSING_OFFERS_QUERY_KEY],
      });
      toast({
        status: "default",
        description: t("wellhub.productModal.successMessage"),
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("wellhub.productModal.errorMessage"),
      });
    },
  });
};
