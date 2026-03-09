import { useSuspenseQuery } from "@tanstack/react-query";

import { communicationRecipientsPreviewQueryOptions } from "./api";
import { FetchCommunicationRecipientsPreviewParams } from "./types";

/**
 * Fetches the list of recipients for a communication (preview recipients).
 * Uses a stable query key so e.g. member_ids [1,2,3] and [3,2,1] share the same cache.
 *
 * @example
 * // Smartlist target
 * const { data } = useFetchCommunicationRecipientsPreview({
 *   channel: "email",
 *   is_marketing: true,
 *   target: { type: "smartlist", smartlist_id: 42 },
 *   page: 1,
 *   page_size: 10,
 * });
 */
export function useFetchCommunicationRecipientsPreview(
  request: FetchCommunicationRecipientsPreviewParams,
) {
  return useSuspenseQuery(communicationRecipientsPreviewQueryOptions(request));
}
