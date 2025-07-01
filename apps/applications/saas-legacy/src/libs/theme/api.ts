import { getAuthDeprecated, patchAuth } from '../../http';
import Config from '../../config';
import SharedDataCache from '#src/services/SharedDataCache';
import { CacheKeys } from '#src/services/constants';

const API_V1_URI = Config.REACT_APP_BASE_URI_CORE_V1;

const fetchCompanyTheme = async (companyId: number) => {
  return getAuthDeprecated(`${API_V1_URI}/company/theme/${companyId || 'me'}/`);
};

export const fetchCompanyThemeWithCache = async (companyId: number) => {
  const sharedCache = SharedDataCache.getInstance();
  return sharedCache.fetchWithCache({
    cacheKey: sharedCache.getCacheKey(CacheKeys.CompanyTheme, companyId),
    fetchFn: () => fetchCompanyTheme(companyId),
  });
};

const updateCompanyTheme = async (companyId: number, data: any) => {
  return patchAuth(`${API_V1_URI}/company/theme/${companyId}/`, data);
};

export default {
  fetchCompanyTheme,
  updateCompanyTheme,
};
