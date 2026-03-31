import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type RecurrenceRuleBooking,
  type UpdateRecurrenceRuleBookingParams,
  bookingKeys,
  updateRecurrenceRuleBookingAPI,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const updateRecurrenceRuleBooking = updateRecurrenceRuleBookingAPI.bind(
  null,
  fetch,
);

interface UpdateRecurrenceRuleBookingVariables {
  id: number;
  params: UpdateRecurrenceRuleBookingParams;
}

export const useUpdateRecurrenceRuleBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RecurrenceRuleBooking,
    Error,
    UpdateRecurrenceRuleBookingVariables
  >({
    mutationFn: ({ id, params }) => updateRecurrenceRuleBooking(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bookingKeys.recurrenceRulesScope(),
      });
    },
  });
};
