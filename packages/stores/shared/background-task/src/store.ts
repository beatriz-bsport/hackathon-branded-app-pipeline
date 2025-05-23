import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { BackgroundTask } from "#src/types";

export interface BackgroundTaskState {
  byId: { [key: string]: BackgroundTask & { timeout?: boolean } };
}

export const backgroundTaskStore = createStore<BackgroundTaskState>()(() => ({
  byId: {},
}));

/**
 * @description
 * You can :
 * - Retrieve a specific item from the store by providing a selector (1st arg) :
 *   ```tsx
 *   const backgroundTask = useBackgroundTaskStore(state => selector(state, uuid));
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const backgroundTasks = useBackgroundTaskStore(selector, (a, b) => a.id === b.id);
 *   ```
 */
export const useBackgroundTaskStore = bindStore(backgroundTaskStore);
