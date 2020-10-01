// @flow

export type BackgroundTask = {
  uuid: string,
  status: boolean,
  readable_identifier: string,
};

export type BackgroundTaskState = {
  byUuid: { [string]: BackgroundTask },
  loading: boolean,
  error: ?Error,
};
