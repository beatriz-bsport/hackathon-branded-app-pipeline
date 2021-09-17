// @flow

import { AxiosResponse } from 'axios';
import { API_V1_URI, getAuth } from '../../http';
import { Franchise } from './types';

export const fetchFranchise = async (): Promise<AxiosResponse<Franchise>> => {
  return getAuth(`${API_V1_URI}/franchisor/franchisor/me`);
};
