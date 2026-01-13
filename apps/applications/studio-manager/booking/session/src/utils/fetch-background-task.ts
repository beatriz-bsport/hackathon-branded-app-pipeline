import { Fetch } from "@bsport/fetch";
import { dismissToast } from "@bsport/kaizen-primitive-core";
import { fetchBackgroundTaskAction } from "@bsport/store-shared-background-task";

import { useAddProcessingToast } from "./processing-toast";

export const BACKGROUND_TASK_ERRORS = {
  TASK_FAILURE: "Background task failed to complete",
  ENDPOINT_FAILURE: "Failed to reach background task endpoint",
  TIMEOUT: "Background task timed out",
};

export const useWaitForBackgroundTask = (fetchFn: Fetch) => {
  const addProcessingToast = useAddProcessingToast();

  return (uuid: string): Promise<string> => {
    const fetchBackgroundTask = fetchBackgroundTaskAction.bind(null, fetchFn);

    const toastId = addProcessingToast();

    return new Promise((resolve, reject) => {
      fetchBackgroundTask({
        uuid,
        callbacks: {
          onSuccess: () => {
            resolve(uuid);
            dismissToast(toastId);
          },
          onTaskFailure: () => {
            reject(new Error(BACKGROUND_TASK_ERRORS.TASK_FAILURE));
            dismissToast(toastId);
          },
          onEndpointFailure: () => {
            reject(new Error(BACKGROUND_TASK_ERRORS.ENDPOINT_FAILURE));
            dismissToast(toastId);
          },
          onTimeout: () => {
            reject(new Error(BACKGROUND_TASK_ERRORS.TIMEOUT));
            dismissToast(toastId);
          },
        },
      });
    });
  };
};
