import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sendNowScheduledCampaign, smartlistKeys } from "./api";

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
      sendNowScheduledCampaign(campaignScheduledId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: smartlistKeys.campaignScheduledDetail(
          variables.campaignScheduledId,
        ),
      });
      queryClient.invalidateQueries({
        queryKey: smartlistKeys.campaignScheduledList(smartlistId),
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
