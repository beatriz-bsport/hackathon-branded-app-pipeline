import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createBookingMilestoneFilter,
  patchBookingMilestoneFilter,
} from "@bsport/api-cdp/smartlist";

import type {
  BookingMilestoneDirtyPatchPayload,
  BookingMilestoneFilterCreatePayload,
} from "#src/components/filters/booking-milestone/types";
import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UpsertBookingMilestoneFilterVariables = {
  filterId?: number;
  createPayload?: BookingMilestoneFilterCreatePayload;
  updatePayload?: BookingMilestoneDirtyPatchPayload;
};

type UseUpsertBookingMilestoneFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Creates or partially updates a smartlist booking milestone filter and invalidates `get_filters` cache.
 */
export const useUpsertBookingMilestoneFilterMutation = (
  smartlistId: string,
  params: UseUpsertBookingMilestoneFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertBookingMilestoneFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error(
            "Missing payload to create booking milestone filter.",
          );
        }
        return createBookingMilestoneFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update booking milestone filter.");
      }

      return patchBookingMilestoneFilter(fetch, filterId, updatePayload);
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
    upsertBookingMilestoneFilterMutate: mutation.mutate,
    upsertBookingMilestoneFilter: mutation.mutateAsync,
  };
};
