import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePaymentPackFilter } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { showFilterDeleteSuccessToast } from "../utils/filter-delete-success-toast";
import { smartlistQueryKeys } from "./api";

type UseDeletePaymentPackFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useDeletePaymentPackFilterMutation = (
  smartlistId: string,
  params: UseDeletePaymentPackFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (filterId: number) => deletePaymentPackFilter(fetch, filterId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: smartlistQueryKeys.smartlistKeys.filters(smartlistId),
      });
      showFilterDeleteSuccessToast();
      params.onSuccess?.();
    },
    onError: (error) => params.onError?.(error),
  });

  return {
    isLoading: mutation.isPending,
    deletePaymentPackFilterMutate: mutation.mutate,
    deletePaymentPackFilter: mutation.mutateAsync,
  };
};
