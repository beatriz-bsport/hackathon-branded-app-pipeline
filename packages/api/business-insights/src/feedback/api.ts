import { type Fetch } from "@bsport/store-base";

import { API_V1_URL_EMBEDDED_ANALYTICS } from "#src/embedded-analytics/constants";

import type { FeedbackCreatePayload, FeedbackCreateResponse } from "./types";

// ----------------------------------------------------------------------------

export const createFeedbackAPI = (
  fetch: Fetch<FeedbackCreateResponse>,
  payload: FeedbackCreatePayload,
): Promise<FeedbackCreateResponse> =>
  fetch(`${API_V1_URL_EMBEDDED_ANALYTICS}/feedback/`, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then(({ data }) => data);
