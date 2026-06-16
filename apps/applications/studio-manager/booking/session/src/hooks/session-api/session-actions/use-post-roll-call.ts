import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postRollCallAPI, sessionKeys } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const postRollCall = postRollCallAPI.bind(null, fetch);

type PostRollCallVariables = {
  sessionId: number;
};

export const usePostRollCall = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, PostRollCallVariables>({
    mutationFn: ({ sessionId }) => postRollCall(sessionId),
    onSuccess: () => {
      // Refresh every session query (detail + lists) so the mobile card
      // reflects the validated attendance without a manual refresh (BOO-2002),
      // matching the lifecycle action hooks (cancel/restore/edit/delete/create).
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
};
