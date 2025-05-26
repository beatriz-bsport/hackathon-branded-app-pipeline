import { createStore } from "zustand/vanilla";

import { type PaginatedState, bindStore } from "@bsport/store-base";

import type { CustomForm, CustomFormStatistics } from "#src/types";

export interface CustomFormState {
  customForms: PaginatedState<CustomForm>;
  statistics: PaginatedState<CustomFormStatistics>;
}

export const customFormStore = createStore<CustomFormState>()(() => ({
  customForms: {
    byId: {},
    count: 0,
    ids: [],
    page: 1,
  },
  statistics: {
    byId: {},
    count: 0,
    ids: [],
    page: 1,
  },
}));

export const useCustomFormStore = bindStore(customFormStore);
