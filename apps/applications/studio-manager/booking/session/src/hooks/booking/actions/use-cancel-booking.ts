import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type Booking,
  type CancelBookingParams,
  bookingKeys,
  cancelBookingAPI,
  sessionKeys,
  waitingListKeys,
} from "@bsport/api-book";
import { consumerPaymentPackKeys } from "@bsport/api-buyables";
import { memberKeys } from "@bsport/api-cdp/member";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const cancelBooking = cancelBookingAPI.bind(null, fetch);

export type CancelBookingVariables = {
  bookingId: number;
  params?: CancelBookingParams;
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  const { t } = useTranslation("sessionManagement");

  return useMutation<Booking, Error, CancelBookingVariables>({
    mutationFn: ({ bookingId, params }) => cancelBooking(bookingId, params),
    onSuccess: ({ offer: sessionId }) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      });
      queryClient.invalidateQueries({
        queryKey: waitingListKeys.all,
      });
      queryClient.invalidateQueries({ queryKey: consumerPaymentPackKeys.all });
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
      toast({
        status: "default",
        description: t("modals.cancelBooking.confirmation"),
        icon: "x-circle-solid",
      });
    },
  });
};
