import { createStore } from "zustand/vanilla";

import { type PaginatedState, bindStore } from "@bsport/store-base";

import type { Establishment, EstablishmentGroup } from "#src/types";

export interface EstablishmentState {
  establishmentGroup: PaginatedState<EstablishmentGroup> & {
    searchedIds: number[];
  };
  establishment: PaginatedState<Establishment> & { searchedIds: number[] };
}

export const establishmentStore = createStore<EstablishmentState>()(() => ({
  establishmentGroup: {
    byId: {},
    count: 0,
    ids: [],
    page: 1,
    searchedIds: [],
  },
  establishment: {
    byId: {},
    count: 0,
    ids: [],
    page: 1,
    searchedIds: [],
  },
}));

export const useEstablishmentStore = bindStore(establishmentStore);
