import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isArray, isObject } from "lodash";

import {
  type Booking,
  bookingKeys,
  sessionKeys,
  setAttendanceAPI,
} from "@bsport/api-book";
import type { PaginatedResponse } from "@bsport/store-base";

import { fetch } from "#src/utils/fetch";

/**
 * Custom hook to manage the attendance status of a booking.
 * It optimistically updates the attendance status in the UI and rolls back if the API call fails.
 * Check https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates for more details on the tanstack query optimistic updates.
 */
export const useSetAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      attendance,
    }: {
      bookingId: number;
      attendance: boolean;
      sessionId: number;
    }) => setAttendanceAPI(fetch, bookingId, attendance),
    onMutate: async ({ bookingId, attendance }) => {
      await queryClient.cancelQueries({ queryKey: bookingKeys.listScope() });

      const previousAttendance = !attendance;

      queryClient.setQueriesData<PaginatedResponse<Booking>>(
        { queryKey: bookingKeys.listScope() },
        (old) => {
          // If the old data is not in the expected format, we return it as is without attempting to update it
          if (isObject(old) && isArray(old.results))
            return {
              ...old,
              results: old.results.map((booking) =>
                booking.id === bookingId ? { ...booking, attendance } : booking,
              ),
            };
          return old;
        },
      );

      return { bookingId, previousAttendance };
    },
    onError: (_err, _vars, onMutateResult) => {
      if (onMutateResult) {
        queryClient.setQueriesData<PaginatedResponse<Booking>>(
          { queryKey: bookingKeys.listScope() },
          (old) => {
            if (isObject(old) && isArray(old.results))
              return {
                ...old,
                results: old.results.map((booking) =>
                  booking.id === onMutateResult.bookingId
                    ? {
                        ...booking,
                        attendance: onMutateResult.previousAttendance,
                      }
                    : booking,
                ),
              };
            return old;
          },
        );
      }
    },
    onSettled: (_data, _error, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      });
    },
  });
};
