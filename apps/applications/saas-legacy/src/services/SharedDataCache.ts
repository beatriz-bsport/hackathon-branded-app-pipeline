type CacheEntry<T> = {
  data: T;
  timestamp: number;
  ttl: number;
};

const PENDING_REQUEST_TIMEOUT_MS = 30000; // 30 seconds

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

const POLL_INTERVAL_MS = 100; // 100ms between polls

const MAX_POLL_ATTEMPTS = PENDING_REQUEST_TIMEOUT_MS / POLL_INTERVAL_MS; // 300 attempts

/**
 * SharedDataCache is a singleton class that provides caching functionality
 * for shared data across widgets. It uses localStorage to store
 * cached data with a time-to-live (TTL) mechanism.
 */
class SharedDataCache {
  private static instance: SharedDataCache;

  /**
   * Singleton instance of SharedDataCache
   * Use SharedDataCache.getInstance() to access the instance
   */
  private constructor() {}

  static getInstance(): SharedDataCache {
    if (!SharedDataCache.instance) {
      SharedDataCache.instance = new SharedDataCache();
    }
    return SharedDataCache.instance;
  }

  private isExpired<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  getCacheKey(type: string, id?: string | number): string {
    return id ? `bsport_${type}_${id}` : `bsport_${type}`;
  }

  private getFromCache<T>(cacheKey: string): T | null {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const entry: CacheEntry<T> = JSON.parse(cached);

      if (this.isExpired<T>(entry)) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.warn('SharedDataCache: Error reading from cache', error);
      return null;
    }
  }

  private setCache<T>({
    cacheKey,
    data,
    ttl,
  }: {
    cacheKey: string;
    data: T;
    ttl: number;
  }): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch (error) {
      console.warn('SharedDataCache: Error writing to cache', error);
    }
  }

  private getPendingRequest(cacheKey: string) {
    const pendingRequest = localStorage.getItem(`bsport_pending_${cacheKey}`);

    return pendingRequest ? parseInt(pendingRequest) : null;
  }

  private isPendingRequest(cacheKey: string): boolean {
    const pendingRequest = this.getPendingRequest(cacheKey);
    const now = Date.now();
    return (
      pendingRequest !== null &&
      now - pendingRequest < PENDING_REQUEST_TIMEOUT_MS
    );
  }

  private setPendingRequest(cacheKey: string): void {
    localStorage.setItem(`bsport_pending_${cacheKey}`, Date.now().toString());
  }

  private clearPendingRequest(cacheKey: string): void {
    localStorage.removeItem(`bsport_pending_${cacheKey}`);
  }

  private async pollForResult<T>(
    cacheKey: string,
    maxAttempts: number = MAX_POLL_ATTEMPTS,
  ): Promise<T | null> {
    let attempts = 0;

    return new Promise<T | null>((resolve) => {
      const poll = () => {
        // Check if data is now available in cache
        const cached = this.getFromCache<T>(cacheKey);
        if (cached) {
          resolve(cached);
          return;
        }

        // Check if request is still pending
        const pendingTimestamp = this.getPendingRequest(cacheKey);
        const isPending =
          pendingTimestamp &&
          Date.now() - pendingTimestamp < PENDING_REQUEST_TIMEOUT_MS;

        attempts++;

        if (isPending && attempts < maxAttempts) {
          // Still pending and within retry limits, continue polling
          setTimeout(poll, POLL_INTERVAL_MS);
        } else {
          this.clearPendingRequest(cacheKey);
          resolve(null);
        }
      };

      poll();
    });
  }

  async fetchWithCache<T>({
    cacheKey,
    fetchFn,
    ttl = DEFAULT_TTL_MS,
  }: {
    cacheKey: string;
    fetchFn: () => Promise<T>;
    ttl?: number; // 5 minutes default
  }): Promise<T> {
    // Check cache first
    const cached = this.getFromCache<T>(cacheKey);

    if (cached) {
      return cached;
    }

    if (this.isPendingRequest(cacheKey)) {
      const polledResult = await this.pollForResult<T>(cacheKey);
      if (polledResult) {
        return polledResult;
      }
    }

    // Make the request
    const promise = fetchFn()
      .then((data) => {
        this.setCache({ cacheKey, data, ttl });
        this.clearPendingRequest(cacheKey);
        return data;
      })
      .catch((error) => {
        this.clearPendingRequest(cacheKey);
        throw error;
      });

    this.setPendingRequest(cacheKey);
    return promise;
  }
}

export default SharedDataCache;
