import moment from 'moment-timezone';

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
  if (!token || token === 'null') {
    storage.setItem('http:token', token);
    storage.removeItem('bsport:franchise:http:token');
  }
  storage.setItem('bsport:http:token', token);
}

export function setAccessControlBroadcastsChannelId(uuid: string) {
  if (!uuid || uuid === 'null') {
    storage.removeItem('bsport:accm-channel:id');
    return;
  }
  storage.setItem('bsport:accm-channel:id', uuid);
}

export function getCookie(name: string) {
  const values = document.cookie.split(';').map((s) => s.split('='));
  const item = values.find((c) => c[0].trim() === name);
  return item && item[1];
}

export const getTimezoneName = () => {
  return moment().tz() || 'Europe/Paris';
};

export function getAuthToken() {
  const oldToken = storage.getItem('http:token');
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
