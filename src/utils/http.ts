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
