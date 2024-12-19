export function buildUrlParams(params: any) {
  if (params) {
    const conditions = [];
    for (const k in params) {
      // eslint-disable-next-line
      if (params.hasOwnProperty(k)) {
        if (Array.isArray(params[k])) {
          conditions.push(`${k}=${params[k].join(',')}`);
        } else {
          conditions.push(`${k}=${params[k]}`);
        }
      }
    }
    return `?${conditions.join('&')}`;
  }
  return '';
}

/**
 * Parses the query string from a URL and filters out unwanted parameters based on a whitelist.
 * @param url The URL to parse.
 * @param whiteListParams An optional array containing parameter names to whitelist.
 * @returns An object containing the parsed query parameters.
 */
export function parseQueryString(
  url: string,
  whiteListParams: string[] = [],
): Record<string, any> {
  const pos = url.lastIndexOf('?');
  if (pos === -1) {
    return {};
  }

  const qs = url.substring(pos + 1);

  const params = qs.split('&').map((q) => q.split('=').map(decodeURIComponent));

  const parsedParams: Record<string, any> = {};

  if (whiteListParams && whiteListParams.length > 0) {
    params.forEach(([name, value]) => {
      if (whiteListParams.includes(name)) {
        parsedParams[name] = value;
      }
    });
  } else {
    params.forEach(([name, value]) => {
      parsedParams[name] = value;
    });
  }

  return parsedParams;
}

const SAFE_ANALYTICS_TRACKING_KEYS = [
  // UTM
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  // Google Ads
  'gclid',
  'gclsrc',
  'dclid',
  // Facebook / Meta
  'fbclid',
  'fbc',
  'fbp',
  'content_id',
  'content_type',
  'ad_id',
  'adset_id',
  'campaign_id',
  'fbq',
  'campaign_id',
  'ad_name',
  'adset_name',
  'campaign_name',
  'placement',
  'site_source_name',
];

/**
 * Builds a URL query string from the given parameters, filtering out unsafe keys.
 * @param params An object containing the parameters to include in the URL.
 * @returns A string representing the URL query parameters.
 * @deprecated This version is not type safe.
 */
export const buildSafeUtmTrackingParams = (
  params: Record<string, any>,
): string => {
  const safeParams: Record<string, any> = {};

  if (!params || typeof params !== 'object') {
    return '';
  }

  Object.keys(params).forEach((key) => {
    if (SAFE_ANALYTICS_TRACKING_KEYS.includes(key)) {
      safeParams[key] = params[key];
    }
  });

  return buildUrlParams(safeParams); // Assuming buildUrlParams is defined elsewhere
};

/**
 * Builds analytics tracking parameters from the current URL, filtering out unsafe keys.
 * @returns A string representing the analytics tracking parameters.
 */
export const buildAnalyticsTrackingParamsFromCurrentUrl = (): string => {
  try {
    const currentUrl = window?.location?.href ?? '';

    const safeParams = parseQueryString(
      currentUrl,
      SAFE_ANALYTICS_TRACKING_KEYS,
    );

    return buildUrlParams(safeParams);
  } catch (error) {
    console.error(error);
    return '';
  }
};
