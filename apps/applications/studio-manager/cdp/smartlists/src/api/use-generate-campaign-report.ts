import { useMutation } from "@tanstack/react-query";

import { generateCampaignReport } from "./api";
import { pollBackgroundTaskStatusUntilDone } from "./poll-background-task-status";
import { GenerateReportParams } from "./types";

export function useGenerateCampaignReport({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: string) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: async (params: GenerateReportParams): Promise<string> => {
      const { backgroundTaskUuid } = await generateCampaignReport(params);
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
