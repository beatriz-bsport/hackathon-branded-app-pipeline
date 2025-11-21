import type {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  CancelToken,
} from 'axios';

export type PostBase<T = unknown, D = unknown> = (
  uri: string,
  data: D,
  headers: AxiosRequestConfig['headers'],
  cancelToken?: AxiosRequestConfig['cancelToken'],
) => Promise<AxiosResponse<T>>;

export type PostAuth<T = unknown, D = unknown> = (
  uri: string,
  data?: D,
  token?: string,
  cancelToken?: AxiosRequestConfig['cancelToken'],
  headers?: AxiosRequestConfig['headers'],
) => Promise<AxiosResponse<T>>;

export type Post<T = unknown, D = unknown> = (
  uri: string,
  data?: D,
  headers?: AxiosRequestConfig['headers'],
  cancelToken?: AxiosRequestConfig['cancelToken'],
) => Promise<AxiosResponse<T>>;

export type GetAuth<T = unknown> = (
  uri: string,
  token?: string,
  cancelToken?: CancelToken,
  headers?: AxiosRequestConfig['headers'],
) => Promise<AxiosResponse<T>>;

export type PutAuth<T = unknown, D = unknown> = (
  uri: string,
  data?: D,
  cancelToken?: AxiosRequestConfig['cancelToken'],
) => Promise<AxiosResponse<T>>;

export type PatchAuth<T = unknown, D = unknown> = (
  uri: string,
  data: D,
  cancelToken?: AxiosRequestConfig['cancelToken'],
) => Promise<AxiosResponse<T>>;

export type PostBaseAuth<T = unknown, D = unknown> = (
  uri: string,
  data?: D,
  token?: string,
  cancelToken?: AxiosRequestConfig['cancelToken'],
) => Promise<AxiosResponse<T>>;

export type AxiosLockOptions = {
  bypassLock?: boolean;
};

export interface SafeAxiosInstance extends AxiosInstance {
  get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
    options?: AxiosLockOptions,
  ): AxiosPromise<T>;
  head<T = any>(
    url: string,
    config?: AxiosRequestConfig,
    options?: AxiosLockOptions,
  ): AxiosPromise<T>;
  delete(
    url: string,
    config?: AxiosRequestConfig,
    options?: AxiosLockOptions,
  ): AxiosPromise;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    options?: AxiosLockOptions,
  ): AxiosPromise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    options?: AxiosLockOptions,
  ): AxiosPromise<T>;
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    options?: AxiosLockOptions,
  ): AxiosPromise<T>;
}
