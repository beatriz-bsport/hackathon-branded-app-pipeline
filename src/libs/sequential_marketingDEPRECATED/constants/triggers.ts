// @ts-nocheck
// BASE TRIGGERS
export enum TriggerEnum {
  EMPTY_TRIGGER_IDENTIFIER = 'trigger_empty',
  TIMEOUT_TRIGGER_IDENTIFIER = 'trigger_timeout',
  EVENT_TRIGGER_IDENTIFIER = 'trigger_event',
}

// CADENCE CONNECTED TRIGGERS REASONS
export enum CadenceConnectedTriggerReasonEnum {
  CADENCE_CONNECTED_TRIGGER_SMARTLIST_ENTRY_REASON = 'smartlist_entry',
  CADENCE_CONNECTED_TRIGGER_SMARTLIST_EXIT_REASON = 'smartlist_exit',
  CADENCE_CONNECTED_TRIGGER_TIMEOUT_EXIT_REASON = 'timeout_exit',
}

// CADENCE DESTINATION STATUS
export enum CadenceDestinationEnum {
  CADENCE_DESTINATION_STATUS_EXIT_FAIL_STATUS = 'cadence_exit_fail',
  CADENCE_DESTINATION_STATUS_EXIT_SUCCESS_STATUS = 'cadence_exit_success',
}

// STEP CONNECTED TRIGGERS REASONS

export enum StepConnectedTriggerReasonEnum {
  STEP_CONNECTED_TRIGGER_SMARTLIST_SWITCH_STEP_REASON = 'smartlist_switch_step',
  STEP_CONNECTED_TRIGGER_SMARTLIST_EXIT_CADENCE_REASON = 'smartlist_exit_cadence',
  STEP_CONNECTED_TRIGGER_EMPTY_SWITCH_STEP_REASON = 'empty_switch_step',
  STEP_CONNECTED_TRIGGER_TIMEOUT_EXIT_REASON = 'timeout_exit',
}

// STEP DESTINATION KIND
export enum StepDestinationEnum {
  STEP_DESTINATION_KIND = 'step',
  EXIT_DESTINATION_KIND = 'exit',
}
