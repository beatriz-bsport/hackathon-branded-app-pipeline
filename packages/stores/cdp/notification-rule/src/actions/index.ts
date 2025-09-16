import { Result } from "typescript-result";

import { type Action, createErrorWithContext } from "@bsport/store-base";

import {
  deleteNotificationRuleDetailsAPI,
  fetchCommunicationVariablesAPI,
  fetchGenericCommunicationVariablesAPI,
  fetchNotificationRuleDetailListAPI,
  fetchNotificationRuleEventListAPI,
  fetchNotificationRuleGenericDetailListAPI,
  fetchNotificationRuleSettingListAPI,
  patchNotificationRuleDetailsAPI,
  postNotificationRuleDetailsAPI,
  putNotificationRuleSettingsAPI,
} from "#src/api";
import type {
  CommunicationVariable,
  DeleteNotificationRuleParams,
  GenericCommunicationVariable,
  NotificationRuleDetail,
  NotificationRuleEvent,
  NotificationRuleGenericEvents,
  NotificationRuleSettings,
  NotificationRuleSettingsResult,
} from "#src/types";

import {
  setCommunicationVariables,
  setGenericCommunicationVariables,
  setNotificationRuleDetails,
  setNotificationRuleEvents,
  setNotificationRuleSettingsMap,
  updateNotificationRuleDetail,
  updateNotificationRuleSettings,
} from "./store";

/**
 * Fetches all available communication variables that can be used in notification templates.
 *
 * Communication variables are dynamic placeholders that get replaced with actual values
 * when notifications are sent (e.g., {member_name}, {company_name}, etc.).
 *
 * @param fetch - The fetch function for making API calls
 * @returns Promise<Result<CommunicationVariable, Error>> - A Result containing the communication variables object
 *
 * @example
 * ```typescript
 * const result = await fetchCommunicationVariablesAction(fetch);
 * if (result.ok) {
 *   console.log('Available variables:', result.value);
 * }
 * ```
 */
export const fetchCommunicationVariablesAction: Action<
  void,
  CommunicationVariable
> = async (fetch) => {
  const [uri, init] = fetchCommunicationVariablesAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setCommunicationVariables(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch communication variables",
      }),
  );
};

/**
 * Fetches all available generic communication variables for notification templates.
 *
 * Generic communication variables are system-wide placeholders that apply to all
 * notification types, unlike specific variables that are context-dependent.
 * These typically include company information, dates, and other universal data.
 *
 * @param fetch - The fetch function for making API calls
 * @returns Promise<Result<GenericCommunicationVariable, Error>> - A Result containing the generic variables object
 *
 * @example
 * ```typescript
 * const result = await fetchGenericCommunicationVariablesAction(fetch);
 * if (result.ok) {
 *   console.log('Generic variables:', result.value);
 * }
 * ```
 */
export const fetchGenericCommunicationVariablesAction: Action<
  void,
  GenericCommunicationVariable
> = async (fetch) => {
  const [uri, init] = fetchGenericCommunicationVariablesAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setGenericCommunicationVariables(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch generic communication variables",
      }),
  );
};

/**
 * Fetches all available notification rule events from the system.
 *
 * Notification rule events define the triggers that can initiate notifications
 * (e.g., member registration, class booking, payment received, etc.).
 * Each event contains metadata about whether it's editable, instance-specific,
 * and what notification group it belongs to.
 *
 * @param fetch - The fetch function for making API calls
 * @returns Promise<Result<NotificationRuleEvent[], Error>> - A Result containing array of notification events
 *
 * @example
 * ```typescript
 * const result = await fetchNotificationRuleEventsAction(fetch);
 * if (result.ok) {
 *   const editableEvents = result.value.filter(event => event.is_editable);
 *   console.log('Editable events:', editableEvents);
 * }
 * ```
 *
 * @see NotificationRuleEvent - For event object structure details
 */
export const fetchNotificationRuleEventsAction: Action<
  void,
  NotificationRuleEvent[]
> = async (fetch) => {
  const [uri, init] = fetchNotificationRuleEventListAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setNotificationRuleEvents({ events: data });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch notification rule events",
      }),
  );
};

