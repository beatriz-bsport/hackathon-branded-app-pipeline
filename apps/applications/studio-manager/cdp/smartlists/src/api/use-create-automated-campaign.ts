import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type AutomatedCampaign,
  type CreateAutomatedCampaignParams,
  automatedCampaignKeys,
  createAutomatedCampaignAPI,
} from "@bsport/api-cdp/automated-campaign";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseCreateAutomatedCampaignParams = {
  onSuccess?: (data: AutomatedCampaign) => void;
  onError?: (error: Error) => void;
};

export function useCreateAutomatedCampaign({
  onSuccess,
  onError,
}: UseCreateAutomatedCampaignParams = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: CreateAutomatedCampaignParams) =>
      createAutomatedCampaignAPI(fetch, params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: automatedCampaignKeys.list(String(data.smartlist)),
      });
      queryClient.invalidateQueries({
        queryKey: smartlistQueryKeys.detail(String(data.smartlist)),
      });
      onSuccess?.(data);
    },
    onError,
  });

  return {
    createAutomatedCampaign: mutation.mutateAsync,
    isCreating: mutation.isPending,
  } as const;
}
