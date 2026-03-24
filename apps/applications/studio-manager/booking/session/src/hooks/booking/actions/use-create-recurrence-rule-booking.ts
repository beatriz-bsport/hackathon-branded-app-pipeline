import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CreateRecurrenceRuleBookingParams,
  type RecurrenceRuleBooking,
  bookingKeys,
  createRecurrenceRuleBookingAPI,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const createRecurrenceRuleBooking = createRecurrenceRuleBookingAPI.bind(
  null,
  fetch,
);

export const useCreateRecurrenceRuleBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RecurrenceRuleBooking,
    Error,
    CreateRecurrenceRuleBookingParams
  >({
    mutationFn: (params) => createRecurrenceRuleBooking(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bookingKeys.recurrenceRulesScope(),
      });
    },
  });
};
