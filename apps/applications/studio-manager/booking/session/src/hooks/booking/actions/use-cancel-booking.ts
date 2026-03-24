import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type Booking,
  type CancelBookingParams,
  bookingKeys,
  cancelBookingAPI,
  sessionKeys,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const cancelBooking = cancelBookingAPI.bind(null, fetch);

export type CancelBookingVariables = {
  bookingId: number;
  params?: CancelBookingParams;
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, CancelBookingVariables>({
    mutationFn: ({ bookingId, params }) => cancelBooking(bookingId, params),
    onSuccess: ({ offer: sessionId }) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      });
    },
  });
};
