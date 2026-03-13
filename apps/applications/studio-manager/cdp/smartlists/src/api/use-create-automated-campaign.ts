import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAutomatedCampaign, smartlistKeys } from "./api";
import type { AutomatedCampaign, CreateAutomatedCampaignParams } from "./types";

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
      createAutomatedCampaign(params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: smartlistKeys.automatedCampaigns(String(data.smartlist)),
      });
      queryClient.invalidateQueries({
        queryKey: smartlistKeys.detail(String(data.smartlist)),
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
