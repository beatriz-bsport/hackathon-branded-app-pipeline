import { createStore } from "zustand/vanilla";

import type { Fetch } from "@bsport/fetch";
import { bindStore } from "@bsport/store-base";

import type { UseBackgroundTaskParams } from "../background-task/use-background-task";

/**
 * A registration is the set of params forwarded to `useBackgroundTask` once the
 * task is mounted by `<BackgroundTaskHost />`. `uuid` is required because it is
 * the key under which the task lives in the store and in the React Query cache.
 */
export type BackgroundTaskRegistration = Omit<
  UseBackgroundTaskParams<unknown, unknown>,
  "fetch" | "uuid"
> & {
  uuid: string;
  fetch?: Fetch;
};

export type BackgroundTaskHostState = {
  tasks: BackgroundTaskRegistration[];
};

export const backgroundTaskHostStore = createStore<BackgroundTaskHostState>()(
  () => ({
    tasks: [],
  }),
);

export const useBackgroundTaskHostStore = bindStore(backgroundTaskHostStore);
