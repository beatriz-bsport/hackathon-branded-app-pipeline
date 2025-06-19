import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { CommunicationVariable } from "#src/types";

export interface NotificationRuleState {
  communicationVariable: CommunicationVariable;
}

export const notificationRuleStore = createStore<NotificationRuleState>()(
  () => ({
    communicationVariable: {},
  }),
);

export const useNotificationRuleStore = bindStore(notificationRuleStore);
