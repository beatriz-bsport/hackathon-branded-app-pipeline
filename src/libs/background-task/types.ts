export type BackgroundTask = {
  uuid: string;
  status: boolean;
  readable_identifier: string;
};

export type BackgroundTaskState = {
  byUuid: { [key: string]: BackgroundTask };
  loading: boolean;
  error?: Error;
};
