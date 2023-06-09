// @ts-nocheck
import { ErrorAndLoading } from '#libs/types';
import type {
  TriggerEnum,
  CadenceDestinationEnum,
  StepConnectedTriggerReasonEnum,
  StepDestinationEnum,
  CadenceEventsEnum,
  CadenceMarketingActionsEnum,
  FiltersEnum,
  CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
  CADENCE_MARKETING_ACTION_SMS,
  CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
  CADENCE_MARKETING_ACTION_TAG_MANAGEMENT,
  CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
} from './constants';

export type MarketingActions = {
  [CADENCE_MARKETING_ACTION_WRITTEN_EMAIL]: { title: string; content: string };
  [CADENCE_MARKETING_ACTION_SMS]: { content: string };
  [CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION]: {
    title: string;
    content: string;
  };
  [CADENCE_MARKETING_ACTION_TAG_MANAGEMENT]: { title: string; content: string };
  [CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE]: { tag_id: number | null };
};

export type TriggerConfig = {
  uuid: string;
  identifier: TriggerEnum;
  timeout?: number;
  event_type?: CadenceEventsEnum;
};

export type FilterConfig<SmartList = number> = {
  uuid: string;
  identifier: FiltersEnum;
  smartlist_pk?: number;
  smartlist?: SmartList | null;
};

export type DestinationConfig<Kind, Reason, Status> = {
  id: number;
  kind: Kind;
  reason?: Reason;
  source_id: number;
  status: Status;
};

export type MarketingActionsConfig = {
  created_at: number;
  config: MarketingActions;
  uuid: string;
};
export type CadenceConnectedTriggerConfig<SmartList = number> = {
  uuid: string;
  disabled: boolean;
  trigger_config: TriggerConfig;
  filtering_config: FilterConfig<SmartList>;
  destination_config: DestinationConfig<
    StepDestinationEnum,
    StepConnectedTriggerReasonEnum,
    CadenceDestinationEnum
  >;
  marketing_actions?: MarketingActionsConfig;
};

export type StepConnectedTriggerConfig<SmartList = number> = {
  uuid: string;
  identifier: TriggerEnum;
  disabled: boolean;
  trigger_config: TriggerConfig;
  filtering_config: FilterConfig<SmartList>;
  destination_config: DestinationConfig<
    StepDestinationEnum,
    StepConnectedTriggerReasonEnum,
    CadenceDestinationEnum
  >;
  marketing_actions?: MarketingActionsConfig;
  canvas: GraphCanvas;
};

export type CadenceTrackingDataBase = {
  member_pks_in: number[];
  by_member: {};
};

export type GraphCanvas = {
  positions: {
    x: string;
    y: string;
  };
};

export type CadenceStep<
  Cadence = number,
  Company = number,
  StepExitConfig = StepConnectedTriggerConfig,
> = {
  id: number;
  cadence: Cadence;
  company: Company;
  name: string;
  is_entry_step: boolean;
  disabled: boolean;
  timeout_minute: number;
  exits: StepExitConfig[];
  canvas: GraphCanvas;
};

export type Cadence<
  Company = number,
  CadenceEntryConfig = CadenceConnectedTriggerConfig,
  CadenceExitConfig = CadenceConnectedTriggerConfig,
  CadenceTrackingData = CadenceTrackingDataBase,
  StepType = number,
> = {
  id: number;
  company: Company;
  name: string;
  active: boolean;
  archived: boolean;
  priority_index: number;
  timeout_minute: number;
  entries: CadenceEntryConfig[];
  exits: CadenceExitConfig[];
  tracking_data: CadenceTrackingData;
  steps: StepType[];
};

export type CadenceQueryParams = {
  id__in?: number[];
  page_size?: number;
};

export type CadenceStepQueryParams = {
  id__in?: number[];
};

export type CadenceState = {
  cadence: {
    allIds: number[];
    byId: { [id: number]: Cadence };
  } & ErrorAndLoading;
  step: {
    allIds: number[];
    byId: { [id: number]: CadenceStep };
    subscribe: ErrorAndLoading;
  } & ErrorAndLoading;
  marketingActions: {
    allIds: number[];
    byId: { [id: number]: StepMarketingActions };
    byStepId: { [id: number]: StepMarketingActions[] };
    upsert: ErrorAndLoading;
  } & ErrorAndLoading;
  trigger: {
    allIds: string[];
    byId: { [id: number]: StepConnectedTriggerConfig };
  } & ErrorAndLoading;
} & ErrorAndLoading;

export enum StepMarketingActionsKind {
  COMMUNICATION = 'COMMUNICATION',
  TAG = 'TAG',
}
export type StepMarketingActions = {
  id: number;
  company: number;
  cadence_step: number;
  name: string;
  disabled: boolean;
  kind: StepMarketingActionsKind;
  action_spec:
    | StepMarketingActionsCommunicationSpec
    | StepMarketingActionsTagSpec;
};

export type StepMarketingActionsCommunicationSpec = {
  email_design: number | null;
  text_content: string | null;
  subject: string | null;
  communication_kind: CadenceMarketingActionsEnum;
};

export type StepMarketingActionsTagSpec = {
  tag_id: number | null;
};

export type StepMarketinActionsParams = {
  id__in?: number;
  cadence?: number;
  cadence_step?: number;
  kind?: StepMarketingActionsKind;
};
