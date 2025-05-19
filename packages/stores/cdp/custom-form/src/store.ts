import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { CustomForm } from "#src/types";

export interface CustomFormState {
  byId: { [key: number]: CustomForm };
  count: number;
  ids: number[];
  page: number;
}

export const customFormStore = createStore<CustomFormState>()(() => ({
  byId: {},
  count: 0,
  ids: [],
  page: 1,
}));

export const useCustomFormStore = bindStore(customFormStore);
