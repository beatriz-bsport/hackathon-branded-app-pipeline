import {
  getAuth,
  postAuth,
  putAuth,
  deleteAuth,
  API_V1_URI,
  buildUrlParams,
} from '../../http';
import { FranchiseCompleteNotificationRule } from './types';

const NOTIFICATION_RULE_ENDPOINT = `${API_V1_URI}/notification`;

export const fetchNotificationRuleList = async (params: any = {}) => {
  return getAuth(
    `${NOTIFICATION_RULE_ENDPOINT}/rule/${buildUrlParams(params)}`,
  );
};

export const fetchNotificationRuleGenericList = async () => {
  return getAuth(`${NOTIFICATION_RULE_ENDPOINT}/rule/generic/`);
};

export const createOrUpdateNotificationRule = (data: any) => {
  if (data.id && (data.company || data.companies)) {
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

export const fetchFranchiseNotification = async (params: {
  notification_event?: number;
}) =>
  getAuth(
    `${NOTIFICATION_RULE_ENDPOINT}/franchise_rule/${buildUrlParams(params)}`,
  );

export const createfetchFranchiseNotification = async (
  data: Omit<FranchiseCompleteNotificationRule, 'id'>,
) => postAuth(`${NOTIFICATION_RULE_ENDPOINT}/franchise_rule/`, data);

export const editfetchFranchiseNotification = async (
  id: number,
  data: Omit<FranchiseCompleteNotificationRule, 'id'>,
) => putAuth(`${NOTIFICATION_RULE_ENDPOINT}/franchise_rule/${id}/`, data);

export const deletefetchFranchiseNotification = async (id: number) =>
  deleteAuth(`${NOTIFICATION_RULE_ENDPOINT}/franchise_rule/${id}/`);
