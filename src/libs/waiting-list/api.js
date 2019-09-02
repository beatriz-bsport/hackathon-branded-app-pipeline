// @flow
import { API_V1_URI, getAuth, patchAuth } from '../../http';

export const fetchConfiguration = async () => {
  return getAuth(`${API_V1_URI}/waiting-list/configuration/me/`);
};

export const patchConfiguration = async (data: *) => {
  return patchAuth(`${API_V1_URI}/waiting-list/configuration/me/`, data);
};
