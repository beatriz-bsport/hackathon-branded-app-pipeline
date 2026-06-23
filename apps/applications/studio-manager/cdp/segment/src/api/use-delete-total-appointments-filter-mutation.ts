import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePrivateBookingsFilter } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { showFilterDeleteSuccessToast } from "../utils/filter-delete-success-toast";
import { smartlistQueryKeys } from "./api";

type UseDeleteTotalAppointmentsFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Deletes a total appointments (private bookings) smartlist filter.
 */
export const useDeleteTotalAppointmentsFilterMutation = (
  smartlistId: string,
  params: UseDeleteTotalAppointmentsFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (filterId: number) =>
      deletePrivateBookingsFilter(fetch, filterId),
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
    deleteTotalAppointmentsFilterMutate: mutation.mutate,
    deleteTotalAppointmentsFilter: mutation.mutateAsync,
  };
};
