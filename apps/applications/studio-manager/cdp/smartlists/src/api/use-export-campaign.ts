import { useMutation } from "@tanstack/react-query";

import { exportCampaignAsync } from "./api";
import { pollBackgroundTaskStatusUntilDone } from "./poll-background-task-status";

export function useExportCampaign({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: string) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: async (campaignUuid: string): Promise<string> => {
      const { backgroundTaskUuid } = await exportCampaignAsync(campaignUuid);

      return pollBackgroundTaskStatusUntilDone(backgroundTaskUuid);
    },
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });
}
