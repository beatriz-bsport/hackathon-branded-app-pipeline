import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createTotalBookingFilter,
  patchTotalBookingFilter,
} from "@bsport/api-cdp/smartlist";

import type { TotalBookingFilterCreatePayload } from "#src/components/filters/total-booking/types";
import type { TotalBookingNumberDirtyPatchPayload } from "#src/components/filters/total-booking/types";
import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UpsertTotalBookingFilterVariables = {
  filterId?: number;
  createPayload?: TotalBookingFilterCreatePayload;
  updatePayload?: TotalBookingNumberDirtyPatchPayload;
};

type UseUpsertTotalBookingFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useUpsertTotalBookingFilterMutation = (
  smartlistId: string,
  params: UseUpsertTotalBookingFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertTotalBookingFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error("Missing payload to create bookings number filter.");
        }
        return createTotalBookingFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update bookings number filter.");
      }

      return patchTotalBookingFilter(fetch, filterId, updatePayload);
    },
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
    upsertTotalBookingFilterMutate: mutation.mutate,
    upsertTotalBookingFilter: mutation.mutateAsync,
  };
};
