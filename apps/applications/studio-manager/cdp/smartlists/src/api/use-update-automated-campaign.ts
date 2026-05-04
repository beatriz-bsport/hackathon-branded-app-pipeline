import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type AutomatedCampaign,
  type UpdateAutomatedCampaignParams,
  automatedCampaignKeys,
  updateAutomatedCampaignAPI,
} from "@bsport/api-cdp/automated-campaign";

import { fetch } from "#src/utils/fetch";

type UseUpdateAutomatedCampaignParams = {
  onSuccess?: (data: AutomatedCampaign) => void;
  onError?: (error: Error) => void;
};

export function useUpdateAutomatedCampaign({
  onSuccess,
  onError,
}: UseUpdateAutomatedCampaignParams = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: UpdateAutomatedCampaignParams) =>
      updateAutomatedCampaignAPI(fetch, params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: automatedCampaignKeys.list(String(data.smartlist)),
      });
      queryClient.invalidateQueries({
        queryKey: automatedCampaignKeys.detail(String(data.id)),
      });
      onSuccess?.(data);
    },
    onError,
  });

  return {
    updateAutomatedCampaign: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  } as const;
}
