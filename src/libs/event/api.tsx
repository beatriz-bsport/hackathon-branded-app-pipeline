// @ts-nocheck
import { API_V1_URI, buildUrlParams, getAuth } from '../../http';
import { EventListParams } from './types';

export const fetchEventList = async (params: EventListParams) => {
  return getAuth(`${API_V1_URI}/event/event/${buildUrlParams(params)}`);
};
