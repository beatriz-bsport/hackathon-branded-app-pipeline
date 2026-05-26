import { memo } from "react";

import { fetch } from "#src/utils/fetch";

import { useBackgroundTask } from "../background-task";
import { unregisterBackgroundTask } from "./register-background-task";
import {
  type BackgroundTaskRegistration,
  useBackgroundTaskHostStore,
} from "./store";

type BackgroundTaskRunnerProps = {
  task: BackgroundTaskRegistration;
};

/**
 * Memoized so a host re-render doesn't restart polling or replay toast effects:
 * `task` keeps its identity across store updates (the registration object is
 * not replaced), so a default shallow prop check is enough.
 */
const BackgroundTaskRunner = memo(({ task }: BackgroundTaskRunnerProps) => {
  const {
    uuid,
    onSuccess,
    onError,
    onTimeout,
    fetch: injectedFetch,
    ...taskConfig
  } = task;
  useBackgroundTask({
    fetch: injectedFetch ?? fetch, // Use injected fetch instance (from app), else fallback to sm-backbone instance
    uuid,
    ...taskConfig,
    onSuccess: () => {
      try {
        onSuccess?.();
      } finally {
        unregisterBackgroundTask(uuid);
      }
    },
    onError: () => {
      try {
        onError?.();
      } finally {
        unregisterBackgroundTask(uuid);
      }
    },
    onTimeout: () => {
      try {
        onTimeout?.();
      } finally {
        unregisterBackgroundTask(uuid);
      }
    },
  });

  return null;
});
BackgroundTaskRunner.displayName = "BackgroundTaskRunner";

/**
 * Mount once at the root of the React tree in AppWrapper.
 * The host subscribes to every task registered via `registerBackgroundTask()` and
 * runs `useBackgroundTask` on each one, so polling and toasts survive
 * any consumer unmount or in-app navigation.
 * ```
 */
export const BackgroundTaskHost = () => {
  const tasks = useBackgroundTaskHostStore((state) => state.tasks);
  return (
    <>
      {tasks.map((task) => (
        <BackgroundTaskRunner key={task.uuid} task={task} />
      ))}
    </>
  );
};
