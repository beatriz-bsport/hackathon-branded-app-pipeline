import { fetchFeaturesAction } from "@bsport/store-core-data-company";

import { fetch } from "#src/utils/fetch";

export const fetchCompanyFeatures = fetchFeaturesAction.bind(null, fetch);
