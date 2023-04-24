// @ts-nocheck
import { CadenceEventsEnum } from '#libs/sequential_marketing/constants';
import type { Values } from '#libs/sequential_marketing/components/form/Trigger/components';
import {
  CADENCE_STEPPER_ENTRY_STEP,
  CADENCE_STEPPER_WIN_STEP,
  CADENCE_STEPPER_LOSE_STEP,
} from '#libs/sequential_marketing/components/form/CadenceSettingsFormStepper.component';
import { GraphCanvas } from '#libs/sequential_marketing/types';

export enum BackEndTriggerIdentifier {
  EMPTY = 'empty',
  TIMEOUT = 'timeout',
  EVENT = 'event',
}

export enum BackendFiltering {
  EMPTY = 'empty',
  SMARTLIST = 'smartlist',
}

export enum BackEndDestinationKind {
  OUTSIDE_TO_STEP = 'outside_to_step',
  STEP_TO_OUTSIDE = 'step_to_outside',
  STEP_TO_STEP = 'step_to_step',
  CADENCE_TO_OUTSIDE = 'cadence_to_outside',
}

export enum BackEndDestinationStatus {
  WIN = 'WIN',
  FAIL = 'FAIL',
}

export type BackEndTriggerConfigBaseDict = {
  uuid: string | null;
  identifier: string;
};

export interface BackEndTriggerEmptyConfigDict
  extends BackEndTriggerConfigBaseDict {
  identifier: BackEndTriggerIdentifier.EMPTY;
}

export interface BackEndTriggerTimeoutConfigDict
  extends BackEndTriggerConfigBaseDict {
  identifier: BackEndTriggerIdentifier.TIMEOUT;
  timeout: number;
}

export interface BackEndTriggerEventConfigDict
  extends BackEndTriggerConfigBaseDict {
  identifier: BackEndTriggerIdentifier.EVENT;
  event_type: CadenceEventsEnum;
}

export type BackEndTriggerConfigDict =
  | BackEndTriggerEmptyConfigDict
  | BackEndTriggerTimeoutConfigDict
  | BackEndTriggerEventConfigDict;

export type BackEndFilteringConfigDict = {
  uuid: string | null;
  smartlist_pk?: number | null;
  identifier: BackendFiltering;
};

export type BackEndDestinationConfigDict = {
  destination_id: number;
  kind: BackEndDestinationKind;
  reason: string;
  source_id?: number;
  status: BackEndDestinationStatus;
  uuid: string;
};

export type BackEndConnectedTriggerPayload = {
  uuid?: string;
  trigger_config: BackEndTriggerConfigDict;
  destination_config: BackEndDestinationConfigDict;
  filtering_config: BackEndFilteringConfigDict;
  disabled?: boolean;
  canvas: GraphCanvas;
};

export type FormValues = {
  [CADENCE_STEPPER_ENTRY_STEP]?: Values | {};
  [CADENCE_STEPPER_WIN_STEP]?: Values | {};
  [CADENCE_STEPPER_LOSE_STEP]?: Values | {};
};

export type ConnectedTriggerCreationBackEndPayload = {
  step?: {
    // Name, Canvas : Unused for ConnectedTrigger creation
    name?: string;
    id: number;
    canvas?: {
      position: {
        y: string; // as a decimal
        x: string; // as a decimal
      };
    };
  };
  connected_trigger: BackEndConnectedTriggerPayload;
};
