import { useMutation, useQueryClient } from "@tanstack/react-query";

import { bookingKeys } from "@bsport/api-book";
import {
  type ConsumerPaymentPack,
  type RegisterBookingPayload,
  registerBookingAPI,
} from "@bsport/api-buyables";

import { fetch } from "#src/utils/fetch";

const registerBooking = registerBookingAPI.bind(null, fetch);

interface RegisterBookingVariables {
  consumerPaymentPackId: number;
  payload: RegisterBookingPayload;
}

export const useRegisterBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<ConsumerPaymentPack, Error, RegisterBookingVariables>({
    mutationFn: ({ consumerPaymentPackId, payload }) =>
      registerBooking(consumerPaymentPackId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
};
