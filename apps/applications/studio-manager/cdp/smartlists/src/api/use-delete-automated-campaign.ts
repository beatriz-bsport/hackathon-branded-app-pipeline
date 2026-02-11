import { useMutation } from "@tanstack/react-query";

import { deleteAutomatedCampaign } from "./api";

type UseDeleteAutomatedCampaignParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
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
  const mutation = useMutation({
    mutationFn: (params: { id: number }) => deleteAutomatedCampaign(params.id),
    onSuccess,
    onError,
  });

  return {
    isLoading: mutation.isPending,
    deleteAutomatedCampaign: mutation.mutate,
  };
}
