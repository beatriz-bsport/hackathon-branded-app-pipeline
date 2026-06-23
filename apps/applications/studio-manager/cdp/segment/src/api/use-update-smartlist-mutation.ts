import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type Smartlist,
  updateSmartlistMutationOptions,
} from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseUpdateSmartlistMutationParams = {
  onSuccess?: (data: Smartlist) => void;
  onError?: (error: Error) => void;
};

/**
 * PATCHes a smartlist on the CDP group resource and invalidates its detail cache.
 */
export const useUpdateSmartlistMutation = ({
  onSuccess,
  onError,
}: UseUpdateSmartlistMutationParams) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...updateSmartlistMutationOptions(fetch),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: smartlistQueryKeys.smartlistKeys.details(),
      });
      onSuccess?.(data);
    },
    onError: (error) => onError?.(error),
  });

  return {
    isLoading: mutation.isPending,
    updateSmartlistMutate: mutation.mutate,
    updateSmartlist: mutation.mutateAsync,
  };
};
