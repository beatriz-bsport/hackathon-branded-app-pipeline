import type { BackgroundTaskState } from "./store";

export const selectBackgroundTask = (
  state: BackgroundTaskState,
  uuid: string,
) => state.byId[uuid];
