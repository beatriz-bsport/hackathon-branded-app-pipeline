import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteBookingMilestoneFilter } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { showFilterDeleteSuccessToast } from "../utils/filter-delete-success-toast";
import { smartlistQueryKeys } from "./api";

type UseDeleteBookingMilestoneFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Deletes a smartlist booking milestone filter row and invalidates `get_filters` cache.
 */
export const useDeleteBookingMilestoneFilterMutation = (
  smartlistId: string,
  params: UseDeleteBookingMilestoneFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (filterId: number) =>
      deleteBookingMilestoneFilter(fetch, filterId),
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
    deleteBookingMilestoneFilterMutate: mutation.mutate,
    deleteBookingMilestoneFilter: mutation.mutateAsync,
  };
};
