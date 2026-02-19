import { Settings } from 'luxon';

import {
  BSPORT_REQUEST_FROM_HEADER,
  BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
} from '../constants';
import {
  STORAGE_KEY_BSPORT_ACCM_CHANNEL_ID,
  STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_TOKEN,
  STORAGE_KEY_BSPORT_IMPERSONATED_TOKEN,
  STORAGE_KEY_BSPORT_TOKEN,
} from '#src/actions/constants';
import {
  getItemInStorage,
  removeItemInStorage,
  setItemInStorage,
} from '#src/utils/storage';

export const getBsportRequestFromHeader = () => {
  try {
    const storedValue = getItemInStorage(
      'session',
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
  const originTmpToken: string = getItemInStorage(
    'session',
    STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_TOKEN,
  );

  const isTokenInvalid = !token || token === 'null';
  const isOriginTmpTokenValid = originTmpToken && originTmpToken !== 'null';

  if (isTokenInvalid) {
    clearTokens();
  } else if (isOriginTmpTokenValid) {
    setItemInStorage('session', STORAGE_KEY_BSPORT_IMPERSONATED_TOKEN, token);
  } else {
    setItemInStorage('local', STORAGE_KEY_BSPORT_TOKEN, token);
  }
}

function clearTokens() {
  setItemInStorage('local', STORAGE_KEY_BSPORT_TOKEN, 'null');
  removeItemInStorage('session', STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_TOKEN);
  removeItemInStorage('session', STORAGE_KEY_BSPORT_IMPERSONATED_TOKEN);
}

export function setAccessControlBroadcastsChannelId(uuid: string) {
  if (!uuid || uuid === 'null') {
    removeItemInStorage('local', STORAGE_KEY_BSPORT_ACCM_CHANNEL_ID);
    return;
  }
  setItemInStorage('local', STORAGE_KEY_BSPORT_ACCM_CHANNEL_ID, uuid);
}

export const getTimezoneName = () => {
  return Settings.defaultZone.isValid
    ? Settings.defaultZone.name
    : 'Europe/Paris';
};

export function getAuthToken() {
  return (
    getItemInStorage('session', STORAGE_KEY_BSPORT_IMPERSONATED_TOKEN) ||
    getItemInStorage('local', STORAGE_KEY_BSPORT_TOKEN)
  );
}

export function getAuthTokenValue(): string | null {
  const token = getAuthToken();
  return token !== 'null' ? token : null;
}

export function getAccessControlBroadcastsChannelId() {
  return getItemInStorage('local', 'bsport:accm-channel:id');
}
