import axios from 'axios';

let authToken = '';

export function setAuthToken(token: string) {
  authToken = token;
}

export function getAuthToken(): ?string {
  return authToken;
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

export async function fget(uri: string, headers: Object) {
  const baseHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  try {
    const response = await axios.get(uri, {
      headers: Object.assign(baseHeaders, headers || {}),
    });
    return response.json();
  } catch (e) {
    console.log(e);
  }
}

export async function getAuth(uri: string) {
  const token = getAuthToken();
  return get(uri, { Authorization: `Token ${token}` });
}
