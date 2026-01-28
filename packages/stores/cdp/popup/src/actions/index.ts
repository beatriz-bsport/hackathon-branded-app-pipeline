import { Result } from "typescript-result";

import {
  type Fetch,
  type Xhr,
  createErrorWithContext,
} from "@bsport/store-base";
import type { Action, XhrAction } from "@bsport/store-base";
import {
  BackgroundTask,
  fetchBackgroundTaskAction,
} from "@bsport/store-shared-background-task";

import { createSmartlistPopupAPI, fetchPopupsAPI } from "#src/api";
import type { CreateSmartlistPopupParams, Popup } from "#src/types";

import { setPopups } from "./store";

/**
 * Fetches a list of popups.
 */
export const fetchPopupsAction: Action<null, Popup[]> = async (fetch) => {
  const [uri, init] = fetchPopupsAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setPopups({
        popups: data,
      });

      return data;
    },
    (error) => createErrorWithContext(error, "Failed to fetch popups"),
  );
};

const createSmartlistPopupActionRaw: XhrAction<
  CreateSmartlistPopupParams,
  string | null
> = async (xhr, params) => {
  const [uri, init] = createSmartlistPopupAPI(params);
  return Result.try(
    async () => {
      const { backgroundTaskUuid } = await xhr(uri, init);
      return backgroundTaskUuid;
    },
    (error) => createErrorWithContext(error, "Failed to create popup"),
  );
};

const getCreationResult: Action<string, BackgroundTask<Popup>> = async (
  fetch,
  uuid,
) => {
  const fetchBackgroundTask = fetchBackgroundTaskAction.bind(null, fetch);

  return Result.try(
    () =>
      new Promise<BackgroundTask<Popup>>((resolve, reject) => {
        fetchBackgroundTask({
          uuid,
          callbacks: {
            onSuccess: (taskResult: BackgroundTask<unknown>) => {
              resolve(taskResult as BackgroundTask<Popup>);
            },
            onTaskFailure: () => {
              reject(new Error("Background task failed to complete"));
            },
            onEndpointFailure: () => {
              reject(new Error("Failed to reach background task endpoint"));
            },
            onTimeout: () => {
              reject(new Error("Background task timed out"));
            },
          },
        });
      }),
    (error) =>
      createErrorWithContext(error, "Failed to get popup creation result"),
  );
};

/**
 * Creates a smartlist popup
 */
export const createSmartlistPopupAction = async (
  params: CreateSmartlistPopupParams,
  xhr: Xhr<string | null>,
  fetchBgTask: Fetch<BackgroundTask<Popup>>,
  fetchList: Fetch<Popup[]>,
) => {
  const createSmartlistPopup = async (
    params: CreateSmartlistPopupParams,
  ): Promise<Result<string | null, Error>> => {
    return createSmartlistPopupActionRaw(xhr, {
      ...params,
    });
  };

  const createResult = await createSmartlistPopup(params);

  if (createResult.error) {
    return Result.error(
      createErrorWithContext(createResult.error, "Failed to create popup"),
    );
  }

  const backgroundTaskUuid = createResult.value;

  if (!backgroundTaskUuid) {
    return Result.error(
      createErrorWithContext(
        new Error("Background task UUID is null"),
        "Failed to create popup",
      ),
    );
  }

  const taskResult = await getCreationResult(fetchBgTask, backgroundTaskUuid);

  if (taskResult.error) {
    return Result.error(
      createErrorWithContext(taskResult.error, "Failed to get created popup"),
    );
  }

  const task = taskResult.value;
  if (!task) {
    return Result.error(
      createErrorWithContext(
        new Error("Background task result is undefined"),
        "Failed to get created popup",
      ),
    );
  }

  const popup = task.return_value;

  await fetchPopupsAction(fetchList, null);

  return Result.ok(popup);
};
