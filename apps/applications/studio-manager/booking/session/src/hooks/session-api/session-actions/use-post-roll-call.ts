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
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      });
    },
  });
};
