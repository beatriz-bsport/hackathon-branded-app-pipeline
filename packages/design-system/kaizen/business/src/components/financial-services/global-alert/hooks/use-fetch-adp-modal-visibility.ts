import { useQuery } from "@tanstack/react-query";

import { fetchAdpModalVisibilityQueryOptions } from "@bsport/api-member-experience/adp-modal";
import type { Fetch } from "@bsport/fetch";

const STALE_TIME = 5 * 60 * 1000;

type UseFetchAdpModalVisibilityParams = {
  fetch: Fetch;
  appIdentifier: string;
};

/** Fetches whether the Apple Developer Program enrollment modal should be shown for the given app. */
export const useFetchAdpModalVisibility = ({
  fetch,
  appIdentifier,
}: UseFetchAdpModalVisibilityParams) =>
  useQuery({
    ...fetchAdpModalVisibilityQueryOptions(fetch, appIdentifier),
    staleTime: STALE_TIME,
  });
