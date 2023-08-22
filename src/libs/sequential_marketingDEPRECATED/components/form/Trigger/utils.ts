import { CadenceConnectedTriggerConfig } from '#libs/sequential_marketingDEPRECATED/types';
import {
  // TRIGGERS
  TriggerEnum,
  // FILTERING
  FiltersEnum,
  RuleBetweenEntryEvent,
  CadenceDestinationEnum,
} from '#libs/sequential_marketingDEPRECATED/constants';

export const TRIGGER_DEFAULT_TIMEOUT_DAYS = 7;

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
    CTTimeOutList?.length >= 1
      ? CTTimeOutList[0].trigger_config.timeout
      : TRIGGER_DEFAULT_TIMEOUT_DAYS;

  const isExitFail = !!connected_triggers_list?.find(
    (ct) =>
      ct?.destination_config?.status ===
      CadenceDestinationEnum.CADENCE_DESTINATION_STATUS_EXIT_FAIL_STATUS,
  );

  const isExitSuccess = !!connected_triggers_list?.find(
    (ct) =>
      ct?.destination_config?.status ===
      CadenceDestinationEnum.CADENCE_DESTINATION_STATUS_EXIT_SUCCESS_STATUS,
  );
  return {
    CTL_EventWithSmartlistFiltering,
    CTL_EventWithEmptyFiltering,
    CTL_EmptyWithSmartlistFiltering,
    CTTimeOutDaysValue,
    isExitFail,
    isExitSuccess,
  };
};

export const getInitialFormValuesFromCTList = ({
  connected_triggers,
  withTimeout = false,
  withExit = false,
}: {
  connected_triggers: CadenceConnectedTriggerConfig[];
  withTimeout?: boolean;
  withExit?: boolean;
}) => {
  // CTL stands for : Connected Triggers List
  const {
    CTL_EventWithSmartlistFiltering,
    CTL_EventWithEmptyFiltering,
    CTL_EmptyWithSmartlistFiltering,
    CTTimeOutDaysValue,
    isExitFail,
    isExitSuccess,
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
      ...(withExit && {
        is_exit_fail: isExitFail,
        is_exit_success: isExitSuccess,
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
        ...(withExit && {
          is_exit_fail: isExitFail,
          is_exit_success: isExitSuccess,
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
      ...(withExit && {
        is_exit_fail: isExitFail,
        is_exit_success: isExitSuccess,
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
      ...(withExit && {
        is_exit_fail: isExitFail,
        is_exit_success: isExitSuccess,
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
      ...(withExit && {
        is_exit_fail: isExitFail,
        is_exit_success: isExitSuccess,
      }),
    };
  }
  return null;
};
