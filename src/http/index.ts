import {
  parseQueryString,
  buildUrlParams,
  setAuthToken,
  getAuthToken,
  parseQueryStringWhithoutDecode,
} from './utils';
import { BASE_URI, API_URI, API_V1_URI } from './constants';
import {
  postBase,
  post,
  put,
  patch,
  get,
  getAuth,
  postAuth,
  postBaseAuth,
  putAuth,
  patchAuth,
  deleteAuth,
  getJSONAuth,
} from './api';

export {
  // UTILS
  parseQueryString,
  buildUrlParams,
  setAuthToken,
  getAuthToken,
  // CONSTANTS
  BASE_URI,
  API_URI,
  API_V1_URI,
  // API
  postBase,
  post,
  put,
  patch,
  get,
  getAuth,
  postAuth,
  postBaseAuth,
  putAuth,
  patchAuth,
  deleteAuth,
  getJSONAuth,
  parseQueryStringWhithoutDecode,
};
