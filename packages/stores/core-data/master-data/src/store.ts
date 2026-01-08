import { createStore } from "zustand/vanilla";

import type { SportCategory } from "@bsport/api-core";
import { bindStore } from "@bsport/store-base";

export interface sportCategoryState {
  byId: { [key: number]: SportCategory };
  ids: number[];
}

export const sportCategoryStore = createStore<sportCategoryState>()(() => ({
  byId: {},
  ids: [],
}));

export const useSportCategoryStore = bindStore(sportCategoryStore);
