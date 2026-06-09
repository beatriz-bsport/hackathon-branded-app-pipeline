import { queryOptions } from "@tanstack/react-query";

import { type Fetch } from "@bsport/store-base";

import { QUERY_KEY_MAIN } from "#src/constants";

import { API_V1_URL_ADP_MODAL } from "./constants";
import type { AdpModalVisibilityConfiguration } from "./types";

export const adpModalKeys = {
  all: [QUERY_KEY_MAIN, "adp-modal"] as const,
  visibility: (appIdentifier: string) =>
    [...adpModalKeys.all, "visibility", appIdentifier] as const,
} as const;

export const fetchAdpModalVisibilityAPI = async (
  fetch: Fetch<AdpModalVisibilityConfiguration>,
  appIdentifier: string,
): Promise<AdpModalVisibilityConfiguration> => {
  const { data } = await fetch(
    `${API_V1_URL_ADP_MODAL}/${appIdentifier}/adp_modal_visibility/`,
  );

  return data;
};

export const fetchAdpModalVisibilityQueryOptions = (
  fetch: Fetch<AdpModalVisibilityConfiguration>,
  appIdentifier: string,
) =>
  queryOptions({
    queryKey: adpModalKeys.visibility(appIdentifier),
    queryFn: () => fetchAdpModalVisibilityAPI(fetch, appIdentifier),
    enabled: appIdentifier.trim().length > 0,
  });
