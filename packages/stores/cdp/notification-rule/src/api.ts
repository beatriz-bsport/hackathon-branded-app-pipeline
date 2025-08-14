import { type ApiConfig } from "@bsport/store-base";

import { NotificationRuleDetail, NotificationRuleSettings } from "./types";

const API_URL = "customer-data-platform/v1/notification";
const RULE_API_URL = API_URL + "/rule";

export const fetchCommunicationVariablesAPI = (): ApiConfig => {
  return [`${RULE_API_URL}/tags/`];
};

export const fetchGenericCommunicationVariablesAPI = (): ApiConfig => {
  return [`${RULE_API_URL}/generic_tags/`];
};

export const fetchNotificationRuleEventListAPI = (): ApiConfig => {
  return [`${RULE_API_URL}/events/`];
};

export const fetchNotificationRuleDetailListAPI = (): ApiConfig => {
  return [`${RULE_API_URL}/`];
};

export const fetchNotificationRuleSettingListAPI = (): ApiConfig => {
  return [`${API_URL}/settings/`];
};

export const putNotificationRuleSettingsAPI = (
  params: NotificationRuleSettings,
): ApiConfig => {
  return [
    `${API_URL}/settings/${params.id}`,
    {
      method: "PUT",
      body: JSON.stringify(params),
    },
  ];
};

export const patchNotificationRuleDetailsAPI = (
  params: NotificationRuleDetail,
): ApiConfig => {
  return [
    `${RULE_API_URL}/${params.id}`,
    {
      method: "PATCH",
      body: JSON.stringify(params),
    },
  ];
};
