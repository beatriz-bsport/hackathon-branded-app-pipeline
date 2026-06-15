import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type LastBookingFilter,
  createLastBookingFilter,
  patchLastBookingFilter,
} from "@bsport/api-cdp/smartlist";

import type {
  LastBookingFilterCreatePayload,
  LastBookingFilterDirtyPatchPayload,
} from "#src/components/filters/last-booking-filter/types";
import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UpsertLastBookingFilterVariables = {
  filterId?: number;
  createPayload?: LastBookingFilterCreatePayload;
  updatePayload?: LastBookingFilterDirtyPatchPayload;
};

type UseUpsertLastBookingFilterMutationParams = {
  onSuccess?: (data: LastBookingFilter) => void;
  onError?: (error: Error) => void;
};

export const useUpsertLastBookingFilterMutation = (
  smartlistId: string,
  params: UseUpsertLastBookingFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertLastBookingFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error("Missing payload to create last booking filter.");
        }
        return createLastBookingFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update last booking filter.");
      }

      return patchLastBookingFilter(fetch, filterId, updatePayload);
    },
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
    upsertLastBookingFilterMutate: mutation.mutate,
    upsertLastBookingFilter: mutation.mutateAsync,
  };
};
