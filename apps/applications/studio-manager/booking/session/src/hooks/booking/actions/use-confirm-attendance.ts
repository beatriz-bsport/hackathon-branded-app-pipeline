import { useMutation, useQueryClient } from "@tanstack/react-query";

import { bookingKeys, sessionKeys, setAttendanceAPI } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const setAttendance = setAttendanceAPI.bind(null, fetch);

interface ConfirmAttendanceVariables {
  bookingId: number;
  sessionId: number;
}

export const useConfirmAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ConfirmAttendanceVariables>({
    mutationFn: ({ bookingId }) => setAttendance(bookingId, true),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      });
    },
  });
};
