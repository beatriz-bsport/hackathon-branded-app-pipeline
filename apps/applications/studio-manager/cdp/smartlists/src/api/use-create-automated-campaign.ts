import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  automatedCampaignKeys,
  createAutomatedCampaign,
} from "@bsport/api-cdp";
import type {
  AutomatedCampaign,
  CreateAutomatedCampaignParams,
} from "@bsport/api-cdp";

import { fetch } from "#src/utils/fetch";

import { smartlistKeys } from "./api";

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
      createAutomatedCampaign(fetch, params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: automatedCampaignKeys.list(String(data.smartlist)),
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
