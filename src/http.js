// @flow
import axios from 'axios';

const storage = window.localStorage;

export const BASE_URI: string = process.env.REACT_APP_BASE_URI;
export const API_URI: string = `${BASE_URI}/api-v0`;

export function setAuthToken(token: string) {
  storage.setItem('http:token', token);
}

export function getAuthToken(): ?string {
  return storage.getItem('http:token');
}

export async function post(uri: string, data: Object, headers: Object) {
  const baseHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(uri, data, {
      headers: Object.assign(baseHeaders, headers),
    });

    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function put(uri: string, data: Object, headers: Object) {
  const baseHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return axios.put(uri, data, {
    headers: Object.assign(baseHeaders, headers),
  });
}

export async function get(uri: string, headers: {} = {}) {
  return axios({
    url: uri,
    method: 'get',
    headers,
  });
}

export async function getAuth(uri: string) {
  const token = getAuthToken();
  return get(uri, { Authorization: `Token ${token}` });
}

export async function postAuth(uri: string, data: Object) {
  const token = getAuthToken();
  return post(uri, data, { Authorization: `Token ${token}` });
}

export async function putAuth(uri: string, data: Object) {
  const token = getAuthToken();
  return put(uri, data, { Authorization: `Token ${token}` });
}
