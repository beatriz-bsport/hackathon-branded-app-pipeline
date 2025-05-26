import { fetchFeaturesAction } from "@bsport/store-core-data-company";
import { fetchCompanyThemeAction } from "@bsport/store-core-data-company-theme";

import { fetch } from "#src/utils/fetch";

const fetchCompanyFeatures = fetchFeaturesAction.bind(null, fetch);
const fetchCompanyTheme = fetchCompanyThemeAction.bind(null, fetch);

/**
 * Action to fetch data in DataLayerWrapper
 */
export const fetchSharedData = () => {
  fetchCompanyFeatures();
  fetchCompanyTheme();
};
