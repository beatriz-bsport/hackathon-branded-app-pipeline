import axios from 'axios';

let authToken = '';

import { storage } from './App';

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
    const response = await axios.post(uri, {
      headers: Object.assign(baseHeaders, headers),
      body: JSON.stringify(data),
    });

    const json = await response.json();
    return json;
  } catch (e) {
    console.log(e);
  }
}

export async function get(uri: string, headers = {}) {
  return axios({
    url: uri,
    method: 'get',
    headers: headers,
  });
}

export async function getAuth(uri: string, token = null) {
  const token_ = token || getAuthToken();
  return get(uri, { Authorization: `Token ${token_}` });
}

export async function postAuth(uri, string, data: Object, token = null) {
  const token_ = token || getAuthToken();
  console.log(token_);
  return post(uri, data, { Authorization: `Token ${token_}` });
}
