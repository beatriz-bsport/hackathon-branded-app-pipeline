import type { NotificationRuleState } from "./store";
import type { NotificationRuleEvent } from "./types";

export const selectAllCommunicationVariables = (state: NotificationRuleState) =>
  state.communicationVariable;

export const selectCommunicationVariablesByTagName = (
  state: NotificationRuleState,
  tagName: string,
) => state.communicationVariable[tagName];

export const selectGenericCommunicationVariables = (
  state: NotificationRuleState,
) => state.genericCommunicationVariable;

export const selectNotificationRuleEvents = (state: NotificationRuleState) =>
  state.notificationRuleEvents;

export const selectNotificationRuleDetails = (state: NotificationRuleState) =>
  state.notificationRuleDetails;

export const selectNotificationRuleDetailById = (
  state: NotificationRuleState,
  id: number,
) => state.notificationRuleDetails.find((detail) => detail.id === id);

export const selectNotificationRuleSettings = (state: NotificationRuleState) =>
  state.notificationRuleSettings;

export const selectNotificationRuleSettingMap = (
  state: NotificationRuleState,
) => state.notificationRuleSettings.settings;

export const selectNotificationRuleSettingById = (
  state: NotificationRuleState,
  id: number,
) => state.notificationRuleSettings.settings[id];

export const selectNotificationRuleEventsByGroup = (
  state: NotificationRuleState,
): Record<string, NotificationRuleEvent[]> =>
  state.notificationRuleEvents
    .filter((event) => event.is_editable)
    .reduce(
      (acc, event) => {
        const groupName = event.notification_group;
        if (!acc[groupName]) {
          acc[groupName] = [];
        }
        acc[groupName].push(event);
        return acc;
      },
      {} as Record<string, NotificationRuleEvent[]>,
    );
