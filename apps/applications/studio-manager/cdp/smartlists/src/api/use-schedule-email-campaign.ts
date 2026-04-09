import { useMutation, useQueryClient } from "@tanstack/react-query";

import { scheduleEmailCampaign, smartlistKeys } from "./api";
import type { CampaignScheduled, ScheduleEmailCampaignPayload } from "./types";

type UseScheduleEmailCampaignParams = {
  onSuccess?: (data: CampaignScheduled) => void;
  onError?: (error: Error) => void;
};

export const useScheduleEmailCampaign = ({
  onSuccess,
  onError,
}: UseScheduleEmailCampaignParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ payload }: { payload: ScheduleEmailCampaignPayload }) =>
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
