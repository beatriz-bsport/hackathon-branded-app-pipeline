import { createAction } from 'redux-actions';
import { EMAIL_TEMPLATE_MISSING_REQUIRED_TAGS } from '@bsport/common/lib/master-data/error-codes/notification-rule.js';
import { ResolvedGenericTags } from '#src/libs/email-editor/types';
import { snackbarSuccess, snackbarError } from '../snackbar/actions';

import {
  fetchNotificationRuleList as fetchNotificationRuleListAPI,
  fetchNotificationRuleGenericList as fetchNotificationRuleGenericListAPI,
  createOrUpdateNotificationRule as createOrUpdateNotificationRuleAPI,
  fetchEventTypeList as fetchEventTypeListAPI,
  fetchTagList as fetchTagListAPI,
  deleteNotificationRule as deleteNotificationRuleAPI,
  fetchSettingsList as fetchSettingsListAPI,
  updateSettings as updateSettingsAPI,
  fetchNotificationGenericTagsList,
} from './api';

import type { Dispatch, OptionCallback } from '../../state/types';

export const notificationRuleListActions = {
  error: createAction('NOTIFICATION_RULE/LIST/ERROR'),
  isLoading: createAction('NOTIFICATION_RULE/LIST/IS_LOADING'),
  success: createAction('NOTIFICATION_RULE/LIST/SUCCESS'),
};

export const tagAvailableListActions = {
  error: createAction('NOTIFICATION_RULE/TAG_LIST/ERROR'),
  isLoading: createAction('NOTIFICATION_RULE/TAG_LIST/IS_LOADING'),
  success: createAction('NOTIFICATION_RULE/TAG_LIST/SUCCESS'),
};

