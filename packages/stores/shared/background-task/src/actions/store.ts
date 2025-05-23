import { backgroundTaskStore } from "#src/store";
import type { BackgroundTask } from "#src/types";

export const updateBackgroundTask = <T>(
  updatedBackgroundTask: BackgroundTask<T>,
) => {
  backgroundTaskStore.setState((state) => {
    if (!updatedBackgroundTask?.uuid) return state;

    const uuid = updatedBackgroundTask.uuid;

    if (!uuid) return state;

    return {
      byId: {
        ...state.byId,
        [uuid]: {
          ...updatedBackgroundTask,
          timeout: false,
        },
      },
    };
  });
};

export const markAsTimeout = (uuid: string) => {
  backgroundTaskStore.setState((state) => {
    const backgroundTask = state.byId[uuid];
    if (!backgroundTask) return state;

    return {
      byId: {
        ...state.byId,
        [uuid]: {
          ...backgroundTask,
          timeout: true,
        },
      },
    };
  });
};
