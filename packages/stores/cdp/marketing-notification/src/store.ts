import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { MarketingNotification } from "#src/types";

export interface MarketingNotificationState {
  marketingNotifications: MarketingNotification[];
  marketingNotificationById: { [id: number]: MarketingNotification };
}

export const marketingNotificationStore =
  createStore<MarketingNotificationState>()(() => ({
    marketingNotifications: [],
    marketingNotificationById: {},
  }));

export const useMarketingNotificationStore = bindStore(
  marketingNotificationStore,
);
