import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type Booking, bookingKeys, refundBookingAPI } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const refundBooking = refundBookingAPI.bind(null, fetch);

interface RefundBookingVariables {
  bookingId: number;
}

export const useRefundBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, RefundBookingVariables>({
    mutationFn: ({ bookingId }) => refundBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
};
