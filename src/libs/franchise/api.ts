// @flow

import { AxiosResponse } from 'axios';
import { API_V1_URI, getAuth } from '../../http';

export const fetchFranchise = async (): Promise<
  AxiosResponse<{
    data: {
      loading: boolean;
      error: boolean;
      item: {
        id: number;
        companies: number[];
        name: string;
        primaryRGB: [number, number, number];
        secondaryRGB: [number, number, number];
        cover: string;
      };
    };
    status: number;
    statusText: string;
  }>
> => {
  return getAuth(`${API_V1_URI}/franchisor/franchisor/me`);
};
