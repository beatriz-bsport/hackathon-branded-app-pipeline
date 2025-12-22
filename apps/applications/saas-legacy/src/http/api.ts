import originalAxios, { CancelToken, AxiosRequestConfig } from 'axios';
import * as Sentry from '@sentry/react';
import { setSessionId } from '../sentry/session';
import { setTransactionId } from '../sentry/transaction';

import {
  getBsportRequestFromHeader,
  getTimezoneName,
  getAuthToken,
} from './utils';
// @ts-expect-error
import i18n from '../i18n';
import type {
  AxiosLockOptions,
  GetAuth,
  PatchAuth,
  Post,
  PostAuth,
  PostBase,
  PostBaseAuth,
  PutAuth,
} from './types';
import { ProtectedAxiosBuilder } from './protectedAxios';
import { sendWithProxyBridge } from './bridgeClient';
import { shouldUseBridge } from '#src/libs/widget/bridge';

const axios = new ProtectedAxiosBuilder(originalAxios).protectedAxios;

/**
 * @deprecated This version is not type safe.
 */
export const postBaseDeprecated = postBase as PostBase<any, any>;

export async function postBase<T = unknown, D = unknown>(
  uri: string,
  data: D,
  headers: AxiosRequestConfig['headers'],
  cancelToken?: AxiosRequestConfig['cancelToken'],
  lockOptions?: AxiosLockOptions,
) {
  const baseHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-bsport-log-collection': 'true',
    ...createBaseHeaders(),
    ...getBsportRequestFromHeader(),
  };

  try {
    const response = await axios.post<T>(
      uri,
      data,
      {
        headers: Object.assign(baseHeaders, headers),
        cancelToken,
      },
      lockOptions,
    );
    return response;
  } catch (err) {
    if (err?.response?.status >= 500 && err?.response?.status < 600) {
      Sentry.captureException(err);
    }
    throw err;
  }
}

/**
 * @deprecated This version is not type safe.
 */
export const postDeprecated = post as Post<any, any>;

export async function post<T = unknown, D = unknown>(
  uri: string,
  data?: D,
  headers?: AxiosRequestConfig['headers'],
  cancelToken?: AxiosRequestConfig['cancelToken'],
  lockOptions?: AxiosLockOptions,
) {
  const baseHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-bsport-log-collection': 'true',
    ...createBaseHeaders(),
    ...getBsportRequestFromHeader(),
  };

  try {
    const response = await axios.post<T>(
      uri,
      data,
      {
        headers: Object.assign(baseHeaders, headers),
        cancelToken,
      },
      lockOptions,
    );

    return response;
  } catch (err) {
    if (err?.response?.status >= 500 && err?.response?.status < 600) {
      Sentry.captureException(err);
    }
    throw err;
  }
}

export async function put<T = unknown, D = unknown>(
  uri: string,
  data: D,
  headers: AxiosRequestConfig['headers'],
  cancelToken?: AxiosRequestConfig['cancelToken'],
  lockOptions?: AxiosLockOptions,
) {
  const baseHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-bsport-log-collection': 'true',
    ...createBaseHeaders(),
    ...getBsportRequestFromHeader(),
  };

  try {
    const response = await axios.put<T>(
      uri,
      data,
      {
        headers: Object.assign(baseHeaders, headers),
        cancelToken,
      },
      lockOptions,
    );
    return response;
  } catch (err) {
    if (err?.response?.status >= 500 && err?.response?.status < 600) {
      Sentry.captureException(err);
    }
    throw err;
  }
}

export async function patch<T = unknown, D = unknown>(
  uri: string,
  data: D,
  headers: AxiosRequestConfig['headers'],
  cancelToken?: AxiosRequestConfig['cancelToken'],
  lockOptions?: AxiosLockOptions,
) {
  const baseHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-bsport-log-collection': 'true',
    ...createBaseHeaders(),
    ...getBsportRequestFromHeader(),
  };

  try {
    const response = await axios.patch<T>(
      uri,
      data,
      {
        headers: Object.assign(baseHeaders, headers),
        cancelToken,
      },
      lockOptions,
    );
    return response;
  } catch (err) {
    if (err?.response?.status >= 500 && err?.response?.status < 600) {
      Sentry.captureException(err);
    }
    throw err;
  }
}

async function delete_<D = unknown>(
  uri: string,
  data: D,
  headers: AxiosRequestConfig['headers'],
  cancelToken?: AxiosRequestConfig['cancelToken'],
) {
  const baseHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-bsport-log-collection': 'true',
    ...createBaseHeaders(),
    ...getBsportRequestFromHeader(),
  };
  try {
    const response = await axios.delete(uri, {
      headers: Object.assign(baseHeaders, headers),
      cancelToken,
      data,
    });
    return response;
  } catch (err) {
    if (err?.response?.status >= 500 && err?.response?.status < 600) {
      Sentry.captureException(err);
    }
    throw err;
  }
}

export async function get<T = unknown>(
  uri: string,
  headers: AxiosRequestConfig['headers'] = {},
  cancelToken?: AxiosRequestConfig['cancelToken'],
  lockOptions?: AxiosLockOptions,
) {
  try {
    const response = await axios.get<T>(
      uri,
      {
        headers: {
          'Accept-Language': i18n.language || 'en',
          'X-bsport-log-collection': 'true',
          ...createBaseHeaders(),
          ...(headers || {}),
          ...getBsportRequestFromHeader(),
        },
        cancelToken,
      },
      lockOptions,
    );
    return response;
  } catch (err) {
    if (err?.response?.status >= 500 && err?.response?.status < 600) {
      Sentry.captureException(err);
    }
    throw err;
  }
}

