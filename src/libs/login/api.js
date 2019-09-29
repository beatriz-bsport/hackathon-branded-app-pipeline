import { API_V1_URI, getAuth, postAuth } from '../../http';

export const fetchTempPassword = () =>
  getAuth(`${API_V1_URI}/authentication/temp-password/`);

export const generateTempPassword = () =>
  postAuth(`${API_V1_URI}/authentication/temp-password/generate/`);
