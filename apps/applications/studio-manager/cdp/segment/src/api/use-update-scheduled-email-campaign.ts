import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CampaignScheduled,
  type UpdateScheduledEmailCampaignPayload,
  updateScheduledEmailCampaignAPI,
} from "@bsport/api-cdp/communicate";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseUpdateScheduledEmailCampaignParams = {
  onSuccess?: (data: CampaignScheduled) => void;
  onError?: (error: Error) => void;
};

export const useUpdateScheduledEmailCampaign = ({
  onSuccess,
  onError,
}: UseUpdateScheduledEmailCampaignParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      campaignScheduledId,
      payload,
    }: {
      campaignScheduledId: string;
      payload: UpdateScheduledEmailCampaignPayload;
    }) => updateScheduledEmailCampaignAPI(fetch, campaignScheduledId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: smartlistQueryKeys.communicateKeys.campaignScheduledDetail(
          variables.campaignScheduledId,
        ),
      });
      queryClient.invalidateQueries({
        queryKey: smartlistQueryKeys.communicateKeys.campaignScheduledList({
          smartlist_id__in: [Number(variables.payload.smartlist)],
        }),
      });
      onSuccess?.(data);
    },
    onError,
  });

  return {
    updateScheduledCampaign: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  } as const;
};
