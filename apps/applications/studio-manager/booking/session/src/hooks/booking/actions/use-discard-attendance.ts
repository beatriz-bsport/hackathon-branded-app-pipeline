import { useMutation, useQueryClient } from "@tanstack/react-query";

import { bookingKeys, sessionKeys, setAttendanceAPI } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const setAttendance = setAttendanceAPI.bind(null, fetch);

interface DiscardAttendanceVariables {
  bookingId: number;
  sessionId: number;
}

export const useDiscardAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DiscardAttendanceVariables>({
    mutationFn: ({ bookingId }) => setAttendance(bookingId, false),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      });
    },
  });
};
