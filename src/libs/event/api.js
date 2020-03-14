// @flow

import { API_V1_URI, buildUrlParams, getAuth } from '../../http';

export const fetchEventList = async (params: any) => {
  return getAuth(`${API_V1_URI}/event/event/${buildUrlParams(params)}`);
};
