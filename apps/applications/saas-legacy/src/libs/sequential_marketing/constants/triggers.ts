export enum TriggerIdentifier {
  EMPTY = 'empty',
  TIMEOUT = 'timeout',
  EVENT = 'event',
}

export enum DestinationKind {
  OUTSIDE_TO_STEP = 'outside_to_step',
  STEP_TO_OUTSIDE = 'step_to_outside',
  STEP_TO_STEP = 'step_to_step',
  CADENCE_TO_OUTSIDE = 'cadence_to_outside',
}

export const DESTINATION_KIND_CHOICES = [
  DestinationKind.OUTSIDE_TO_STEP,
  DestinationKind.STEP_TO_OUTSIDE,
  DestinationKind.STEP_TO_STEP,
  DestinationKind.CADENCE_TO_OUTSIDE,
];

export enum DestinationStatus {
  WIN = 'WIN',
  FAIL = 'FAIL',
}

export const DESTINATION_STATUS_CHOICES = [
  DestinationStatus.WIN,
  DestinationStatus.FAIL,
];

/**
 * @description This TriggerKind enum contains the 4 different types of trigger
  - ONLY_EVENT_TRIGGER:
    a trigger which is only linked to an event,
    occurs when a member triggers the event
  - ONLY_SMARTLIST_FILTERING:
    a trigger which is only linked to a smartlist,
    occurs when a member is in the smartlist or enters it
  - EVENT_TRIGGER_AND_SMARTLIST_FILTERING:
    a trigger which is linked to an event and a smartlist,
    occurs when a member which is in the smartlist triggers the event
  - ONLY_TIMEOUT:
    a trigger which is only linked to a timeout,
    occurs when a member has been in the previous step during more than the timeout set
 */
export enum TriggerKind {
  ONLY_EVENT_TRIGGER = 0,
  ONLY_SMARTLIST_FILTERING = 1,
  EVENT_TRIGGER_AND_SMARTLIST_FILTERING = 2,
  ONLY_TIMEOUT = 3,
}

export const TRIGGER_KIND_CHOICES = [
  TriggerKind.ONLY_EVENT_TRIGGER,
  TriggerKind.ONLY_SMARTLIST_FILTERING,
  TriggerKind.EVENT_TRIGGER_AND_SMARTLIST_FILTERING,
  TriggerKind.ONLY_TIMEOUT,
];

/**
 * @description Uuid given to the temporary trigger used during the creation of a new step.
 */
export const TRIGGER_TEMPORARY_ID = 'faker-trigger-id';

/**
 * @description Temporary UUID assigned to the lost criteria timeout trigger during the initial setup
 *              of a workflow to configure the timeout for the lost criteria.
 */
export const LOST_OUTPUT_TIMEOUT_TRIGGER_ID = 'lost-output-timeout-trigger';

export const TRIGGER_DEFAULT_TIMEOUT_DAYS = 7;

export const TRIGGER_DEFAULT_ICON = 'Error';

// ============= TRIGGER SIZES =============

export const TRIGGER_FORM_DEFAULT_HEIGHT = 40;

export const TIMEOUT_TRIGGER_INPUT_WIDTH = 57;

// ========== CADENCE HANDLE STYLE ==========

export const TRIGGER_LEFT_HANDLE_STYLE = {
  left: '0px',
};
export const TRIGGER_RIGHT_HANDLE_STYLE = {
  right: '0px',
};

// ============= TRIGGER LIMITS =============

export const MAX_TOTAL_TRIGGERS = 5;
export const MAX_TOTAL_TRIGGERS_WITH_TIMEOUT = 6;
