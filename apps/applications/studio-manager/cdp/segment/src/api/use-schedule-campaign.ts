import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CampaignScheduled,
  type ScheduleCampaignPayload,
  scheduleEmailCampaignAPI,
} from "@bsport/api-cdp/communicate";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseScheduleCampaignParams = {
  onSuccess?: (data: CampaignScheduled) => void;
  onError?: (error: Error) => void;
};

export const useScheduleCampaign = ({
  onSuccess,
  onError,
}: UseScheduleCampaignParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ payload }: { payload: ScheduleCampaignPayload }) =>
      scheduleEmailCampaignAPI(fetch, payload),
    onSuccess: (data) => {
      if (data.smartlist) {
        queryClient.invalidateQueries({
          queryKey: smartlistQueryKeys.communicateKeys.campaignScheduledList({
            smartlist_id__in: [Number(data.smartlist)],
          }),
        });
      }
      onSuccess?.(data);
    },
    onError,
  });

  return {
    scheduleCampaign: mutation.mutateAsync,
    isScheduling: mutation.isPending,
  } as const;
};
