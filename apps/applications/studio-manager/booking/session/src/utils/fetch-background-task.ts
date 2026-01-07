import { fetchBackgroundTaskAction } from "@bsport/store-shared-background-task";

export const BACKGROUND_TASK_ERRORS = {
  TASK_FAILURE: "Background task failed to complete",
  ENDPOINT_FAILURE: "Failed to reach background task endpoint",
  TIMEOUT: "Background task timed out",
};

export const waitForBackgroundTask = (
  uuid: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchFn: any,
): Promise<string> => {
  const fetchBackgroundTask = fetchBackgroundTaskAction.bind(null, fetchFn);

  return new Promise((resolve, reject) => {
    fetchBackgroundTask({
      uuid,
      callbacks: {
        onSuccess: () => resolve(uuid),
        onTaskFailure: () =>
          reject(new Error(BACKGROUND_TASK_ERRORS.TASK_FAILURE)),
        onEndpointFailure: () =>
          reject(new Error(BACKGROUND_TASK_ERRORS.ENDPOINT_FAILURE)),
        onTimeout: () => reject(new Error(BACKGROUND_TASK_ERRORS.TIMEOUT)),
      },
    });
  });
};
