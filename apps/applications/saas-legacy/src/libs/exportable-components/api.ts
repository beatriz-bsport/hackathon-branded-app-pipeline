import { AxiosResponse } from 'axios';
import { getAuth, buildUrlParams, postAuth, patchAuth } from '../../http';

import { MarketplaceCSSConfiguration } from './types';
import Config from '../../config';
import SharedDataCache from '#src/services/SharedDataCache';
import { CacheKeys } from '#src/services/constants';

const API_V1_URI = Config.REACT_APP_BASE_URI_CORE_V1;

export const fetchManagerCssWidgetConfiguration = (): Promise<
  AxiosResponse<MarketplaceCSSConfiguration>
> => {
  return getAuth(`${API_V1_URI}/company/custom_css/me`);
};

export const fetchCompanyCssWidgetConfiguration = (
  company: number,
): Promise<AxiosResponse<MarketplaceCSSConfiguration[]>> => {
  return getAuth(
    `${API_V1_URI}/company/custom_css/${buildUrlParams({ company })}`,
  );
};

export const fetchCompanyCssWidgetConfigurationWithCache = (
  company: number,
): Promise<AxiosResponse<MarketplaceCSSConfiguration[]>> => {
  const sharedCache = SharedDataCache.getInstance();
  return sharedCache.fetchWithCache({
    cacheKey: sharedCache.getCacheKey(CacheKeys.CompanyCss, company),
    fetchFn: () => fetchCompanyCssWidgetConfiguration(company),
  });
};

export const saveCssWidgetConfiguration = (
  configId: number,
  components_css: MarketplaceCSSConfiguration['components_css'],
): Promise<AxiosResponse<MarketplaceCSSConfiguration>> => {
  return patchAuth(`${API_V1_URI}/company/custom_css/${configId}/`, {
    components_css,
  });
};

export const resetCssWidgetConfiguration = (): Promise<
  AxiosResponse<MarketplaceCSSConfiguration>
> => {
  return postAuth(`${API_V1_URI}/company/custom_css/reset/`);
};
