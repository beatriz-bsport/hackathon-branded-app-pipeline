import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type PrivateBookingsFilter,
  createPrivateBookingsFilter,
  patchPrivateBookingsFilter,
} from "@bsport/api-cdp/smartlist";

import type { TotalAppointmentsFilterCreatePayload } from "#src/components/filters/total-appointments/types";
import type { TotalAppointmentsNumberDirtyPatchPayload } from "#src/components/filters/total-appointments/types";
import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UpsertTotalAppointmentsFilterVariables = {
  filterId?: number;
  createPayload?: TotalAppointmentsFilterCreatePayload;
  updatePayload?: TotalAppointmentsNumberDirtyPatchPayload;
};

type UseUpsertTotalAppointmentsFilterMutationParams = {
  onSuccess?: (data: PrivateBookingsFilter) => void;
  onError?: (error: Error) => void;
};

/**
 * Creates or patches a total appointments (private bookings) smartlist filter.
 */
export const useUpsertTotalAppointmentsFilterMutation = (
  smartlistId: string,
  params: UseUpsertTotalAppointmentsFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertTotalAppointmentsFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error(
            "Missing payload to create total appointments filter.",
          );
        }
        return createPrivateBookingsFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update total appointments filter.");
      }

      return patchPrivateBookingsFilter(fetch, filterId, updatePayload);
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
    upsertTotalAppointmentsFilterMutate: mutation.mutate,
    upsertTotalAppointmentsFilter: mutation.mutateAsync,
  };
};
