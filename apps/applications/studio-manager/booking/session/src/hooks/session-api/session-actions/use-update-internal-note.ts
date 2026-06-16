import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type Session,
  type UpdateInternalNoteParams,
  sessionKeys,
  updateInternalNoteAPI,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const updateInternalNote = updateInternalNoteAPI.bind(null, fetch);

interface UpdateInternalNoteVariables {
  sessionId: number;
  params: UpdateInternalNoteParams;
}

interface OnMutateResult {
  previousSession: Session | undefined;
}

export const useUpdateInternalNote = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Session,
    Error,
    UpdateInternalNoteVariables,
    OnMutateResult
  >({
    mutationFn: ({ sessionId, params }) =>
      updateInternalNote(sessionId, params),
    onMutate: async ({ sessionId, params }) => {
      const queryKey = sessionKeys.detail(sessionId);
      await queryClient.cancelQueries({ queryKey });
      const previousSession = queryClient.getQueryData<Session>(queryKey);
      if (previousSession) {
        queryClient.setQueryData<Session>(queryKey, {
          ...previousSession,
          internal_note: params.internal_note,
        });
      }
      return { previousSession };
    },
    onError: (_err, { sessionId }, onMutateResult) => {
      if (onMutateResult?.previousSession) {
        queryClient.setQueryData(
          sessionKeys.detail(sessionId),
          onMutateResult.previousSession,
        );
      }
    },
    onSettled: (_data, _err, { sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      });
    },
  });
};
