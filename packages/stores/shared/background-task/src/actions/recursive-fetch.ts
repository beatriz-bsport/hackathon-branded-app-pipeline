import type { Fetch } from "@bsport/store-base";

import { BackgroundTask } from "#src/types";

import { markAsTimeout, updateBackgroundTask } from "./store";

const MAX_RETRY_ON_FAIL = 3;
const RETRY_ON_FAIL_DELAY = 3; // Seconds
const RETRY_TIMEOUTS = [1, 3, 6, ...Array(50).fill(10), 30, 60, 120, 180];

// Define status constants
const STATUS_SUCCESS = 1;
const STATUS_FAILURE = 2;

export type Callbacks<ReturnValueSuccess, ReturnValueFailure> = {
  onSuccess?: (value: BackgroundTask<ReturnValueSuccess>) => void;
  onTimeout?: () => void;
  onTaskFailure?: (value: BackgroundTask<ReturnValueFailure>) => void;
  onEndpointFailure?: () => void;
};

export const performRecursiveFetch = async <
  ReturnValueSuccess,
  ReturnValueFailure,
>({
  uuid,
  performFetch,
  timeoutIndex,
  retryOnFailIndex,
  callbacks,
}: {
  uuid: string;
  performFetch: () => ReturnType<
    Fetch<BackgroundTask<ReturnValueSuccess | ReturnValueFailure>>
  >;
  timeoutIndex: number;
  retryOnFailIndex: number;
  callbacks: Callbacks<ReturnValueSuccess, ReturnValueFailure>;
}) => {
  // ----- Check before running that the indexes are correct -----
  if (timeoutIndex >= RETRY_TIMEOUTS.length) {
    markAsTimeout(uuid);
    callbacks?.onTimeout?.();
    return;
  }

  if (retryOnFailIndex >= MAX_RETRY_ON_FAIL) {
    callbacks?.onEndpointFailure?.();
    return;
  }

  // ----- Prepare next parameters -----
  let nextTimeoutIndex = timeoutIndex;
  let nextRetryOnFailIndex = retryOnFailIndex;
  let delay;

  // ----- Sync with backend -----
  try {
    const response = await performFetch();

    if (response.data.status === STATUS_SUCCESS) {
      updateBackgroundTask(response.data);
      callbacks?.onSuccess?.(
        response.data as BackgroundTask<ReturnValueSuccess>,
      );
      return;
    }

    if (response.data.status === STATUS_FAILURE) {
      updateBackgroundTask(response.data);
      callbacks?.onTaskFailure?.(
        response.data as BackgroundTask<ReturnValueFailure>,
      );
      return;
    }

    delay = RETRY_TIMEOUTS[timeoutIndex];
    nextTimeoutIndex = nextTimeoutIndex + 1;
  } catch (_error) {
    delay = RETRY_ON_FAIL_DELAY;
    nextRetryOnFailIndex = nextRetryOnFailIndex + 1;
  }

  // Verify before retry that indexes are correct (double check)
  if (nextTimeoutIndex >= RETRY_TIMEOUTS.length) {
    markAsTimeout(uuid);
    callbacks?.onTimeout?.();
    return;
  }

  if (nextRetryOnFailIndex >= MAX_RETRY_ON_FAIL) {
    callbacks?.onEndpointFailure?.();
    return;
  }

  // Retry
  const timeoutId = setTimeout(() => {
    performRecursiveFetch({
      uuid,
      performFetch,
      callbacks,
      retryOnFailIndex: nextRetryOnFailIndex,
      timeoutIndex: nextTimeoutIndex,
    });
  }, delay * 1000);

  // Return the timeout ID so it can be cleared if needed
  return timeoutId;
};
