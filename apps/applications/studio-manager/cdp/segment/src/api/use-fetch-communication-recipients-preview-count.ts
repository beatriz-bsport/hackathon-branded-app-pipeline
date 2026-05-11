import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import {
  CommunicationPreviewRecipientsRequest,
  communicateKeys,
  fetchCommunicationRecipientsCountPreviewAPI,
} from "@bsport/api-cdp/communicate";

import { fetch } from "#src/utils/fetch";

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
    queryOptions({
      queryKey: communicateKeys.communicationRecipientsCountPreview(request),
      queryFn: () =>
        fetchCommunicationRecipientsCountPreviewAPI(fetch, request),
    }),
  );
}
