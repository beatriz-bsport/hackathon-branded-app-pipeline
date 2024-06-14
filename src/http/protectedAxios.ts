import { AxiosSafeLock } from './axiosSafeLock';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { AxiosLockOptions, SafeAxiosInstance } from './types';

export class ProtectedAxiosBuilder {
  private AxiosLocker: AxiosSafeLock;
  private axiosInstance: AxiosInstance;
  private shouldBlockRequests: boolean;
  protectedAxios: SafeAxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
    this.AxiosLocker = new AxiosSafeLock();
    this.protectedAxios = axiosInstance;
    this.shouldBlockRequests = false;

    this.augmentAxiosInstance();
  }

  private augmentAxiosInstance() {
    this.protectedAxios = this.axiosInstance;
    const originalGet = this.axiosInstance.get;
    const originalPost = this.axiosInstance.post;
    const originalPut = this.axiosInstance.put;
    const originalDelete = this.axiosInstance.delete;
    const originalPatch = this.axiosInstance.patch;

    this.protectedAxios.get = <T = any>(
      url: string,
      config?: AxiosRequestConfig,
      options?: AxiosLockOptions,
    ): Promise<AxiosResponse<T>> => {
      if (options?.bypassLock)
        return originalGet.call(this.axiosInstance, url, config);
      this.AxiosLocker.updateRequestStatus(url);
      const isUrlBlocked = this.AxiosLocker.checkIsBlocked(url);
      if (isUrlBlocked && this.shouldBlockRequests) {
        console.error(`Could not reach ${url}. Please try again later`);
        return;
      }

      return originalGet.call(this.axiosInstance, url, config);
    };

    this.protectedAxios.post = <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
      options?: AxiosLockOptions,
    ): Promise<AxiosResponse<T>> => {
      if (options?.bypassLock)
        return originalPost.call(this.axiosInstance, url, data, config);
      this.AxiosLocker.updateRequestStatus(url);
      const isUrlBlocked = this.AxiosLocker.checkIsBlocked(url);
      if (isUrlBlocked && this.shouldBlockRequests) {
        console.error(`Could not reach ${url}. Please try again later`);
        return;
      }

      return originalPost.call(this.axiosInstance, url, data, config);
    };

    this.protectedAxios.put = <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
      options?: AxiosLockOptions,
    ): Promise<AxiosResponse<T>> => {
      if (options?.bypassLock)
        return originalPut.call(this.axiosInstance, url, data, config);
      this.AxiosLocker.updateRequestStatus(url);
      const isUrlBlocked = this.AxiosLocker.checkIsBlocked(url);
      if (isUrlBlocked && this.shouldBlockRequests) {
        console.error(`Could not reach ${url}. Please try again later`);
        return;
      }

      return originalPut.call(this.axiosInstance, url, data, config);
    };

    this.protectedAxios.delete = (
      url: string,
      config?: AxiosRequestConfig,
      options?: AxiosLockOptions,
    ): Promise<AxiosResponse> => {
      if (options?.bypassLock)
        return originalDelete.call(this.axiosInstance, url, config);
      this.AxiosLocker.updateRequestStatus(url);
      const isUrlBlocked = this.AxiosLocker.checkIsBlocked(url);
      if (isUrlBlocked && this.shouldBlockRequests) {
        console.error(`Could not reach ${url}. Please try again later`);
        return;
      }

      return originalDelete.call(this.axiosInstance, url, config);
    };

    this.protectedAxios.patch = <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
      options?: AxiosLockOptions,
    ): Promise<AxiosResponse<T>> => {
      if (options?.bypassLock)
        return originalPatch.call(this.axiosInstance, url, data, config);
      this.AxiosLocker.updateRequestStatus(url);
      const isUrlBlocked = this.AxiosLocker.checkIsBlocked(url);
      if (isUrlBlocked && this.shouldBlockRequests) {
        console.error(`Could not reach ${url}. Please try again later`);
        return;
      }

      return originalPatch.call(this.axiosInstance, url, data, config);
    };
  }
}
