import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteHasPhoneFilter } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseDeleteHasPhoneFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useDeleteHasPhoneFilterMutation = (
  smartlistId: string,
  params: UseDeleteHasPhoneFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (filterId: number) => deleteHasPhoneFilter(fetch, filterId),
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
    deleteHasPhoneFilterMutate: mutation.mutate,
    deleteHasPhoneFilter: mutation.mutateAsync,
  };
};
