import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  automatedCampaignKeys,
  deleteAutomatedCampaign,
} from "@bsport/api-cdp";

import { fetch } from "#src/utils/fetch";

type DeleteAutomatedCampaignVariables = {
  id: number;
  smartlistId: string;
};

type UseDeleteAutomatedCampaignParams = {
  onSuccess?: (data: void, variables: DeleteAutomatedCampaignVariables) => void;
  onError?: (error: Error, variables: DeleteAutomatedCampaignVariables) => void;
};

/**
 * Hook for deleting an automated campaign using react-query mutation
 * @param params - Parameters for the mutation
 * @param params.onSuccess - Callback function to be called when the automated campaign is deleted successfully
 * @param params.onError - Callback function to be called when the automated campaign deletion fails
 * @returns Object containing the loading state and the delete function
 */
export function useDeleteAutomatedCampaign({
  onSuccess,
  onError,
}: UseDeleteAutomatedCampaignParams = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: DeleteAutomatedCampaignVariables) =>
      deleteAutomatedCampaign(fetch, params.id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: automatedCampaignKeys.list(variables.smartlistId),
      });
      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    isLoading: mutation.isPending,
    deleteAutomatedCampaign: mutation.mutate,
  };
}
