import { BACKGROUND_TASK_STATUSES } from "./constants";

export type BackgroundTaskStatus =
  (typeof BACKGROUND_TASK_STATUSES)[keyof typeof BACKGROUND_TASK_STATUSES];

export type BackgroundTask<T = unknown> = {
  uuid: string;
  task_name: string;
  status: BackgroundTaskStatus;
  error_detail?: string;
  return_value: T;
};

export type BackgroundTaskPollingState = {
  active: boolean;
  hasTimeout: boolean;
  nextDelay: number | false;
  elapsedMs: number;
  refetchCount: number;
};

export type BackgroundTaskQueryData<
  ReturnValueSuccess = unknown,
  ReturnValueFailure = unknown,
> = {
  task: BackgroundTask<ReturnValueSuccess | ReturnValueFailure>;
  polling: BackgroundTaskPollingState;
};
