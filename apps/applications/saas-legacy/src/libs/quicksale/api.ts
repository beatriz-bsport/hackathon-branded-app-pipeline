import { AxiosResponse } from 'axios';
import { getAuth, patchAuth } from '../../http';
import { QuicksaleConfiguration, QuicksaleSection } from './types';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_BUYABLE_V1;

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
