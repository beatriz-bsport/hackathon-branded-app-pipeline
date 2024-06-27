import * as Sentry from '@sentry/react';

const DANGER_THRESHOLD_IN_MS = 200;
const MIN_BLOCK_TIME_IN_MS = 1000 * 10;
const MAX_CONSECUTIVE_CALLS = 30;

type Status = 'OK' | 'BLOCKED';

export class AxiosSafeLock {
  private statusStore: Map<string, Status>;

  private lastCalledStore: Map<string, Date>;

  private callCountStore: Map<string, number>;

  private hasReported = false;

  private blockTimeStore: Map<string, number>;

  constructor() {
    this.callCountStore = new Map();
    this.statusStore = new Map();
    this.lastCalledStore = new Map();
    this.blockTimeStore = new Map();
  }

  /**
   * Track the call and check if it should be blocked. If it should, locks it.
   */
  updateRequestStatus(url: string) {
    this.trackCall(url);
    if (this._shouldBlock(url)) {
      this.lockUrl(url);
    }
  }

  /**
   * Checks if an URL is flagged as blocked.
   */
  checkIsBlocked(url: string) {
    return this.statusStore.get(url) === 'BLOCKED';
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

  private _shouldBlock(url: string) {
    return (
      (this.callCountStore.get(url) ?? 0) > MAX_CONSECUTIVE_CALLS &&
      !this.checkIsBlocked(url)
    );
  }

  private _unblock(url: string) {
    this.statusStore.set(url, 'OK');
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
    setTimeout(() => {
      this.callCountStore.delete(url);
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
