import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sendNowScheduledCampaignAPI } from "@bsport/api-cdp/communicate";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseSendNowScheduledCampaignParams = {
  smartlistId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useSendNowScheduledCampaign = ({
  smartlistId,
  onSuccess,
  onError,
}: UseSendNowScheduledCampaignParams) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ campaignScheduledId }: { campaignScheduledId: string }) =>
      sendNowScheduledCampaignAPI(fetch, campaignScheduledId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: smartlistQueryKeys.communicateKeys.campaignScheduledDetail(
          variables.campaignScheduledId,
        ),
      });
      queryClient.invalidateQueries({
        queryKey: smartlistQueryKeys.communicateKeys.campaignScheduledList({
          smartlist_id__in: [Number(smartlistId)],
        }),
      });
      onSuccess?.();
    },
    onError,
  });

  return {
    sendNowScheduledCampaign: mutation.mutateAsync,
    isSendingNow: mutation.isPending,
  } as const;
};
