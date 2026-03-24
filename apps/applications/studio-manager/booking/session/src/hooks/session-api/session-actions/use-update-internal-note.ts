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

export const useUpdateInternalNote = () => {
  const queryClient = useQueryClient();

  return useMutation<Session, Error, UpdateInternalNoteVariables>({
    mutationFn: ({ sessionId, params }) =>
      updateInternalNote(sessionId, params),
    onSuccess: ({ id: sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      });
    },
  });
};
