import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteMemberDateJoinedFilter } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseDeleteMemberDateJoinedFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useDeleteMemberDateJoinedFilterMutation = (
  smartlistId: string,
  params: UseDeleteMemberDateJoinedFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (filterId: number) =>
      deleteMemberDateJoinedFilter(fetch, filterId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: smartlistQueryKeys.smartlistKeys.filters(smartlistId),
      });
      params.onSuccess?.();
    },
    onError: (error) => params.onError?.(error),
  });

  return {
    isLoading: mutation.isPending,
    deleteMemberDateJoinedFilterMutate: mutation.mutate,
    deleteMemberDateJoinedFilter: mutation.mutateAsync,
  };
};
