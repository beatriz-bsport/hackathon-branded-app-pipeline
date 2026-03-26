import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Session,
  type ToggleWaitingListFreezeParams,
  sessionKeys,
  toggleWaitingListFreezeAPI,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const toggleWaitingListFreeze = toggleWaitingListFreezeAPI.bind(null, fetch);

interface ToggleWaitingListFreezeVariables {
  sessionId: number;
  params: ToggleWaitingListFreezeParams;
}

export const useToggleWaitingListFreeze = () => {
  const queryClient = useQueryClient();

  return useMutation<Session, Error, ToggleWaitingListFreezeVariables>({
    mutationFn: ({ sessionId, params }) =>
      toggleWaitingListFreeze(sessionId, params),
    onSuccess: ({ id: sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      });
    },
  });
};
