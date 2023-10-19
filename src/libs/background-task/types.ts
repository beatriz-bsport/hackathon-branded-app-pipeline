export type BackgroundTask<ReturnedValue = unknown> = {
  uuid: string;
  status: number;
  task_name: string;
  return_value: ReturnedValue;
};

export type BackgroundTaskState = {
  byUuid: { [key: string]: BackgroundTask };
  loading: boolean;
  error?: Error;
};
