// @ts-nocheck
export type BackgroundTask = {
  uuid: string;
  status: number;
  task_name: string;
  return_value: any;
};

export type BackgroundTaskState = {
  byUuid: { [key: string]: BackgroundTask };
  loading: boolean;
  error?: Error;
};
