// @flow

import axios from 'axios';

const moment = require('moment-timezone');
import Config from './config';

import { setSessionId } from './sentry/session';
import { setTransactionId } from './sentry/transaction';

import i18n from './i18n';

const storage = window.localStorage;

export const BASE_URI: string = Config.REACT_APP_BASE_URI;
export const API_URI: string = `${BASE_URI}/api-v0`;
export const API_V1_URI: string = `${BASE_URI}/api/v1`;
export const PAYMENT_URI: string = `${BASE_URI}/payment`;

export function buildUrlParams(params: any) {
  if (params) {
    const conditions = [];
    for (const k in params) {
      // eslint-disable-next-line
      if (params.hasOwnProperty(k)) {
        if (Array.isArray(params[k])) {
          conditions.push(`${k}=${params[k].join(',')}`);
        } else {
          conditions.push(`${k}=${params[k]}`);
        }
      }
    }
    return `?${conditions.join('&')}`;
  }
  return '';
}

export function setAuthToken(token: string) {
  storage.setItem('http:token', token);
}

export function getCookie(name) {
  const values = document.cookie.split(';').map((s) => s.split('='));
  const item = values.find((c) => c[0].trim() === name);
  return item && item[1];
}

const getTimezoneName = () => {
  return moment().tz() || 'Europe/Paris';
};

export function getAuthToken() {
  return storage.getItem('http:token') || getCookie('auth_token');
}

export async function postBase(uri: string, data: Object, headers: Object) {
  const baseHeaders = {
    'X-Transaction-ID': setTransactionId(),
    'X-Timezone-Name': getTimezoneName(),
    'X-Session-ID': setSessionId(),
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return axios.post(uri, data, {
    headers: Object.assign(baseHeaders, headers),
  });
}
export async function post(uri: string, data?: Object, headers?: Object) {
  const baseHeaders = {
    'X-Transaction-ID': setTransactionId(),
    'X-Timezone-Name': getTimezoneName(),
    'X-Session-ID': setSessionId(),
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const response = await axios.post(uri, data, {
    headers: Object.assign(baseHeaders, headers),
  });
  return response;
}

export async function put(uri: string, data: Object, headers: Object) {
  const baseHeaders = {
    'X-Transaction-ID': setTransactionId(),
    'X-Timezone-Name': getTimezoneName(),
    'X-Session-ID': setSessionId(),
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return axios.put(uri, data, {
    headers: Object.assign(baseHeaders, headers),
  });
}

export async function patch(uri: string, data: Object, headers: Object) {
  const baseHeaders = {
    'X-Transaction-ID': setTransactionId(),
    'X-Timezone-Name': getTimezoneName(),
    'X-Session-ID': setSessionId(),
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return axios.patch(uri, data, {
    headers: Object.assign(baseHeaders, headers),
  });
}

export async function delete_(uri: string, data, headers: Object) {
  const baseHeaders = {
    'X-Transaction-ID': setTransactionId(),
    'X-Timezone-Name': getTimezoneName(),
    'X-Session-ID': setSessionId(),
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return axios({
    url: uri,
    method: 'delete',
    headers: Object.assign(baseHeaders, headers),
    data,
  });
}

export async function get(uri: string, headers: {} = {}) {
  return axios({
    url: uri,
    method: 'get',
    headers,
  });
}

export async function getAuth(uri: string, token?: string) {
  const token_ = token || getAuthToken();
  if (!token_ || token_ === 'null') {
    return get(uri);
  }
  return get(uri, {
    'Accept-Language': i18n.language || 'en',
    'X-Transaction-ID': setTransactionId(),
    'X-Timezone-Name': getTimezoneName(),
    'X-Session-ID': setSessionId(),
    Authorization: `Token ${token_}`,
  });
}

export async function postAuth(uri: string, data?: Object, token?: string) {
  const token_ = token || getAuthToken();
  return post(uri, data, {
    'X-Transaction-ID': setTransactionId(),
    'X-Timezone-Name': getTimezoneName(),
    'X-Session-ID': setSessionId(),
    Authorization: `Token ${token_}`,
  });
}

export async function postBaseAuth(uri: string, data: Object, token?: string) {
  const token_ = token || getAuthToken();
  return postBase(uri, data, {
    'X-Transaction-ID': setTransactionId(),
    'X-Timezone-Name': getTimezoneName(),
    'X-Session-ID': setSessionId(),
    Authorization: `Token ${token_}`,
  });
}

export async function putAuth(uri: string, data?: Object) {
  const token = getAuthToken();
  return put(uri, data, {
    'X-Transaction-ID': setTransactionId(),
    'X-Timezone-Name': getTimezoneName(),
    'X-Session-ID': setSessionId(),
    Authorization: `Token ${token}`,
  });
}

export async function patchAuth(uri: string, data: Object) {
  const token = getAuthToken();
  return patch(uri, data, {
    'X-Transaction-ID': setTransactionId(),
    'X-Timezone-Name': getTimezoneName(),
    'X-Session-ID': setSessionId(),
    Authorization: `Token ${token}`,
  });
}

export async function deleteAuth(uri: string, data?: any) {
  const token = getAuthToken();
  return delete_(uri, data || {}, {
    'X-Transaction-ID': setTransactionId(),
    'X-Timezone-Name': getTimezoneName(),
    'X-Session-ID': setSessionId(),
    Authorization: `Token ${token}`,
  });
}

export async function getJSONAuth(uri: string, token?: string) {
  const token_ = token || getAuthToken();
  const response = await get(uri, {
    'X-Transaction-ID': setTransactionId(),
    'X-Timezone-Name': getTimezoneName(),
    'X-Session-ID': setSessionId(),
    Authorization: `Token ${token_}`,
  });

  if (response.status !== 200 && response.status !== 201) {
    console.error(response);
    throw new Error(JSON.stringify(response));
  }

  return response.data;
}
