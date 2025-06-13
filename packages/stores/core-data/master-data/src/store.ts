import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { SportCategory } from "#src/types";

export interface sportCategoryState {
  byId: { [key: number]: SportCategory };
  ids: number[];
}

export const sportCategoryStore = createStore<sportCategoryState>()(() => ({
  byId: {},
  ids: [],
}));

export const useSportCategoryStore = bindStore(sportCategoryStore);
