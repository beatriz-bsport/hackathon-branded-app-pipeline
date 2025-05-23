import { Result } from "typescript-result";

import type { Fetch } from "@bsport/store-base";

import { fetchBackgroundTaskAPI } from "#src/api";
import type { BackgroundTask } from "#src/types";

import { type Callbacks, performRecursiveFetch } from "./recursive-fetch";

/**
 * Fetch recursively the background task corresponding to the provided uuid.
 *
 * @description
 * The callbacks input provides a way to trigger functions on different events
 * - onSuccess : background task has status 1 (success)
 * - onTaskFailure : when the background task has status 2 (failure)
 * - onEndpointFailure : when the HTTP request fails
 * - onTimeout : when the number of recursive calls has come to an end without
 *   the background task being finished
 * You can type the return_value expected in your BackgroundTask with
 * - ReturnValueSuccess : type of return_value when the background task has succeeded (status 1)
 * - ReturnValueFailure : type of return_value when the background task has failed (status 2)
 */
export const fetchBackgroundTaskAction = async <
  ReturnValueSuccess = unknown,
  ReturnValueFailure = unknown,
>(
  fetch: Fetch<BackgroundTask<ReturnValueSuccess | ReturnValueFailure>>,
  params: {
    uuid: string;
    callbacks?: Callbacks<ReturnValueSuccess, ReturnValueFailure>;
  },
): Promise<Result<void, Error>> => {
  const [uri, init] = fetchBackgroundTaskAPI({ uuid: params.uuid });

  return Result.try(
    async () => {
      await performRecursiveFetch<ReturnValueSuccess, ReturnValueFailure>({
        uuid: params.uuid,
        timeoutIndex: 0,
        retryOnFailIndex: 0,
        performFetch: () => fetch(uri, init),
        callbacks: params.callbacks ?? {},
      });
    },
    (error) => new Error("Failed to fetch backgroundTask", { cause: error }),
  );
};
