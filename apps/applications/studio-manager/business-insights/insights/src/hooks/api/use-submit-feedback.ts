import { useMutation } from "@tanstack/react-query";

import { createFeedbackAPI } from "@bsport/api-business-insights/feedback";
import type { FeedbackCreatePayload } from "@bsport/api-business-insights/feedback";
import { captureException } from "@bsport/sm-backbone";

import { fetch } from "#src/utils/fetch";

export const useSubmitFeedback = () => {
  const createMutation = useMutation({
    mutationFn: (payload: FeedbackCreatePayload) =>
      createFeedbackAPI(fetch, payload),
    onError: (err) => captureException(err),
  });

  return {
    /**
     * Always POSTs a new assessment. The Databricks assessments PATCH endpoint
     * requires a SQL warehouse that is cold at rest and hangs indefinitely.
     * The latest assessment per trace represents the current vote for analytics.
     */
    submitWithRationale: createMutation.mutateAsync,
    isPending: createMutation.isPending,
    isError: createMutation.isError,
    isSuccess: createMutation.isSuccess,
  } as const;
};
