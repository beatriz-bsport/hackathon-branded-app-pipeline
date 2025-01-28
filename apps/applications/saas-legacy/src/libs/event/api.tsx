import { buildUrlParams, getAuth } from '../../http';
import { EventListParams } from './types';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_PLATFORM_V1;

export const fetchEventList = async (params: EventListParams) => {
  return getAuth(`${API_V1_URI}/event/event/${buildUrlParams(params)}`);
};
