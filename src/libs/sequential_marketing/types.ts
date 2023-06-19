import { ErrorAndLoading } from '#libs/types';

import type {
  TriggerIdentifier,
  Events,
  FilterIdentifier,
  DestinationKind,
  DestinationStatus,
  MarketingActionKind,
} from './constants';

// ========== BACKEND MODELS & JSON SPECIFICATIONS ==========
export type Cadence = {
  id: number;
  company: number;
  name: string;
  active: boolean;
  archived: boolean;
  priority_index: number;
  entries: ConnectedTrigger[];
  cadence_exits: ConnectedTrigger[];
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
  exits: ConnectedTrigger[];
  canvas: GraphCanvas;
};

export type GraphCanvas = {
  position: {
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
  trigger_config: TriggerConfig;
  destination_config: DestinationConfig;
  filtering_config: FilteringConfig;
  disabled?: boolean;
  canvas: GraphCanvas;
};

export type StepMarketingActionsCommunicationSpec = {
  email_design: number | null;
  text_content: string | null;
  subject: string | null;
  communication_kind: MarketingActionKind;
};

export type StepMarketingActionsTagSpec = {
  tag_id: number | null;
};

export type StepMarketingActions = {
  id: number;
  company: number;
  cadence_step: number;
  name: string;
  disabled: boolean;
  kind: MarketingActionKind;
  action_spec:
    | StepMarketingActionsCommunicationSpec
    | StepMarketingActionsTagSpec;
};

// ========== API QUERY PARAMS==========
export type CadenceQueryParams = {
  id__in?: number[];
  page_size?: number;
};

export type CadenceStepQueryParams = {
  id__in?: number[];
};

export type StepMarketingActionsParams = {
  id__in?: number;
  cadence?: number;
  cadence_step?: number;
  kind?: MarketingActionKind;
};

// ========== REDUX STATE ==========
export type SequentialMarketingState = {
  cadence: CadenceState;
} & { step: CadenceStepState } & {
  marketingActions: MarketingActionState;
} & ErrorAndLoading;

export type CadenceState = {
  allIds: Array<number>;
  byId: { [id: number]: Cadence };
} & ErrorAndLoading;

export type CadenceStepState = {
  allIds: Array<number>;
  byId: { [id: number]: CadenceStep };
  subscribe: ErrorAndLoading;
  position: ErrorAndLoading;
  trigger: TriggerState;
} & ErrorAndLoading;

export type MarketingActionState = {
  allIds: [];
  byId: { [id: number]: StepMarketingActions };
  byStepId: { [id: number]: StepMarketingActions[] };
  upsert: ErrorAndLoading;
} & ErrorAndLoading;

export type TriggerState = {
  allIds: [];
  byId: { [id: number]: ConnectedTrigger };
} & ErrorAndLoading;

// ========== COMPONENT TYPES ==========
export type GlobalCadenceChip = {
  name: string;
  icon: string;
};
