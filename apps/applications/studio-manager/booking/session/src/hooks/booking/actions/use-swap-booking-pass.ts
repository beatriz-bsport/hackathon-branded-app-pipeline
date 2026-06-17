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
import { getErrorMessageFromCodes } from "#src/utils/get-error-message-from-codes";
import { useTranslation } from "#src/utils/i18n";

const swapBookingPass = swapBookingPassAPI.bind(null, fetch);

export type SwapBookingPassVariables = {
  bookingId: number;
  params: SwapBookingPassParams;
};

export const useSwapBookingPass = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionManagement");

  const CODE_MAP: Partial<Record<number, string>> = {
    5347000: t("swapBookingPassModal.errors.5347000"),
    5347001: t("swapBookingPassModal.errors.5347001"),
    5347002: t("swapBookingPassModal.errors.5347002"),
    5347003: t("swapBookingPassModal.errors.5347003"),
    5347004: t("swapBookingPassModal.errors.5347004"),
    5347005: t("swapBookingPassModal.errors.5347005"),
    5347006: t("swapBookingPassModal.errors.5347006"),
  };

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
    onError: (error) => {
      toast({
        status: "critical",
        description: getErrorMessageFromCodes(
          error,
          CODE_MAP,
          t("swapBookingPassModal.errors.generic"),
        ),
      });
    },
  });
};
