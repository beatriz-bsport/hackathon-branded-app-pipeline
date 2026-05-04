import { useMutation } from "@tanstack/react-query";

import { exportCampaignAsyncAPI } from "@bsport/api-cdp/communicate";

import { fetch } from "#src/utils/fetch";

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
      const { backgroundTaskUuid } = await exportCampaignAsyncAPI(
        fetch,
        campaignUuid,
      );

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
