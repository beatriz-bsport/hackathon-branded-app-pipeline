import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type NotesFilter,
  createNotesFilter,
  patchNotesFilter,
} from "@bsport/api-cdp/smartlist";

import type {
  InternalNotesFilterCreatePayload,
  InternalNotesFilterDirtyPatchPayload,
} from "#src/components/filters/internal-notes-filter/types";
import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UpsertInternalNotesFilterVariables = {
  filterId?: number;
  createPayload?: InternalNotesFilterCreatePayload;
  updatePayload?: InternalNotesFilterDirtyPatchPayload;
};

type UseUpsertInternalNotesFilterMutationParams = {
  onSuccess?: (data: NotesFilter) => void;
  onError?: (error: Error) => void;
};

export const useUpsertInternalNotesFilterMutation = (
  smartlistId: string,
  params: UseUpsertInternalNotesFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertInternalNotesFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error("Missing payload to create internal notes filter.");
        }
        return createNotesFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update internal notes filter.");
      }

      return patchNotesFilter(fetch, filterId, updatePayload);
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: smartlistQueryKeys.smartlistKeys.filters(smartlistId),
      });
      params.onSuccess?.(data);
    },
    onError: (error) => params.onError?.(error),
  });

  return {
    isLoading: mutation.isPending,
    upsertInternalNotesFilterMutate: mutation.mutate,
    upsertInternalNotesFilter: mutation.mutateAsync,
  };
};
