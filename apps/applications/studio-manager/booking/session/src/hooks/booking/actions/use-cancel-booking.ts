import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type Booking,
  type CancelBookingParams,
  bookingKeys,
  cancelBookingAPI,
  sessionKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n.js";

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
      toast({
        status: "default",
        description: t("modals.cancelBooking.confirmation"),
        icon: "x-circle-solid",
      });
    },
  });
};