/**
 * Fetches all notification rule details (configurations) from the system.
 *
 * Notification rule details contain the complete configuration for each notification rule,
 * including email design settings, target companies, push notification settings,
 * and activation status. These are the core configurations that determine
 * how and when notifications are sent.
 *
 * @param fetch - The fetch function for making API calls
 * @returns Promise<Result<NotificationRuleDetail[], Error>> - A Result containing array of notification rule configurations
 *
 * @example
 * ```typescript
 * const result = await fetchNotificationRuleDetailsAction(fetch);
 * if (result.ok) {
 *   const activeRules = result.value.filter(rule => rule.is_active);
 *   const pushEnabledRules = result.value.filter(rule => rule.is_notification_push_active);
 *   console.log('Active rules:', activeRules.length);
 * }
 * ```
 *
 * @see NotificationRuleDetail - For rule detail object structure
 */
export const fetchNotificationRuleDetailsAction: Action<
  void,
  NotificationRuleDetail[]
> = async (fetch) => {
  const [uri, init] = fetchNotificationRuleDetailListAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setNotificationRuleDetails({ details: data });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch notification rule details",
      }),
  );
};

/**
 * Fetches all notification rule details (configurations) from the system.
 *
 * Notification rule details contain the complete configuration for each notification rule,
 * including email design settings, target companies, push notification settings,
 * and activation status. These are the core configurations that determine
 * how and when notifications are sent.
 *
 * @param fetch - The fetch function for making API calls
 * @returns Promise<Result<NotificationRuleDetail[], Error>> - A Result containing array of notification rule configurations
 *
 * @example
 * ```typescript
 * const result = await fetchNotificationRuleDetailsAction(fetch);
 * if (result.ok) {
 *   const activeRules = result.value.filter(rule => rule.is_active);
 *   const pushEnabledRules = result.value.filter(rule => rule.is_notification_push_active);
 *   console.log('Active rules:', activeRules.length);
 * }
 * ```
 *
 * @see NotificationRuleDetail - For rule detail object structure
 */
export const fetchNotificationRuleGenericDetailsAction: Action<
  void,
  NotificationRuleGenericEvents
> = async (fetch) => {
  const [uri, init] = fetchNotificationRuleGenericDetailListAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setNotificationRuleDetails({ details: data.rules });
      setGenericCommunicationVariables(data.tags);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch generic notification rule details",
      }),
  );
};

/**
 * Fetches all notification rule settings from the system.
 *
 * Notification rule settings control the behavior and permissions for notification rules,
 * including whether rules are disabled, whether to send to company contacts,
 * and which checkboxes are disabled in the UI. These settings act as overrides
 * and permission controls for the notification system.
 *
 * @param fetch - The fetch function for making API calls
 * @returns Promise<Result<Record<number, NotificationRuleSetting>, Error>> - A Result containing settings mapped by rule ID
 */
export const fetchNotificationRuleSettingsAction: Action<
  void,
  NotificationRuleSettingsResult
> = async (fetch) => {
  const [uri, init] = fetchNotificationRuleSettingListAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      const settings = data[0] || {
        company: null,
        id: null,
        settings: {},
      };
      setNotificationRuleSettingsMap({
        company: settings.company,
        id: settings.id,
        settings: settings.settings,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch notification rule settings",
      }),
  );
};

/**
 * Updates notification rule settings for a specific notification rule.
 *
 * This action allows modification of notification rule behavior settings such as
 * enabling/disabling rules, configuring company notification preferences,
 * and controlling UI checkbox states. The update is performed via PUT request
 * and automatically updates the local store state upon success.
 *
 * @param fetch - The fetch function for making API calls
 * @param params - The update parameters containing rule ID, company ID, and new settings
 * @param params.id - The notification rule ID to update
 * @param params.company - The company ID (or null for global rules)
 * @param params.settings - Object containing the new settings mapped by setting key
 * @returns Promise<Result<Record<number, NotificationRuleSetting>, Error>> - A Result containing updated settings
 *
 * @example
 * ```typescript
 * const updateParams = {
 *   id: 123,
 *   company: 456,
 *   settings: {
 *     'email_notifications': { disabled: false, send_company: true, disabled_checkboxes: false },
 *     'push_notifications': { disabled: true, send_company: false, disabled_checkboxes: true }
 *   }
 * };
 *
 * const result = await updateNotificationRuleSettingsAction(fetch, updateParams);
 * if (result.ok) {
 *   console.log('Settings updated successfully');
 * }
 * ```
 *
 * @see NotificationRuleSettings - For parameter structure details
 * @see NotificationRuleSettings - For setting object structure
 */
export const updateNotificationRuleSettingsAction: Action<
  NotificationRuleSettings,
  NotificationRuleSettings
> = async (fetch, params) => {
  const [uri, init] = putNotificationRuleSettingsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);
      const settings = data || {
        company: null,
        id: null,
        settings: {},
      };
      updateNotificationRuleSettings({
        id: settings.id,
        settings: settings.settings,
      });

      return settings;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to update notification rule settings",
      }),
  );
};

