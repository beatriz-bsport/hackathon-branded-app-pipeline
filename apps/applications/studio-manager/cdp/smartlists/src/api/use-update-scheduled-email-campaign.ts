import { useMutation, useQueryClient } from "@tanstack/react-query";

import { smartlistKeys, updateScheduledEmailCampaign } from "./api";
import type {
  CampaignScheduled,
  UpdateScheduledEmailCampaignPayload,
} from "./types";

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
    }) => updateScheduledEmailCampaign(campaignScheduledId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: smartlistKeys.campaignScheduledDetail(
          variables.campaignScheduledId,
        ),
      });
      queryClient.invalidateQueries({
        queryKey: smartlistKeys.campaignScheduledList(String(data.smartlist)),
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
