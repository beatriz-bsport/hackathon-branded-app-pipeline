import { useMutation, useQueryClient } from "@tanstack/react-query";

import { smartlistKeys } from "./api";
import { deleteScheduledCommunication } from "./api";

type DeleteScheduledCommunicationVariables = {
  scheduledCampaignId: string;
  /** Optional : if passed, will also invalidate scheduled campaign list of given smartlist */
  smartlistId?: string;
};

type UseDeleteScheduledCommunicationParams = {
  onSuccess?: (
    data: void,
    variables: DeleteScheduledCommunicationVariables,
  ) => void;
  onError?: (
    error: Error,
    variables: DeleteScheduledCommunicationVariables,
  ) => void;
};

/**
 * Hook for deleting a scheduled communication (DELETE).
 * Performs cache updates when `smartlistId` is provided:
 * - Removes the scheduled campaign detail from the cache (avoids refetching a deleted resource).
 * - Invalidates the scheduled campaign list for the smartlist so the list refetches without the deleted item.
 *
 * @param params - Optional onSuccess / onError callbacks (e.g. toast, redirect).
 * @returns { deleteScheduledCommunication, deleteScheduledCommunicationAsync, isDeleting } - action, async action, and loading state.
 */
export function useDeleteScheduledCommunication({
  onSuccess,
  onError,
}: UseDeleteScheduledCommunicationParams = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      scheduledCampaignId,
    }: DeleteScheduledCommunicationVariables) =>
      deleteScheduledCommunication(scheduledCampaignId),
    onSuccess(data, variables) {
      const { scheduledCampaignId, smartlistId } = variables;

      // Remove detail from cache so we don't refetch a deleted resource
      queryClient.removeQueries({
        queryKey: smartlistKeys.campaignScheduledDetail(scheduledCampaignId),
      });

      if (smartlistId) {
        queryClient.invalidateQueries({
          queryKey: smartlistKeys.campaignScheduledList(smartlistId),
        });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    isDeleting: mutation.isPending,
    deleteScheduledCommunication: mutation.mutate,
    deleteScheduledCommunicationAsync: mutation.mutateAsync,
  } as const;
}
