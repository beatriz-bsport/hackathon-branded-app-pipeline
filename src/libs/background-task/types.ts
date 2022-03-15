export type BackgroundTask = {
  uuid: string;
  status: number;
  readable_identifier: string;
};

export type BackgroundTaskState = {
  byUuid: { [key: string]: BackgroundTask };
  loading: boolean;
  error?: Error;
};
