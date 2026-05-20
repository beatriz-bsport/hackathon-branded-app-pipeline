import { releaseBackgroundTaskToastState } from "../background-task/task-toast-registry";
import {
  type BackgroundTaskRegistration,
  backgroundTaskHostStore,
} from "./store";

/**
 * Registers a background task UUID with the mounted `<BackgroundTaskHost />`.
 *
 * Polling and toast lifecycle are then owned by the host (which lives at the
 * root of sm-host or of a standalone micro frontend), so the calling component
 * can unmount immediately without interrupting either one.
 *
 * Calling twice with the same UUID is a no-op.
 */
export const registerBackgroundTask = (
  registration: BackgroundTaskRegistration,
): void => {
  backgroundTaskHostStore.setState((state) => {
    if (state.tasks.some((task) => task.uuid === registration.uuid)) {
      return state;
    }
    return { tasks: [...state.tasks, registration] };
  });
};

export const unregisterBackgroundTask = (uuid: string): void => {
  backgroundTaskHostStore.setState((state) => ({
    tasks: state.tasks.filter((task) => task.uuid !== uuid),
  }));
  releaseBackgroundTaskToastState(uuid);
};
