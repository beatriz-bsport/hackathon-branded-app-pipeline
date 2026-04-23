import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type PrivateBooking,
  type SwapPassParams,
  privateBookingKeys,
  swapPassAPI,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const swapPass = swapPassAPI.bind(null, fetch);

export type SwapPassVariables = {
  id: number;
  params: SwapPassParams;
};

export const useSwapPass = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionList");

  return useMutation<PrivateBooking, Error, SwapPassVariables>({
    mutationKey: ["swap-pass"],
    mutationFn: ({ id, params }) => swapPass(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: privateBookingKeys.listScope(),
      });
      toast({
        status: "default",
        description: t("swapPassModal.successMessage"),
        icon: "refresh-cw-04",
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("swapPassModal.errorMessage"),
      });
    },
  });
};
