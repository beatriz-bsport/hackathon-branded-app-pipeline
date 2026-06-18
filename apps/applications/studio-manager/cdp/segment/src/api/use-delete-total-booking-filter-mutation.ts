import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTotalBookingFilter } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { showFilterDeleteSuccessToast } from "../utils/filter-delete-success-toast";
import { smartlistQueryKeys } from "./api";

type UseDeleteTotalBookingFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useDeleteTotalBookingFilterMutation = (
  smartlistId: string,
  params: UseDeleteTotalBookingFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (filterId: number) => deleteTotalBookingFilter(fetch, filterId),
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
    deleteTotalBookingFilterMutate: mutation.mutate,
    deleteTotalBookingFilter: mutation.mutateAsync,
  };
};
