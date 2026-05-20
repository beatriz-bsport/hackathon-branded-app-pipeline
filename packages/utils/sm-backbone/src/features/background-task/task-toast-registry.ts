import { dismissToast } from "@bsport/kaizen-primitive-core";

/**
 * Module-level registry keyed by task uuid.
 * Every effect first checks "does a toast already exist
 * for this task?" before opening one, so duplicates are impossible.
 */
type TaskToastState = {
  processingToastId: string | null;
  successToastId: string | null;
  errorToastId: string | null;
  timeoutToastId: string | null;
};

const taskToastRegistry = new Map<string, TaskToastState>();

export const getTaskToastState = (uuid: string): TaskToastState => {
  const existing = taskToastRegistry.get(uuid);
  if (existing) return existing;
  const fresh: TaskToastState = {
    processingToastId: null,
    successToastId: null,
    errorToastId: null,
    timeoutToastId: null,
  };
  taskToastRegistry.set(uuid, fresh);
  return fresh;
};

export const dismissProcessingToast = (state: TaskToastState) => {
  if (state.processingToastId) {
    dismissToast(state.processingToastId);
    state.processingToastId = null;
  }
};

/**
 * Drop the toast bookkeeping for a finished task. Call this at the task
 * lifecycle boundary (see `unregisterBackgroundTask`) to keep the registry
 * from leaking forever.
 */
export const releaseBackgroundTaskToastState = (uuid: string): void => {
  taskToastRegistry.delete(uuid);
};
