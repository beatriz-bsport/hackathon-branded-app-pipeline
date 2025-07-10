import { LEGACY_URLS } from "#src/urls";

import { removeTrailingSlash } from "./utils";

export const FEATURE_IDENTIFIERS = {
  CUSTOM_APP: 1,
  CLOCK_IN: 21,
  PERFORMANCE_TRACKING: 19,
  ACCESS_MONITORING: 34,
} as const;

/**
 * Map a feature identifier to the list of URLs it protects
 */
export const PROTECTED_FEATURES_URLS: Record<number, Array<string>> = {
  [FEATURE_IDENTIFIERS.ACCESS_MONITORING]: [
    LEGACY_URLS.accessMonitoring,
    LEGACY_URLS.accessMonitoring_monitor,
    LEGACY_URLS.accessMonitoring_perform,
    LEGACY_URLS.accessMonitoring_settings,
    // /! Warning !\ Add revamp URLS as well when implemented
    // => REVAMP_URLS.accessMonitoring
  ],
  [FEATURE_IDENTIFIERS.CLOCK_IN]: [LEGACY_URLS.attendance],
  [FEATURE_IDENTIFIERS.CUSTOM_APP]: [
    LEGACY_URLS.settings_mobilePersonalization,
  ],
  [FEATURE_IDENTIFIERS.PERFORMANCE_TRACKING]: [LEGACY_URLS.performanceTracking],
};

/**
 * Given that a URL can host only one upsell, map a url to its related host
 */
const URL_TO_FEATURE_MAP = new Map();
for (const [feature, urls] of Object.entries(PROTECTED_FEATURES_URLS)) {
  urls.forEach((url) => URL_TO_FEATURE_MAP.set(url, parseInt(feature)));
}

export function getFeatureRelatedToUrl(url?: string) {
  return URL_TO_FEATURE_MAP.get(removeTrailingSlash(url));
}
