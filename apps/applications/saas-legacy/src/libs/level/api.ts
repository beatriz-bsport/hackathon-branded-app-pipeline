import { AxiosResponse } from 'axios';

import {
  API_V1_URI,
  getAuth,
  putAuth,
  postAuth,
  patchAuth,
  buildUrlParams,
} from '../../http';
import { Level, LevelFilterSet } from './types';

export const fetchLevelList = (params: LevelFilterSet) => {
  return getAuth<Level[]>(
    `${API_V1_URI}/master-data/level/${buildUrlParams(params)}`,
  );
};

export const fetchLevel = async (id: number): Promise<AxiosResponse<Level>> => {
  return getAuth(`${API_V1_URI}/master-data/level/${id}`);
};

export const updateLevel = (
  id: number,
  data: Level,
): Promise<AxiosResponse<Level>> => {
  return putAuth(`${API_V1_URI}/master-data/level/${id}/`, data);
};

export const createLevel = (data: Level): Promise<AxiosResponse<Level>> => {
  return postAuth(`${API_V1_URI}/master-data/level/`, data);
};

export const deleteLevel = (id: number) => {
  return patchAuth(`${API_V1_URI}/master-data/level/${id}/`, {
    enabled: false,
  });
};
