import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type Booking,
  type SwapBookingPassParams,
  bookingKeys,
  sessionKeys,
  swapBookingPassAPI,
} from "@bsport/api-book";
import { consumerPaymentPackKeys } from "@bsport/api-buyables";
import { memberKeys } from "@bsport/api-cdp/member";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const swapBookingPass = swapBookingPassAPI.bind(null, fetch);

export type SwapBookingPassVariables = {
  bookingId: number;
  params: SwapBookingPassParams;
};

export const useSwapBookingPass = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionManagement");

  return useMutation<Booking, Error, SwapBookingPassVariables>({
    mutationFn: ({ bookingId, params }) => swapBookingPass(bookingId, params),
    onSuccess: ({ offer: sessionId }) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      });
      queryClient.invalidateQueries({
        queryKey: consumerPaymentPackKeys.all,
      });
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
      toast({
        status: "default",
        description: t("swapBookingPassModal.successMessage"),
        icon: "refresh-cw-04",
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("swapBookingPassModal.errorMessage"),
      });
    },
  });
};
