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

export enum DestinationStatus {
  WIN = 'WIN',
  FAIL = 'FAIL',
}