/**
 * Updates notification rule details (configuration) for a specific notification rule.
 *
 * This action allows modification of notification rule configuration including
 * email design, target companies, push notification settings, activation status,
 * and franchisor carbon copy preferences. The update is performed via PATCH request
 * and automatically updates the local store state upon success.
 *
 * @param fetch - The fetch function for making API calls
 * @param params - The notification rule detail object with updated values
 * @param params.id - The notification rule ID (required for updates)
 * @param params.title - The notification rule title
 * @param params.is_active - Whether the notification rule is active
 * @param params.is_notification_push_active - Whether push notifications are enabled
 * @param params.email_design - The email design template ID
 * @param params.companies - Array of company IDs that this rule applies to
 * @param params.send_franchisor_carbon_copy - Whether to CC the franchisor
 * @returns Promise<Result<NotificationRuleDetail, Error>> - A Result containing the updated rule detail
 *
 * @example
 * ```typescript
 * const updateParams = {
 *   email_design: 456,
 *   notification_event: 123,
 * };
 *
 * const result = await updateNotificationRuleDetailsAction(fetch, updateParams);
 * if (result.ok) {
 *   console.log('Rule updated:', result.value.title);
 * }
 * ```
 *
 * @see NotificationRuleDetail - For complete parameter structure details
 */
export const createNotificationRuleDetailsAction: Action<
  Partial<NotificationRuleDetail>,
  NotificationRuleDetail
> = async (fetch, params) => {
  const [uri, init] = postNotificationRuleDetailsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateNotificationRuleDetail({ detail: data });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to create notification rule details",
      }),
  );
};

/**
 * Updates notification rule details (configuration) for a specific notification rule.
 *
 * This action allows modification of notification rule configuration including
 * email design, target companies, push notification settings, activation status,
 * and franchisor carbon copy preferences. The update is performed via PATCH request
 * and automatically updates the local store state upon success.
 *
 * @param fetch - The fetch function for making API calls
 * @param params - The notification rule detail object with updated values
 * @param params.id - The notification rule ID (required for updates)
 * @param params.title - The notification rule title
 * @param params.is_active - Whether the notification rule is active
 * @param params.is_notification_push_active - Whether push notifications are enabled
 * @param params.email_design - The email design template ID
 * @param params.companies - Array of company IDs that this rule applies to
 * @param params.send_franchisor_carbon_copy - Whether to CC the franchisor
 * @returns Promise<Result<NotificationRuleDetail, Error>> - A Result containing the updated rule detail
 *
 * @example
 * ```typescript
 * const updateParams = {
 *   id: 123,
 *   title: 'Updated Welcome Email',
 *   is_active: true,
 *   is_notification_push_active: false,
 *   email_design: 456,
 *   companies: [789, 101112],
 *   send_franchisor_carbon_copy: true,
 *   // ... other fields
 * };
 *
 * const result = await updateNotificationRuleDetailsAction(fetch, updateParams);
 * if (result.ok) {
 *   console.log('Rule updated:', result.value.title);
 * }
 * ```
 *
 * @see NotificationRuleDetail - For complete parameter structure details
 */
export const updateNotificationRuleDetailsAction: Action<
  NotificationRuleDetail,
  NotificationRuleDetail
> = async (fetch, params) => {
  const [uri, init] = patchNotificationRuleDetailsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateNotificationRuleDetail({ detail: data });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to update notification rule details",
      }),
  );
};

/**
 * Updates notification rule details (configuration) for a specific notification rule.
 *
 * This action allows modification of notification rule configuration including
 * email design, target companies, push notification settings, activation status,
 * and franchisor carbon copy preferences. The update is performed via PATCH request
 * and automatically updates the local store state upon success.
 *
 * @param fetch - The fetch function for making API calls
 * @param params - The notification rule detail object with updated values
 * @param params.id - The notification rule ID (required for updates)
 * @returns Promise<Result<DeleteNotificationRuleParams, Error>> - A Result containing the updated rule detail
 * @see NotificationRuleDetail - For complete parameter structure details
 */
export const deleteNotificationRuleDetailsAction: Action<
  DeleteNotificationRuleParams,
  DeleteNotificationRuleParams
> = async (fetch, params) => {
  const [uri, init] = deleteNotificationRuleDetailsAPI(params);

  return Result.try(
    async () => {
      await fetch(uri, init);

      return params;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to delete notification rule details",
      }),
  );
};
