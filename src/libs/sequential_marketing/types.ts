import type {
  TriggerIdentifier,
  Events,
  FilterIdentifier,
  DestinationKind,
  DestinationStatus,
} from './constants';

// ========== BACKEND MODELS & JSON SPECIFICATIONS ==========
export type Cadence = {
  id: number;
  company: number;
  name: string;
  active: boolean;
  archived: boolean;
  priority_index: number;
  entries: TriggerConfig[];
  cadence_exits: TriggerConfig[];
  steps: number[];
  entrypoint_step_id: number;
};

export type CadenceStep = {
  id: number;
  company: number;
  cadence: number;
  name: string;
  is_entrypoint: boolean;
  disabled: boolean;
  exits: any;
  canvas: GraphCanvas;
};

export type GraphCanvas = {
  positions: {
    x: string;
    y: string;
  };
};

export type TriggerConfigBaseDict = {
  uuid: string | null;
  identifier: string;
};

export interface TriggerEmptyConfig extends TriggerConfigBaseDict {
  identifier: TriggerIdentifier.EMPTY;
}

export interface TriggerTimeoutConfig extends TriggerConfigBaseDict {
  identifier: TriggerIdentifier.TIMEOUT;
  timeout: number;
}

export interface TriggerEventConfig extends TriggerConfigBaseDict {
  identifier: TriggerIdentifier.EVENT;
  event_type: Events;
}

export type TriggerConfig =
  | TriggerEmptyConfig
  | TriggerTimeoutConfig
  | TriggerEventConfig;

export type FilteringConfig = {
  uuid: string | null;
  smartlist_pk?: number | null;
  identifier: FilterIdentifier;
};

export type DestinationConfig = {
  destination_id: number;
  kind: DestinationKind;
  reason: string;
  source_id?: number;
  status: DestinationStatus;
  uuid: string;
};

export type ConnectedTrigger = {
  uuid?: string;
  trigger_config: TriggerConfig;
  destination_config: DestinationConfig;
  filtering_config: FilteringConfig;
  disabled?: boolean;
  canvas: GraphCanvas;
};

// ========== API QUERY PARAMS==========
export type CadenceQueryParams = {
  id__in?: number[];
  page_size?: number;
};

export type CadenceStepQueryParams = {
  id__in?: number[];
};
