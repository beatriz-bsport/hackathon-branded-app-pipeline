import { AxiosRequestConfig, AxiosResponse, CancelToken } from 'axios';

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
