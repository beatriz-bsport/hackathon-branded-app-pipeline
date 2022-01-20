// @flow

import { AxiosResponse } from 'axios';
import { GenericPaginationResults } from '../types';
import {
  API_V1_URI,
  buildUrlParams,
  getAuth,
  patchAuth,
  get,
} from '../../http';
import { FranchiseUser, Franchise, FranchiseDetails } from './types';

export const fetchFranchise = async (): Promise<AxiosResponse<Franchise>> => {
  return getAuth(`${API_V1_URI}/franchisor/franchisor/me`);
};

export const retrieveFranchise = async (
  id: number,
): Promise<AxiosResponse<Franchise>> => {
  return getAuth(`${API_V1_URI}/franchisor/franchisor/${id}/`);
};

export const fetchFranchiseUsers = async (params: {
  page: number;
  page_size: number;
  exclude_archived: boolean;
}): Promise<AxiosResponse<GenericPaginationResults<FranchiseUser>>> => {
  return getAuth(`${API_V1_URI}/user${buildUrlParams(params)}`);
};

export const fetchFranchiseUser = async (
  userId: number,
): Promise<AxiosResponse<FranchiseUser>> => {
  return getAuth(`${API_V1_URI}/user/${userId}`);
};

export const updateFranchiseTheme = async (
  franchiseId: number,
  data: {
    primary_color: string;
    secondary_color: string;
    cover: File;
  },
) => {
  return patchAuth(`${API_V1_URI}/franchisor/franchisor/${franchiseId}/`, data);
};

export const fetchFranchiseTheme = async (
  franchiseId: number,
): Promise<AxiosResponse<FranchiseDetails>> => {
  return get(`${API_V1_URI}/franchisor/franchisor/${franchiseId}/`);
};
