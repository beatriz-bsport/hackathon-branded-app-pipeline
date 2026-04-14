import { useMutation, useQueryClient } from "@tanstack/react-query";

import { scheduleEmailCampaign, smartlistKeys } from "./api";
import type { CampaignScheduled, ScheduleCampaignPayload } from "./types";

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
      scheduleEmailCampaign(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: smartlistKeys.campaignScheduledList(String(data.smartlist)),
      });
      onSuccess?.(data);
    },
    onError,
  });

  return {
    scheduleCampaign: mutation.mutateAsync,
    isScheduling: mutation.isPending,
  } as const;
};
