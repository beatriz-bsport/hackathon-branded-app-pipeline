// @flow

import { AxiosResponse } from 'axios';
import { API_V1_URI, buildUrlParams, getAuth } from '../../http';
import { GenericPaginationResults } from '../types';
import { FranchiseUser, Franchise } from './types';

export const fetchFranchise = async (): Promise<AxiosResponse<Franchise>> => {
  return getAuth(`${API_V1_URI}/franchisor/franchisor/me`);
};

export const fetchFranchiseUsers = async (params: {
  page: number;
  page_size: number;
}): Promise<AxiosResponse<GenericPaginationResults<FranchiseUser>>> => {
  return getAuth(`${API_V1_URI}/user${buildUrlParams(params)}`);
};

export const fetchFranchiseUser = async (
  userId: number,
): Promise<AxiosResponse<FranchiseUser>> => {
  return getAuth(`${API_V1_URI}/user/${userId}`);
};