export async function head<T = unknown>(
  uri: string,
  headers: AxiosRequestConfig['headers'] = {},
  cancelToken?: AxiosRequestConfig['cancelToken'],
  lockOptions?: AxiosLockOptions,
) {
  try {
    const response = await axios.head<T>(
      uri,
      {
        headers: {
          'Accept-Language': i18n.language || 'en',
          'X-bsport-log-collection': 'true',
          ...createBaseHeaders(),
          ...(headers || {}),
          ...getBsportRequestFromHeader(),
        },
        cancelToken,
      },
      lockOptions,
    );
    return response;
  } catch (err) {
    if (err?.response?.status >= 500 && err?.response?.status < 600) {
      Sentry.captureException(err);
    }
    throw err;
  }
}

/**
 * @deprecated This version is not type safe.
 */
export const getAuthDeprecated = getAuth as GetAuth<any>;

export async function getAuth<T = unknown>(
  uri: string,
  token?: string,
  cancelToken?: CancelToken,
  lockOptions?: AxiosLockOptions,
  headers?: AxiosRequestConfig['headers'],
) {
  if (shouldUseBridge()) {
    return sendWithProxyBridge<T>({
      url: uri,
      method: 'GET',
      cancelToken,
      headers,
      lockOptions,
    });
  }

  const token_ = token || getAuthToken();
  if (!token_ || token_ === 'null') {
    return get<T>(uri, {}, cancelToken);
  }
  return get<T>(
    uri,
    {
      'Accept-Language': i18n.language || 'en',
      ...createBaseAuthHeaders(token),
      ...(headers || {}),
    },
    cancelToken,
    lockOptions,
  );
}

/**
 * @deprecated This version is not type safe.
 */
export const postAuthDeprecated = postAuth as PostAuth<any, any>;

export async function postAuth<T = unknown, D = unknown>(
  uri: string,
  data?: D,
  token?: string,
  cancelToken?: AxiosRequestConfig['cancelToken'],
  lockOptions?: AxiosLockOptions,
  headers?: AxiosRequestConfig['headers'],
) {
  if (shouldUseBridge()) {
    return sendWithProxyBridge<T>({
      url: uri,
      method: 'POST',
      data,
      cancelToken,
      headers,
      lockOptions,
    });
  }
  return post<T>(
    uri,
    data,
    {
      ...createBaseAuthHeaders(token),
      ...(headers || {}),
    },
    cancelToken,
    lockOptions,
  );
}

/**
 * @deprecated This version is not type safe.
 */
export const postBaseAuthDeprecated = postBaseAuth as PostBaseAuth<any, any>;
export async function postBaseAuth<T = unknown, D = unknown>(
  uri: string,
  data: D,
  token?: string,
  cancelToken?: AxiosRequestConfig['cancelToken'],
  lockOptions?: AxiosLockOptions,
) {
  if (shouldUseBridge()) {
    return sendWithProxyBridge<T>({
      url: uri,
      method: 'POST',
      data,
      cancelToken,
      lockOptions,
    });
  }
  return postBase<T>(
    uri,
    data,
    createBaseAuthHeaders(token),
    cancelToken,
    lockOptions,
  );
}

/**
 * @deprecated This version is not type safe.
 */
export const putAuthDeprecated = putAuth as PutAuth<any, any>;
export async function putAuth<T = unknown, D = unknown>(
  uri: string,
  data?: D,
  cancelToken?: AxiosRequestConfig['cancelToken'],
) {
  if (shouldUseBridge()) {
    return sendWithProxyBridge<T>({
      url: uri,
      method: 'PUT',
      data,
      cancelToken,
    });
  }
  return put<T>(uri, data, createBaseAuthHeaders(), cancelToken);
}

/**
 * @deprecated This version is not type safe.
 */
export const patchAuthDeprecated = patchAuth as PatchAuth<any, any>;
export async function patchAuth<T = unknown, D = unknown>(
  uri: string,
  data: D,
  cancelToken?: AxiosRequestConfig['cancelToken'],
) {
  if (shouldUseBridge()) {
    return sendWithProxyBridge<T>({
      url: uri,
      method: 'PATCH',
      cancelToken,
    });
  }
  return patch<T>(uri, data, createBaseAuthHeaders(), cancelToken);
}

export async function deleteAuth<D = unknown>(
  uri: string,
  data?: D,
  cancelToken?: AxiosRequestConfig['cancelToken'],
) {
  if (shouldUseBridge()) {
    return sendWithProxyBridge({
      url: uri,
      method: 'DELETE',
      cancelToken,
    });
  }
  return delete_(uri, data || {}, createBaseAuthHeaders(), cancelToken);
}

export async function getJSONAuth(uri: string, token?: string) {
  const response = await get(uri, createBaseAuthHeaders(token));

  if (response.status !== 200 && response.status !== 201) {
    console.error(response);
    throw new Error(JSON.stringify(response));
  }

  return response.data;
}

const createBaseHeaders = () => ({
  'X-Transaction-ID': setTransactionId(),
  'X-Timezone-Name': getTimezoneName(),
  'X-Session-ID': setSessionId(),
  'X-React-Referrer': window.location.href.slice(0, 250),
});

const createBaseAuthHeaders = (token?: string) => {
  const token_ = token || getAuthToken();
  return {
    ...createBaseHeaders(),
    Authorization: `Token ${token_}`,
  };
};
