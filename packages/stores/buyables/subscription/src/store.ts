import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { Subscription } from "#src/types";

export interface SubscriptionState {
  subscriptions: {
    byId: { [key: number]: Subscription };
    count: number;
    flatIds: number[];
    fuzzySearchIds: number[];
    page: number;
  };
}

export const subscriptionStore = createStore<SubscriptionState>()(() => ({
  subscriptions: {
    byId: {},
    count: 0,
    flatIds: [],
    fuzzySearchIds: [],
    page: 1,
  },
}));

export const useSubscriptionStore = bindStore(subscriptionStore);
