// @flow
import {
  getAuth,
  postAuth,
  putAuth,
  deleteAuth,
  API_V1_URI,
} from '../../http';

const NOTIFICATION_RULE_ENDPOINT = `${API_V1_URI}/notification`;

export const fetchNotificationRuleList = async () => {
  return getAuth(`${NOTIFICATION_RULE_ENDPOINT}/rule/`);
};

export const fetchNotificationRuleGenericList = async () => {
  return getAuth(`${NOTIFICATION_RULE_ENDPOINT}/rule/generic/`);
};

export const createOrUpdateNotificationRule = (data: any) => {
  if (data.id && data.company) {
    return putAuth(`${NOTIFICATION_RULE_ENDPOINT}/rule/${data.id}/`, data);
  }
  return postAuth(`${NOTIFICATION_RULE_ENDPOINT}/rule/`, data);
};

export const deleteNotificationRule = (id: number) => {
  return deleteAuth(`${NOTIFICATION_RULE_ENDPOINT}/rule/${id}/`);
};

export const fetchEventTypeList = async () => {
  return getAuth(`${NOTIFICATION_RULE_ENDPOINT}/rule/events/`);
};

export const fetchTagList = async () => {
  return getAuth(`${NOTIFICATION_RULE_ENDPOINT}/rule/tags/`);
};

export const fetchSettingsList = async () => {
  return getAuth(`${NOTIFICATION_RULE_ENDPOINT}/settings/`);
};

export const updateSettings = async (data: any) => {
  return putAuth(`${NOTIFICATION_RULE_ENDPOINT}/settings/${data.id}/`, data);
};
