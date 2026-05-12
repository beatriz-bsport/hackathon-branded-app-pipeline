import { useMutation } from "@tanstack/react-query";

import { deleteTagRuleAPI } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

type DeleteTagRuleVariables = {
  id: number;
  smartlistId: string;
};

type UseDeleteTagRuleParams = {
  onSuccess?: (data: void, variables: DeleteTagRuleVariables) => void;
  onError?: (error: Error, variables: DeleteTagRuleVariables) => void;
};

/**
 * Hook for deleting a tag rule using react-query mutation
 * @param params - Parameters for the mutation
 * @param params.onSuccess - Callback function to be called when the tag rule is deleted successfully
 * @param params.onError - Callback function to be called when the tag rule deletion fails
 * @returns Object containing the loading state and the delete function
 */
export function useDeleteTagRule({
  onSuccess,
  onError,
}: UseDeleteTagRuleParams = {}) {
  const mutation = useMutation({
    mutationFn: (params: DeleteTagRuleVariables) =>
      deleteTagRuleAPI(fetch, params.id),
    onSuccess,
    onError,
  });

  return {
    isLoading: mutation.isPending,
    deleteTagRule: mutation.mutate,
  };
}
