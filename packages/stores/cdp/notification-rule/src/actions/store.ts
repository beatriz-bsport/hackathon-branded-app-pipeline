import { notificationRuleStore } from "#src/store";
import type {
  CommunicationVariable,
  GenericCommunicationVariable,
  NotificationRuleDetail,
  NotificationRuleEvent,
  NotificationRuleEventSetting,
} from "#src/types";

export const setCommunicationVariables = (
  communicationVariableTagList: CommunicationVariable,
) => {
  notificationRuleStore.setState((state) => {
    if (!communicationVariableTagList) return state;
    return {
      ...state,
      communicationVariable: { ...communicationVariableTagList },
    };
  });
};

export const setGenericCommunicationVariables = (
  genericCommunicationVariables: GenericCommunicationVariable,
) => {
  notificationRuleStore.setState((state) => {
    if (!genericCommunicationVariables) return state;
    return {
      ...state,
      genericCommunicationVariable: { ...genericCommunicationVariables },
    };
  });
};

export const setNotificationRuleEvents = ({
  events,
}: {
  events: NotificationRuleEvent[];
}) => {
  notificationRuleStore.setState((state) => {
    const sanitizedEvents = events.filter(Boolean);
    return {
      ...state,
      notificationRuleEvents: [...sanitizedEvents],
    };
  });
};

export const setNotificationRuleDetails = ({
  details,
}: {
  details: NotificationRuleDetail[];
}) => {
  notificationRuleStore.setState((state) => {
    const sanitizedDetails = details.filter(Boolean);
    return {
      ...state,
      notificationRuleDetails: [...sanitizedDetails],
    };
  });
};

export const setNotificationRuleSettingsMap = ({
  company,
  id,
  settings,
}: {
  company: number | null;
  id: number | null;
  settings: Record<number, NotificationRuleEventSetting>;
}) => {
  notificationRuleStore.setState((state) => {
    if (!settings) return state;
    return {
      ...state,
      notificationRuleSettings: {
        company,
        id,
        settings: { ...state.notificationRuleSettings.settings, ...settings },
      },
    };
  });
};

export const updateNotificationRuleDetail = ({
  detail,
}: {
  detail: NotificationRuleDetail;
}) => {
  notificationRuleStore.setState((state) => {
    if (!detail) return state;

    const updatedDetailsList = [...state.notificationRuleDetails].filter(
      (d) => d.id !== detail.id,
    );
    updatedDetailsList.push(detail);

    return {
      ...state,
      notificationRuleDetails: updatedDetailsList,
    };
  });
};

export const updateNotificationRuleSettings = ({
  id,
  settings,
}: {
  id: number | null;
  settings: Record<number, NotificationRuleEventSetting>;
}) => {
  notificationRuleStore.setState((state) => {
    if (!settings || !id) return state;
    return {
      ...state,
      notificationRuleSettings: {
        ...state.notificationRuleSettings,
        settings: { ...state.notificationRuleSettings.settings, ...settings },
      },
    };
  });
};

export const clearNotificationRuleDetails = () => {
  notificationRuleStore.setState((state) => ({
    ...state,
    notificationRuleDetails: [],
  }));
};

export const clearNotificationRuleSettings = () => {
  notificationRuleStore.setState((state) => ({
    ...state,
    notificationRuleSettings: {
      company: null,
      id: null,
      settings: {},
    },
  }));
};

export const clearNotificationRuleEvents = () => {
  notificationRuleStore.setState((state) => ({
    ...state,
    notificationRuleEvents: [],
  }));
};

export const clearCommunicationVariables = () => {
  notificationRuleStore.setState((state) => ({
    ...state,
    communicationVariable: {},
    genericCommunicationVariable: {},
  }));
};

export const resetNotificationRuleStore = () => {
  notificationRuleStore.setState(() => ({
    communicationVariable: {},
    genericCommunicationVariable: {},
    notificationRuleEvents: [],
    notificationRuleSettings: {
      company: null,
      id: null,
      settings: {},
    },
    notificationRuleDetails: [],
  }));
};
