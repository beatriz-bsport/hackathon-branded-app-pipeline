// @flow
import { getAuth, postAuth, patchAuth, buildUrlParams } from '../../http';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_STAFF_MANAGEMENT_V1;

export const fetchTaskList = (params: any = {}) => {
  return getAuth(`${API_V1_URI}/reminder/task/${buildUrlParams(params)}`);
};

export const patchTask = (id: number, data: any = {}) => {
  return patchAuth(`${API_V1_URI}/reminder/task/${id}/`, data);
};

export const createOrUpdateTask = (data: any = {}) => {
  if (data.id) {
    return patchAuth(`${API_V1_URI}/reminder/task/${data.id}/`, data);
  }
  return postAuth(`${API_V1_URI}/reminder/task/`, data);
};
