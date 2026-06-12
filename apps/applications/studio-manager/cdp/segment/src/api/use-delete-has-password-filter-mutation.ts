import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteHasPasswordFilterMutationOptions } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseDeleteHasPasswordFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useDeleteHasPasswordFilterMutation = (
  smartlistId: string,
  params: UseDeleteHasPasswordFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...deleteHasPasswordFilterMutationOptions(fetch),
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
    deleteHasPasswordFilterMutate: mutation.mutate,
    deleteHasPasswordFilter: mutation.mutateAsync,
  };
};
