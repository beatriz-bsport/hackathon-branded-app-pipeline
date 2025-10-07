import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { Communication } from "#src/types";

export interface CommunicationState {
  byId: { [key: number]: Communication };
  count: number;
  ids: number[];
  page: number;
}

export const communicationStore = createStore<CommunicationState>()(() => ({
  byId: {},
  count: 0,
  ids: [],
  page: 1,
}));

export const useCommunicationStore = bindStore(communicationStore);
