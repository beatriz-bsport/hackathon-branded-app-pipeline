import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { sct } from "#src/types";

export interface sctState {
  byId: { [key: number]: sct };
  ids: number[];
}

export const sctStore = createStore<sctState>()(() => ({
  byId: {},
  ids: [],
}));

export const useSctStore = bindStore(sctStore);
