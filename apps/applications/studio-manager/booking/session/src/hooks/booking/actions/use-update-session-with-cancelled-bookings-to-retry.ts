import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type UpdateSessionWithCancelledBookingsToRetryParams,
  bookingKeys,
  updateSessionWithCancelledBookingsToRetryAPI,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const updateSessionWithCancelledBookingsToRetry =
  updateSessionWithCancelledBookingsToRetryAPI.bind(null, fetch);

interface UpdateSessionWithCancelledBookingsToRetryVariables {
  recurrenceRuleId: number;
  params: UpdateSessionWithCancelledBookingsToRetryParams;
}

export const useUpdateSessionWithCancelledBookingsToRetry = () => {
  const queryClient = useQueryClient();

  return useMutation<
    number,
    Error,
    UpdateSessionWithCancelledBookingsToRetryVariables
  >({
    mutationFn: ({ recurrenceRuleId, params }) =>
      updateSessionWithCancelledBookingsToRetry(recurrenceRuleId, params),
    onSuccess: (recurrenceRuleId) => {
      queryClient.invalidateQueries({
        queryKey: bookingKeys.sessionWithCancelledBookings(recurrenceRuleId),
      });
    },
  });
};
