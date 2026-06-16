import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CreateMemberDateJoinedFilterPayload,
  type MemberDateJoinedFilter,
  type UpdateMemberDateJoinedFilterPayload,
  createMemberDateJoinedFilter,
  patchMemberDateJoinedFilter,
} from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UpsertMemberDateJoinedFilterVariables = {
  filterId?: number;
  createPayload?: CreateMemberDateJoinedFilterPayload;
  updatePayload?: UpdateMemberDateJoinedFilterPayload;
};

type UseUpsertMemberDateJoinedFilterMutationParams = {
  onSuccess?: (data: MemberDateJoinedFilter) => void;
  onError?: (error: Error) => void;
};

export const useUpsertMemberDateJoinedFilterMutation = (
  smartlistId: string,
  params: UseUpsertMemberDateJoinedFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertMemberDateJoinedFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error(
            "Missing payload to create member sign-up date filter.",
          );
        }
        return createMemberDateJoinedFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error(
          "Missing payload to update member sign-up date filter.",
        );
      }

      return patchMemberDateJoinedFilter(fetch, filterId, updatePayload);
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
    upsertMemberDateJoinedFilterMutate: mutation.mutate,
    upsertMemberDateJoinedFilter: mutation.mutateAsync,
  };
};