export function fetchTagList(options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(tagAvailableListActions.isLoading(true));
    dispatch(tagAvailableListActions.error(null));

    try {
      const response = await fetchTagListAPI();
      dispatch(tagAvailableListActions.success(response.data));
      dispatch(tagAvailableListActions.error(null));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(tagAvailableListActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(tagAvailableListActions.isLoading(false));
  };
}

export function fetchNotificationRuleList(
  params: any = {},
  options?: OptionCallback<any /* TODO Types */>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(notificationRuleListActions.isLoading(true));
    dispatch(notificationRuleListActions.error(null));

    try {
      const response_custom = await fetchNotificationRuleListAPI();
      const response_generic_rules = await fetchNotificationRuleGenericListAPI(
        // @ts-expect-error
        params,
      );

      // @ts-expect-error
      const { rules } = response_generic_rules.data;
      // @ts-expect-error
      const data = [...response_custom.data, ...rules];
      dispatch(notificationRuleListActions.success(data));
      dispatch(notificationRuleListActions.error(null));
      if (options && options.onSuccess) {
        options.onSuccess(data);
      }
    } catch (error) {
      console.error(error);
      dispatch(notificationRuleListActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(notificationRuleListActions.isLoading(false));
  };
}

export const genericTagsActions = {
  error: createAction('NOTIFICATION_RULE/GENERIC_TAGS/ERROR'),
  isLoading: createAction('NOTIFICATION_RULE/GENERIC_TAGS/IS_LOADING'),
  success: createAction('NOTIFICATION_RULE/GENERIC_TAGS/SUCCESS'),
};

export function fetchResolvedGenericTags(
  options?: OptionCallback<any /* TODO Types */>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(genericTagsActions.isLoading(true));
    dispatch(genericTagsActions.error(null));
    try {
      const response = await fetchNotificationGenericTagsList();
      const data: ResolvedGenericTags = response.data;
      dispatch(genericTagsActions.success(data));
      dispatch(genericTagsActions.error(null));
      if (options && options.onSuccess) {
        options.onSuccess(data);
      }
    } catch (error) {
      console.error(error);
      dispatch(genericTagsActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(genericTagsActions.isLoading(false));
  };
}

export const notificatonRuleCreateOrUpdateActions = {
  error: createAction('NOTIFICATION_RULE/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('NOTIFICATION_RULE/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction('NOTIFICATION_RULE/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdateNotificationRule(
  data: any,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(notificatonRuleCreateOrUpdateActions.isLoading(true));
    dispatch(notificatonRuleCreateOrUpdateActions.error(null));

    try {
      const response = await createOrUpdateNotificationRuleAPI(data);
      dispatch(notificatonRuleCreateOrUpdateActions.success(response.data));
      dispatch(notificatonRuleCreateOrUpdateActions.error(null));
      dispatch(snackbarSuccess('notificationRule.createOrUpdate.success'));
      dispatch(fetchNotificationRuleList());
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(notificatonRuleCreateOrUpdateActions.error(error));
      if (
        error.response?.data.error_code === EMAIL_TEMPLATE_MISSING_REQUIRED_TAGS
      ) {
        dispatch(
          snackbarError(
            'notificationRule.createOrUpdate.errorLackRequiredVariables',
          ),
        );
      } else {
        dispatch(snackbarError('notificationRule.createOrUpdate.error'));
      }
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(notificatonRuleCreateOrUpdateActions.isLoading(false));
  };
}

export const deleteNotificationRuleActions = {
  error: createAction('NOTIFICATION_RULE/DELETE/ERROR'),
  isLoading: createAction('NOTIFICATION_RULE/DELETE/IS_LOADING'),
};

export function deleteNotificationRule(
  id: number,
  options?: OptionCallback<number>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteNotificationRuleActions.isLoading(true));
    dispatch(deleteNotificationRuleActions.error(null));

    try {
      await deleteNotificationRuleAPI(id);
      dispatch(fetchNotificationRuleList({ notification_event: id }));
      dispatch(deleteNotificationRuleActions.error(null));
      if (options && options.onSuccess) {
        options.onSuccess(id);
      }
    } catch (error) {
      console.error(error);
      dispatch(deleteNotificationRuleActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(deleteNotificationRuleActions.isLoading(false));
  };
}

export const eventTypeListActions = {
  error: createAction('NOTIFICATION_RULE/EVENT_TYPE/LIST/ERROR'),
  isLoading: createAction('NOTIFICATION_RULE/EVENT_TYPE/LIST/IS_LOADING'),
  success: createAction('NOTIFICATION_RULE/EVENT_TYPE/LIST/SUCCESS'),
};

export function fetchEventTypeList() {
  return async (dispatch: Dispatch) => {
    dispatch(eventTypeListActions.isLoading(true));
    dispatch(eventTypeListActions.error(null));

    try {
      const response = await fetchEventTypeListAPI();
      dispatch(eventTypeListActions.success(response.data));
      dispatch(eventTypeListActions.error(null));
    } catch (error) {
      console.error(error);
      dispatch(eventTypeListActions.error(error));
    }

    dispatch(eventTypeListActions.isLoading(false));
  };
}

export const notificationRuleSettingsListActions = {
  error: createAction('NOTIFICATION_RULE_SETTINGS/LIST/ERROR'),
  isLoading: createAction('NOTIFICATION_RULE_SETTINGS/LIST/IS_LOADING'),
  success: createAction('NOTIFICATION_RULE_SETTINGS/LIST/SUCCESS'),
};

export function fetchSettingsList() {
  return async (dispatch: Dispatch) => {
    dispatch(notificationRuleSettingsListActions.isLoading(true));
    dispatch(notificationRuleSettingsListActions.error(null));

    try {
      const response = await fetchSettingsListAPI();
      dispatch(notificationRuleSettingsListActions.success(response.data));
      dispatch(notificationRuleSettingsListActions.error(null));
    } catch (error) {
      console.error(error);
      dispatch(notificationRuleSettingsListActions.error(error));
    }

    dispatch(notificationRuleSettingsListActions.isLoading(false));
  };
}

export const notificationRuleSettingUpdateActions = {
  error: createAction('NOTIFICATION_RULE_SETTINGS/UPDATE/ERROR'),
  isLoading: createAction('NOTIFICATION_RULE_SETTINGS/UPDATE/IS_LOADING'),
  success: createAction('NOTIFICATION_RULE_SETTINGS/UPDATE/SUCCESS'),
};

export function updateSettings(data: any) {
  return async (dispatch: Dispatch) => {
    dispatch(notificationRuleSettingUpdateActions.isLoading(true));
    dispatch(notificationRuleSettingUpdateActions.error(null));

    try {
      const response = await updateSettingsAPI(data);
      dispatch(notificationRuleSettingUpdateActions.success(response.data));
      dispatch(notificationRuleSettingUpdateActions.error(null));
      dispatch(snackbarSuccess('notificationRule.createOrUpdate.success'));
    } catch (error) {
      console.error(error);
      dispatch(notificationRuleSettingUpdateActions.error(error));
    }

    dispatch(notificationRuleSettingUpdateActions.isLoading(false));
  };
}
