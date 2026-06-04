import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteLastBookingFilter } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseDeleteLastBookingFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useDeleteLastBookingFilterMutation = (
  smartlistId: string,
  params: UseDeleteLastBookingFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (filterId: number) => deleteLastBookingFilter(fetch, filterId),
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
    deleteLastBookingFilterMutate: mutation.mutate,
    deleteLastBookingFilter: mutation.mutateAsync,
  };
};
