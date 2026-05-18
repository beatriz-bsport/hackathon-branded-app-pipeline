import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type UpdateWellhubProductIdPayload,
  updateWellhubProductIdAPI,
  wellhubKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

interface UpdateWellhubProductIdVariables {
  offerId: number;
  payload: UpdateWellhubProductIdPayload;
}

export const useUpdateWellhubProductId = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionList");

  return useMutation<void, Error, UpdateWellhubProductIdVariables>({
    mutationFn: ({ offerId, payload }) =>
      updateWellhubProductIdAPI(fetch, offerId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wellhubKeys.offersMissingProductScope(),
      });
      toast({
        status: "default",
        description: t("wellhub.modal.successMessage"),
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("wellhub.modal.errorMessage"),
      });
    },
  });
};
