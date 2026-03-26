import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type DeleteRecurrenceRuleBookingParams,
  type RecurrenceRuleBooking,
  bookingKeys,
  deleteRecurrenceRuleBookingAPI,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const deleteRecurrenceRuleBooking = deleteRecurrenceRuleBookingAPI.bind(
  null,
  fetch,
);

interface DeleteRecurrenceRuleBookingVariables {
  id: number;
  params?: DeleteRecurrenceRuleBookingParams;
}

export const useDeleteRecurrenceRuleBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RecurrenceRuleBooking,
    Error,
    DeleteRecurrenceRuleBookingVariables
  >({
    mutationFn: ({ id, params }) => deleteRecurrenceRuleBooking(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bookingKeys.recurrenceRulesScope(),
      });
    },
  });
};
