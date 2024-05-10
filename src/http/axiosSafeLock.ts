import * as Sentry from '@sentry/react';
import { AxiosInstance } from 'axios';

const DANGER_THRESHOLD_IN_MS = 200;
const MIN_BLOCK_TIME_IN_MS = 1000 * 5;
const MAX_CONSECUTIVE_CALLS = 20;

type Status = 'OK' | 'BLOCKED';

export class AxiosSafeLock {
  private axiosInstance: AxiosInstance;

  private statusStore: Map<string, Status>;

  private lastCalledStore: Map<string, Date>;

  private callCountStore: Map<string, number>;

  private hasReported = false;

  private blockTimeStore: Map<string, number>;

  constructor(axiosInstance: AxiosInstance) {
    this.callCountStore = new Map();
    this.statusStore = new Map();
    this.lastCalledStore = new Map();
    this.axiosInstance = axiosInstance;
    this.blockTimeStore = new Map();
  }

  installLock() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const url = config.url || '';
        this.trackCall(url);

        if (this.checkIsBlocked(url)) {
          return Promise.reject(new Error('BLOCKED_REQUEST'));
        }

        if ((this.callCountStore.get(url) ?? 0) > MAX_CONSECUTIVE_CALLS) {
          this.lockUrl(url);
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.message === 'BLOCKED_REQUEST') {
          console.error('Could not reach URL, please try again later.');
          return new Promise((_, reject) => {
            reject(error);
          });
        }
        console.error(error);
        return Promise.reject(error);
      },
    );
  }

  private trackCall(url: string) {
    const now = new Date();

    const isDangerousCall =
      now.getTime() - (this.lastCalledStore.get(url) ?? now).getTime() <
      DANGER_THRESHOLD_IN_MS;

    const numberOfCalls = this.callCountStore.get(url) ?? 0;

    this.lastCalledStore.set(url, now);
    this.callCountStore.set(url, isDangerousCall ? numberOfCalls + 1 : 1);
  }

  private _unblock(url: string) {
    this.statusStore.set(url, 'OK');
  }

  private checkIsBlocked(url: string) {
    return this.statusStore.get(url) === 'BLOCKED';
  }

  private _incrementBlockTime(url: string) {
    const blockTime = this._getBlockedTime(url);
    this.blockTimeStore.set(url, 2 * blockTime);
  }

  private unlockUrl(url: string) {
    this._unblock(url);
  }

  private _getBlockedTime(url: string) {
    return this.blockTimeStore.get(url) ?? MIN_BLOCK_TIME_IN_MS;
  }

  private lockUrl(url: string) {
    this._block(url);
    this.callCountStore.delete(url);
    setTimeout(() => {
      this.unlockUrl(url);
    }, this._getBlockedTime(url));
    this._incrementBlockTime(url);
  }

  private _block(url: string) {
    this.statusStore.set(url, 'BLOCKED');
    if (!this.hasReported) {
      Sentry.captureException(
        new Error(`Blocked ${url} due to too many requests in a short time.`),
      );
      this.hasReported = true;
    }
  }
}
