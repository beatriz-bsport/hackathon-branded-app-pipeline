import { useMutation } from "@tanstack/react-query";

import type { GenerateReportParams } from "@bsport/api-cdp/communicate";
import { generateCampaignReportAPI } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { pollBackgroundTaskStatusUntilDone } from "./poll-background-task-status";

export function useGenerateCampaignReport({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: string) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: async (params: GenerateReportParams): Promise<string> => {
      const { backgroundTaskUuid } = await generateCampaignReportAPI(
        fetch,
        params,
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
