import { CadenceConnectedTriggerConfig } from '#libs/sequential_marketing/types';
import {
  // TRIGGERS
  TriggerEnum,
  // FILTERING
  FiltersEnum,
  RuleBetweenEntryEvent,
  // MARKETING ACTIONS
  CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
  CADENCE_MARKETING_ACTION_SMS,
  CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
  CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
  CADENCE_MARKETING_ACTION_TAG_MANAGEMENT,
} from '#libs/sequential_marketing/constants';

import type { Values } from './components';

export const TRIGGER_DETAULT_TIMEOUT_DAYS = 7;

export const getTriggerFormData = (values: Values) => {
  return values;
};

export const defaultMarketingActions = {
  marketing_actions: {
    [CADENCE_MARKETING_ACTION_WRITTEN_EMAIL]: {
      configured: false,
      title: '',
      content: '',
    },
    [CADENCE_MARKETING_ACTION_SMS]: {
      configured: false,
      content: '',
    },
    [CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION]: {
      configured: false,
      title: '',
      content: '',
    },
    [CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE]: {
      configured: false,
      email_design_id: null,
      title: '',
    },
    [CADENCE_MARKETING_ACTION_TAG_MANAGEMENT]: {
      configured: false,
      tag_id: null,
    },
  },
};

const _resolveConnectedTriggersConfigurations = ({
  connected_triggers_list,
}: {
  connected_triggers_list: CadenceConnectedTriggerConfig[];
}) => {
  // CTL stands for : Connected Triggers List
  const CTL_EventWithSmartlistFiltering = connected_triggers_list?.filter(
    (ct) =>
      ct.trigger_config.identifier === TriggerEnum.EVENT_TRIGGER_IDENTIFIER &&
      ct.filtering_config.identifier === FiltersEnum.FILTERING_SMARTLIST,
  );
  const CTL_EventWithEmptyFiltering = connected_triggers_list?.filter(
    (ct) =>
      ct.trigger_config.identifier === TriggerEnum.EVENT_TRIGGER_IDENTIFIER &&
      ct.filtering_config.identifier === FiltersEnum.FILTERING_EMPTY,
  );

  const CTL_EmptyWithSmartlistFiltering = connected_triggers_list?.filter(
    (ct) =>
      ct.trigger_config.identifier === TriggerEnum.EMPTY_TRIGGER_IDENTIFIER &&
      ct.filtering_config.identifier === FiltersEnum.FILTERING_SMARTLIST,
  );

  const CTTimeOutList = connected_triggers_list?.filter(
    (ct) =>
      ct.trigger_config.identifier === TriggerEnum.TIMEOUT_TRIGGER_IDENTIFIER &&
      ct.trigger_config.timeout,
  );
  const CTTimeOutDaysValue =
    CTTimeOutList?.length >= 1 ? CTTimeOutList[0].trigger_config.timeout : null;

  return {
    CTL_EventWithSmartlistFiltering,
    CTL_EventWithEmptyFiltering,
    CTL_EmptyWithSmartlistFiltering,
    CTTimeOutDaysValue,
  };
};

export const getInitialFormValuesFromCTList = ({
  connected_triggers,
  withTimeout = false,
}: {
  connected_triggers: CadenceConnectedTriggerConfig[];
  withTimeout: boolean;
}) => {
  // CTL stands for : Connected Triggers List
  const {
    CTL_EventWithSmartlistFiltering,
    CTL_EventWithEmptyFiltering,
    CTL_EmptyWithSmartlistFiltering,
    CTTimeOutDaysValue,
  } = _resolveConnectedTriggersConfigurations({
    connected_triggers_list: connected_triggers,
  });

  if (
    CTL_EventWithSmartlistFiltering &&
    CTL_EventWithSmartlistFiltering.length >= 1
  ) {
    const connected_trigger = CTL_EventWithSmartlistFiltering[0];

    return {
      trigger_has_event: true,
      trigger_event_kind: connected_trigger.trigger_config.event_type,
      trigger_has_smartlist: true,
      trigger_smartlist_selected:
        connected_trigger.filtering_config.smartlist_pk,
      trigger_logic_between_event_and_smartlist:
        RuleBetweenEntryEvent.AND_RULE_BETWEEN_ENTRY_EVENT,
      ...(withTimeout && {
        trigger_destination_timeout_days: CTTimeOutDaysValue,
      }),
    };
  }

  if (CTL_EventWithEmptyFiltering && CTL_EventWithEmptyFiltering.length >= 1) {
    const connected_event_trigger = CTL_EventWithEmptyFiltering[0];
    if (
      CTL_EmptyWithSmartlistFiltering &&
      CTL_EmptyWithSmartlistFiltering.length >= 1
    ) {
      const connected_smartlist_trigger = CTL_EmptyWithSmartlistFiltering[0];
      return {
        trigger_has_event: true,
        trigger_event_kind: connected_event_trigger.trigger_config.event_type,
        trigger_has_smartlist: true,
        trigger_smartlist_selected:
          connected_smartlist_trigger.filtering_config.smartlist_pk,
        trigger_logic_between_event_and_smartlist:
          RuleBetweenEntryEvent.OR_RULE_BETWEEN_ENTRY_EVENT,
        ...(withTimeout && {
          trigger_destination_timeout_days: CTTimeOutDaysValue,
        }),
      };
    }
    return {
      trigger_has_event: true,
      trigger_event_kind: connected_event_trigger.trigger_config.event_type,
      trigger_has_smartlist: false,
      trigger_smartlist_selected: null,
      trigger_logic_between_event_and_smartlist:
        RuleBetweenEntryEvent.AND_RULE_BETWEEN_ENTRY_EVENT,
      ...(withTimeout && {
        trigger_destination_timeout_days: CTTimeOutDaysValue,
      }),
    };
  }

  if (
    CTL_EmptyWithSmartlistFiltering &&
    CTL_EmptyWithSmartlistFiltering.length >= 1
  ) {
    const connected_trigger = CTL_EmptyWithSmartlistFiltering[0];
    return {
      trigger_has_event: false,
      trigger_event_kind: null,
      trigger_has_smartlist: true,
      trigger_smartlist_selected:
        connected_trigger.filtering_config.smartlist_pk,
      trigger_logic_between_event_and_smartlist:
        RuleBetweenEntryEvent.AND_RULE_BETWEEN_ENTRY_EVENT,
      ...(withTimeout && {
        trigger_destination_timeout_days: CTTimeOutDaysValue,
      }),
    };
  }

  if (withTimeout) {
    return {
      trigger_has_event: false,
      trigger_event_kind: null,
      trigger_has_smartlist: false,
      trigger_smartlist_selected: null,
      trigger_logic_between_event_and_smartlist:
        RuleBetweenEntryEvent.AND_RULE_BETWEEN_ENTRY_EVENT,
      ...(withTimeout && {
        trigger_destination_timeout_days: CTTimeOutDaysValue,
      }),
    };
  }
  return null;
};
