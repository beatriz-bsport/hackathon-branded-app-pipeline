// @flow
//
import { getAuth, buildUrlParams, API_V1_URI } from '../../http';

export const fetchCompanyList = (params: any = {}) => {
  return getAuth(`${API_V1_URI}/company/search/${buildUrlParams(params)}`);
};
