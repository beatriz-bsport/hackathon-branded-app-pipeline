import { ErrorAndLoading } from '#libs/types';
import type {
  TriggerEnum,
  CadenceConnectedTriggerReasonEnum,
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

export type CadenceConnectedTriggerConfig<SmartList = number> = {
  uuid: string;
  disabled: boolean;
  trigger_config: {
    uuid: string;
    identifier: TriggerEnum;
    timeout?: number;
    event_type?: CadenceEventsEnum;
  };
  filtering_config: {
    uuid: string;
    identifier: FiltersEnum;
    smartlist_pk?: number;
    smartlist: SmartList | null;
  };
  destination_config: {
    id: number;
    kind: CadenceConnectedTriggerReasonEnum;
    reason: StepConnectedTriggerReasonEnum;
    source_id: number;
    status: CadenceDestinationEnum;
  };
  marketing_actions: {
    created_at: number;
    config: MarketingActions;
    uuid: string;
  };
};

export type StepConnectedTriggerConfig<SmartList = number> = {
  uuid: string;
  identifier: TriggerEnum;
  disabled: boolean;
  trigger_config: {
    uuid: string;
    identifier: TriggerEnum;
  };
  filtering_config: {
    uuid: string;
    identifier: FiltersEnum;
    smartlist_pk?: number;
    smartlist?: SmartList | null;
  };
  destination_config: {
    id: number;
    kind: StepDestinationEnum;
    reason: StepConnectedTriggerReasonEnum;
    source_id: number;
    status: CadenceDestinationEnum;
  };
  marketing_actions: {
    created_at: number;
    config: MarketingActions;
    uuid: string;
  };
  canvas: GraphCanvas;
};

export type CadenceTrackingDataBase = {
  member_pks_in: number[];
  by_member: {};
};

export type EntryActionConfigBase<
  Company = number,
  Step = number,
  Tag = number,
> = {
  company: Company;
  step: Step;
  kind: CadenceMarketingActionsEnum;
  text: string | null;
  email_design: number | null;
  title: string | null;
  disabled: boolean;
  date_created: string;
  date_updated: string;
  tag: Tag;
};

export type GraphCanvas = {
  positions: {
    x: number;
    y: number;
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
};

export type CadenceStepQueryParams = {
  id__in?: number[];
};

export type CadenceState = {
  cadence: {
    allIds: Array<number>;
    byId: { [id: number]: Cadence };
  } & ErrorAndLoading;
  step: {
    allIds: Array<number>;
    byId: { [id: number]: CadenceStep };
    subscribe: ErrorAndLoading;
  } & ErrorAndLoading;
} & ErrorAndLoading;
