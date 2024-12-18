import { AxiosResponse } from 'axios';
import {
  getAuth,
  buildUrlParams,
  postAuth,
  patchAuth,
  API_V1_URI,
} from '../../http';

import { MarketplaceCSSConfiguration } from './types';

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
