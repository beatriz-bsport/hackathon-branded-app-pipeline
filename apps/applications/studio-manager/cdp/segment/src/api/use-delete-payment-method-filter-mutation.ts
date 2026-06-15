import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePaymentMethodFilterMutationOptions } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseDeletePaymentMethodFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Deletes a smartlist payment method filter and invalidates `get_filters` cache.
 */
export const useDeletePaymentMethodFilterMutation = (
  smartlistId: string,
  params: UseDeletePaymentMethodFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...deletePaymentMethodFilterMutationOptions(fetch),
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
    deletePaymentMethodFilterMutate: mutation.mutate,
    deletePaymentMethodFilter: mutation.mutateAsync,
  };
};
