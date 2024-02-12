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

const SAFE_UTM_TRACKING_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
];

export const buildSafeUtmTrackingParams = (params: Record<string, any>) => {
  const safeParams: Record<string, any> = {};

  if (!params || typeof params !== 'object') {
    return '';
  }

  Object.keys(params).forEach((key) => {
    if (SAFE_UTM_TRACKING_KEYS.includes(key)) {
      safeParams[key] = params[key];
    }
  });

  return buildUrlParams(safeParams);
};
