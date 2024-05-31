import { Settings } from 'luxon';

import {
  BSPORT_REQUEST_FROM_HEADER,
  BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
} from '../constants';

const storage = window.localStorage;
const sessionStorage = window.sessionStorage;

export const getBsportRequestFromHeader = () => {
  try {
    const storedValue = sessionStorage.getItem(
      BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
    );
    return storedValue ? { [BSPORT_REQUEST_FROM_HEADER]: storedValue } : {};
  } catch (err) {
    console.error(err);
    return {};
  }
};

export function parseQueryString(url: string): Record<string, string> {
  const pos = url.lastIndexOf('?');
  if (pos === -1) {
    return {};
  }

  const qs = url.substring(pos + 1);

  const params = qs.split('&').map((q) => q.split('=').map(decodeURIComponent));

  const q = {};
  params.forEach(([name, value]) => {
    // @ts-expect-error
    q[name] = value;
  });

  return q;
}

export function parseQueryStringWhithoutDecode(url: string) {
  const pos = url.lastIndexOf('?');
  if (pos === -1) {
    return {};
  }

  const qs = url.substring(pos + 1);

  const params = qs.split('&').map((q) => q.split('='));

  const q = {};
  params.forEach(([name, value]) => {
    // @ts-expect-error
    q[name] = value;
  });

  return q;
}

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
  const localStorageToken: string = storage.getItem('bsport:http:token');

  const isTokenInvalid = !token || token === 'null';
  const isLocalStorageTokenValid =
    localStorageToken && localStorageToken !== 'null';

  if (isTokenInvalid) {
    clearTokens();
  } else if (isLocalStorageTokenValid) {
    sessionStorage.setItem('http:token', token);
  } else {
    storage.setItem('bsport:http:token', token);
  }
}

function clearTokens() {
  storage.setItem('http:token', 'null');
  storage.setItem('bsport:http:token', 'null');
  sessionStorage.removeItem('bsport:franchise:http:token');
  sessionStorage.removeItem('http:token');
}

export function setAccessControlBroadcastsChannelId(uuid: string) {
  if (!uuid || uuid === 'null') {
    storage.removeItem('bsport:accm-channel:id');
    return;
  }
  storage.setItem('bsport:accm-channel:id', uuid);
}

export const getTimezoneName = () => {
  return Settings.defaultZone.isValid
    ? Settings.defaultZone.name
    : 'Europe/Paris';
};

// TODO (Impersonate - BS-3649) : should update this function if I change from the localStorage to the sessionStorage
export function getAuthToken() {
  const oldToken = storage.getItem('http:token');
  const sessionToken = sessionStorage.getItem('http:token');

  if (sessionToken) {
    return sessionToken;
  }
  if (oldToken && oldToken !== 'null' && oldToken !== 'undefined') {
    return (
      storage.getItem('http:token') || storage.getItem('bsport:http:token')
    );
  }
  return storage.getItem('bsport:http:token');
}

export function getAccessControlBroadcastsChannelId() {
  return storage.getItem('bsport:accm-channel:id');
}
