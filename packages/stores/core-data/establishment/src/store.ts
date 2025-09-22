import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { Establishment } from "#src/types";

export interface EstablishmentState {
  byId: { [key: number]: Establishment };
  list: {
    count: number;
    ids: number[];
    page: number;
  };
  search: {
    count: number;
    ids: number[];
    page: number;
  };
}

export const establishmentStore = createStore<EstablishmentState>()(() => ({
  byId: {},
  list: {
    count: 0,
    ids: [],
    page: 1,
  },
  search: {
    count: 0,
    ids: [],
    page: 1,
  },
}));

export const useEstablishmentStore = bindStore(establishmentStore);
