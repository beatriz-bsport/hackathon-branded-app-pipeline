import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { PrivateService } from "#src/types";

export interface PrivateServiceState {
  byId: { [key: number]: PrivateService };
  count: number;
  ids: number[];
  page: number;
  searchedResults: { [key: number]: PrivateService };
}

export const privateServiceStore = createStore<PrivateServiceState>()(() => ({
  byId: {},
  count: 0,
  ids: [],
  page: 1,
  searchedResults: {},
}));

export const usePrivateServiceStore = bindStore(privateServiceStore);
