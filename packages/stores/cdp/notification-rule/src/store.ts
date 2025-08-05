import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type {
  CommunicationVariable,
  GenericCommunicationVariable,
  NotificationRuleDetail,
  NotificationRuleEvent,
  NotificationRuleSettings,
} from "#src/types";

export interface NotificationRuleState {
  communicationVariable: CommunicationVariable;
  genericCommunicationVariable: GenericCommunicationVariable;
  notificationRuleEvents: NotificationRuleEvent[];
  notificationRuleSettings: NotificationRuleSettings;
  notificationRuleDetails: NotificationRuleDetail[];
}

export const notificationRuleStore = createStore<NotificationRuleState>()(
  () => ({
    communicationVariable: {},
    genericCommunicationVariable: {},
    notificationRuleEvents: [],
    notificationRuleDetails: [],
    notificationRuleSettings: {
      company: null,
      id: null,
      settings: {},
    },
  }),
);

export const useNotificationRuleStore = bindStore(notificationRuleStore);
