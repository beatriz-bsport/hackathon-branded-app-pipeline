import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type PaymentMethodFilter,
  upsertPaymentMethodFilterMutationOptions,
} from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseUpsertPaymentMethodFilterMutationParams = {
  onSuccess?: (data: PaymentMethodFilter) => void;
  onError?: (error: Error) => void;
};

/**
 * Creates or partially updates a smartlist payment method filter and invalidates `get_filters` cache.
 */
export const useUpsertPaymentMethodFilterMutation = (
  smartlistId: string,
  params: UseUpsertPaymentMethodFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...upsertPaymentMethodFilterMutationOptions(fetch),
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
    upsertPaymentMethodFilterMutate: mutation.mutate,
    upsertPaymentMethodFilter: mutation.mutateAsync,
  };
};
