import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Booking,
  type SetSpotParams,
  bookingKeys,
  setSpotForBookingAPI,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const setSpotForBooking = setSpotForBookingAPI.bind(null, fetch);

interface SetSpotForBookingVariables {
  bookingId: number;
  params: SetSpotParams;
}

export const useSetSpotForBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, SetSpotForBookingVariables>({
    mutationFn: ({ bookingId, params }) => setSpotForBooking(bookingId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
};
