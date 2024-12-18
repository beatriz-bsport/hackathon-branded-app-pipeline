import { AxiosResponse } from 'axios';
import { getAuth, patchAuth, API_V1_URI } from '../../http';
import { QuicksaleConfiguration, QuicksaleSection } from './types';

export const fetchQuicksaleConfiguration = async (): Promise<
  AxiosResponse<QuicksaleConfiguration>
> => {
  return getAuth(`${API_V1_URI}/quicksale/configuration/me/`);
};

export const updateQuicksaleConfiguration = async (
  data: Array<QuicksaleSection>,
): Promise<AxiosResponse<QuicksaleConfiguration>> => {
  return patchAuth(`${API_V1_URI}/quicksale/configuration/me/`, {
    configuration: data,
  });
};
