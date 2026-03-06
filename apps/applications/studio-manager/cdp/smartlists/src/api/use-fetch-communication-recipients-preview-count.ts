import { useSuspenseQuery } from "@tanstack/react-query";

import { communicationRecipientsCountPreviewQueryOptions } from "./api";
import { CommunicationPreviewRecipientsRequest } from "./types";

/**
 * Fetches the count of recipients for a communication preview.
 * Uses a stable query key so e.g. member_ids [1,2,3] and [3,2,1] share the same cache.
 *
 * @example
 * // Smartlist target
 * const { data } = useFetchCommunicationRecipientsPreviewCount({
 *   channel: "email",
 *   is_marketing: true,
 *   target: { type: "smartlist", smartlist_id: 42 },
 * });
 */
export function useFetchCommunicationRecipientsPreviewCount(
  request: CommunicationPreviewRecipientsRequest,
) {
  return useSuspenseQuery(
    communicationRecipientsCountPreviewQueryOptions(request),
  );
}
