import { getAuth, buildUrlParams } from '../../http';
import Config from '../../config';
import SharedDataCache from '#src/services/SharedDataCache';
import { CacheKeys } from '#src/services/constants';

const SCT_TTL_MS = 30 * 60 * 1000; // 30 minutes

const API_URI = Config.REACT_APP_BASE_URI_CORE_V0;

export async function fetchSCT(params: any = {}) {
  return getAuth(`${API_URI}/category/SCT${buildUrlParams(params || {})}`);
}

export async function fetchSCTWithCache(params: any = {}) {
  const sharedCache = SharedDataCache.getInstance();
  return sharedCache.fetchWithCache({
    cacheKey: sharedCache.getCacheKey(CacheKeys.SCT),
    fetchFn: () => fetchSCT(params),
    ttl: SCT_TTL_MS, // 30 minutes for SCT
  });
}

export default {
  fetchSCT,
};
