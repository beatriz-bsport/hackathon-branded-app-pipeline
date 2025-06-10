import { fetchUserAccessAction } from "@bsport/store-auth";
import { fetchFeaturesAction } from "@bsport/store-core-data-company";
import { fetchCompanyThemeAction } from "@bsport/store-core-data-company-theme";

import { type Fetch, fetch } from "#src/utils/fetch";

/**
 * Action to fetch data with a provided instance of fetch
 */
export const fetchSharedDataAction = (fetch: Fetch) => {
  fetchFeaturesAction(fetch);
  fetchCompanyThemeAction(fetch);
  fetchUserAccessAction(fetch);
};

/**
 * Action to fetch data in DataLayerWrapper
 */
export const fetchSharedData = fetchSharedDataAction.bind(null, fetch);
