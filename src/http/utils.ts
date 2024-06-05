import { Settings } from 'luxon';

import {
  BSPORT_REQUEST_FROM_HEADER,
  BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
} from '../constants';
import {
  STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_TOKEN,
  STORAGE_KEY_BSPORT_IMPERSONATED_TOKEN,
  STORAGE_KEY_BSPORT_TOKEN,
} from '#src/actions/constants';

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
  const originTmpToken: string = sessionStorage.getItem(
    STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_TOKEN,
  );

  const isTokenInvalid = !token || token === 'null';
  const isOriginTmpTokenValid = originTmpToken && originTmpToken !== 'null';

  if (isTokenInvalid) {
    clearTokens();
  } else if (isOriginTmpTokenValid) {
    sessionStorage.setItem(STORAGE_KEY_BSPORT_IMPERSONATED_TOKEN, token);
  } else {
    storage.setItem(STORAGE_KEY_BSPORT_TOKEN, token);
  }
}

function clearTokens() {
  storage.setItem(STORAGE_KEY_BSPORT_TOKEN, 'null');
  sessionStorage.removeItem(STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_TOKEN);
  sessionStorage.removeItem(STORAGE_KEY_BSPORT_IMPERSONATED_TOKEN);
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

export function getAuthToken() {
  return (
    sessionStorage.getItem(STORAGE_KEY_BSPORT_IMPERSONATED_TOKEN) ||
    storage.getItem(STORAGE_KEY_BSPORT_TOKEN)
  );
}

export function getAccessControlBroadcastsChannelId() {
  return storage.getItem('bsport:accm-channel:id');
}
