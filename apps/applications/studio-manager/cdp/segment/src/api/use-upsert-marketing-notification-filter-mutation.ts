import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createMarketingNotificationFilter,
  patchMarketingNotificationFilter,
} from "@bsport/api-cdp/smartlist";

import type {
  MarketingNotificationFilterCreatePayload,
  MarketingNotificationFilterDirtyPatchPayload,
} from "#src/components/filters/marketing-notification-filter/types";
import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UpsertMarketingNotificationFilterVariables = {
  filterId?: number;
  createPayload?: MarketingNotificationFilterCreatePayload;
  updatePayload?: MarketingNotificationFilterDirtyPatchPayload;
};

type UseUpsertMarketingNotificationFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useUpsertMarketingNotificationFilterMutation = (
  smartlistId: string,
  params: UseUpsertMarketingNotificationFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertMarketingNotificationFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error(
            "Missing payload to create marketing notification filter.",
          );
        }
        return createMarketingNotificationFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error(
          "Missing payload to update marketing notification filter.",
        );
      }

      return patchMarketingNotificationFilter(fetch, filterId, updatePayload);
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
    upsertMarketingNotificationFilterMutate: mutation.mutate,
    upsertMarketingNotificationFilter: mutation.mutateAsync,
  };
};
