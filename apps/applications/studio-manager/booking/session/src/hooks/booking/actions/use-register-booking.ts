import { useMutation, useQueryClient } from "@tanstack/react-query";

import { bookingKeys } from "@bsport/api-book";
import {
  type ConsumerPaymentPack,
  type RegisterBookingPayload,
  consumerPaymentPackKeys,
  registerBookingAPI,
} from "@bsport/api-buyables";
import { memberKeys } from "@bsport/api-cdp";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const registerBooking = registerBookingAPI.bind(null, fetch);

interface RegisterBookingVariables {
  consumerPaymentPackId: number;
  payload: RegisterBookingPayload;
}

export const useRegisterBooking = () => {
  const { t } = useTranslation("sessionManagement");
  const queryClient = useQueryClient();

  return useMutation<ConsumerPaymentPack, Error, RegisterBookingVariables>({
    mutationFn: ({ consumerPaymentPackId, payload }) =>
      registerBooking(consumerPaymentPackId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      queryClient.invalidateQueries({ queryKey: consumerPaymentPackKeys.all });
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
      toast({
        status: "default",
        icon: "check",
        title: t("bookingFlow.confirmation.confirmationToast"),
      });
    },
    onError: (error) => {
      console.error("Error registering booking:", error);
      toast({
        status: "critical",
        title: t("bookingFlow.confirmation.errorToast"),
      });
    },
  });
};
