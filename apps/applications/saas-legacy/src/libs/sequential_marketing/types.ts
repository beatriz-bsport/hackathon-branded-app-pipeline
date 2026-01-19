import React from 'react';
import type { Tag, TagGroupAPI } from '#src/libs/tag/types';
import type { ErrorAndLoading } from '#src/libs/types';
import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#src/libs/email-editor/types';
import EntryTriggerBubble from '#src/libs/sequential_marketing/components/graph/bubbles/EntryTriggerBubble.component';
import type {
  CadenceStatus,
  DestinationKind,
  DestinationStatus,
  Events,
  FilterIdentifier,
  InitialConfigurationStep,
  MarketingActionKind,
  MarketingActions,
  TriggerIdentifier,
  TriggerKind,
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
  initialized: boolean;
  is_multiple_visit_allowed: boolean;
  cadence_status: CadenceStatus;
  has_disabled_finer_grained_items: boolean;
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
  timeout: number; // Timeout in days
  timeout_hours?: number; // Additional timeout in hours
}

export interface TriggerEventConfig extends TriggerConfigBaseDict {
  identifier: TriggerIdentifier.EVENT;
  event_type: Events;
  filtered_pks?: number[];
}

export type TriggerConfigTypeAssertion =
  | 'TriggerEventConfig'
  | 'TriggerTimeoutConfig'
  | 'TriggerEmptyConfig';

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
  kind: DestinationKind | null;
  reason: string | null;
  status: DestinationStatus;
  uuid: string;
  source_id?: number;
};

export type ConnectedTrigger = {
  trigger_config: TriggerConfig;
  destination_config: DestinationConfig;
  filtering_config: FilteringConfig;
  canvas?: GraphCanvas;
  disabled?: boolean;
};

export type StepMarketingActionsCommunicationSpec = {
  email_design: number | null;
  text_content: string | null;
  subject: string | null;
  communication_kind: MarketingActions;
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

export type MarketingActionEssentials = {
  emailDetailList: { [templateId: number]: EmailTemplateDetail };
  emailDetailListLoading: boolean;
  emailSummaryList: EmailTemplateSummary[];
  emailSummaryListLoading: boolean;
  resolvedGenericTags: ResolvedGenericTags;
  tagCategories: { [tagName: string]: string[] };
  tagList: Tag<TagGroupAPI>[];
  fetchEmailSummaryList: () => void;
  getEmailDetail: (id: number) => void;
};

/** [TYPE] Object returned by convertCadenceExitIntoStep API call
 *  @param {ConnectedTrigger} trigger The connected trigger after update
 *  @param {CadenceStep} step The new step created as trigger destination
 */
export type UpdatedTrigger = {
  trigger: ConnectedTrigger;
  step: CadenceStep;
};

/** [TYPE] Object returned by convertCadenceStepIntoExit API call
 *  @param {ConnectedTrigger[]} triggers List of the connected triggers which had step as destination and have been updated
 *  @param {{ uuid: string; source_step: number }[]} disabled List of the disabled connected trigger uuids and their source steps
 *  @param {CadenceStep} step The step disabled to be replaced by exits
 */
export type UpdatedTriggersList = {
  triggers: ConnectedTrigger[];
  disabled: { uuid: string; source_step: number }[];
  step: CadenceStep;
};

/** [TYPE] Object returned by getGlobalMetrics API call.
 *
 *  @param {number} count_members_that_entered Number of members who entered the workflow.
 *  @param {number | nul} success_rate Success rate of the cadence (in %), or null if no success has been registered yet.
 *  @param {number | nul} average_success_time Average success time of the workflow (in seconds), or null if no success has been registered yet.
 *  @param {number} tags_count Number of tags applied within the cadence.
 *  @param {number} emails_count Number of email communications sent through the cadence.
 *  @param {number} sms_count Number of SMS communications sent through the cadence.
 *  @param {number} push_notif_count Number of push notification communications sent through the cadence.
 */
export type CadenceGlobalMetrics = {
  count_members_that_entered: number;
  success_rate: number | null;
  average_success_time: number | null;
  tags_count: number;
  emails_count: number;
  sms_count: number;
  push_notif_count: number;
};

/** [TYPE] Object returned by fetchMembersHistoric API call.
 *
 *  @param {string} member_id Member ID.
 *  @param {string} entry_date Date when the member entered the cadence.
 *  @param {string} exit_date Date when the member exited the cadence.
 *  @param {DestinationStatus | null} status Status assigned to the member upon exit.
 */
export type CadenceMembersOutData = {
  member_id: number;
  entry_date: string;
  exit_date: string;
  status: DestinationStatus | null;
};

/** [TYPE] Object returned by fetchPresentMembersData API call.
 *
 *  @param {string} member_id Member ID.
 *  @param {string} current_step_id ID of the current step of the member.
 *  @param {string} entry_date Date when the member entered the cadence.
 */
export type CadenceMembersInData = {
  member_id: number;
  photo: string | null;
  current_step_id: number;
  entry_date: string;
};

// ========== API QUERY PARAMS ==========
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

export type CadenceGlobalMetricsParams = {
  date_start: string;
  date_end: string;
};

export type CadencePaginatedMetricsParams = {
  page_size?: number;
  page?: number;
};

// =============== REDUX STATE ===============
export type SequentialMarketingState = {
  cadence: CadenceState;
} & { step: CadenceStepState } & {
  marketingActions: MarketingActionState;
} & {
  metrics: MetricsState;
} & ErrorAndLoading;

export type CadenceState = {
  allIds: number[];
  byId: { [id: number]: Cadence };
} & ErrorAndLoading;

export type CadenceStepState = {
  allIds: number[];
  byId: { [id: number]: CadenceStep };
  subscribe: ErrorAndLoading;
  position: ErrorAndLoading;
  trigger: TriggerState;
  memberIdsInStepByStepId: {
    data: { [id: number]: number[] };
  } & ErrorAndLoading;
} & ErrorAndLoading;

export type MarketingActionState = {
  allIds: number[];
  byId: { [id: number]: StepMarketingActions };
  byStepId: { [id: number]: StepMarketingActions[] };
  upsert: ErrorAndLoading;
} & ErrorAndLoading;

export type TriggerState = {
  allIds: number[];
  byId: { [id: number]: ConnectedTrigger };
} & ErrorAndLoading;

export type MetricsPaginatedResponse<T> = {
  page: number;
  count: number;
  next_page: number;
  page_size: number | null;
  results: T[];
};

export type MetricsState = {
  globalMetrics: {
    byCadenceId: { [cadenceId: number]: CadenceGlobalMetrics };
  } & ErrorAndLoading;
  membersHistoric: {
    byCadenceId: {
      [cadenceId: number]: {
        allData: MetricsPaginatedResponse<CadenceMembersOutData>;
        searchResult: MetricsPaginatedResponse<CadenceMembersOutData>;
      };
    };
  } & ErrorAndLoading;
  membersPresent: {
    byCadenceId: {
      [cadenceId: number]: {
        allData: MetricsPaginatedResponse<CadenceMembersInData>;
        searchResult: MetricsPaginatedResponse<CadenceMembersInData>;
      };
    };
  } & ErrorAndLoading;
};

// ========== COMPONENT TYPES ==========
export type GlobalCadenceChip = {
  name: string;
  icon: string;
};

// ========== INITIAL CONFIGURATION ==========
export type CadenceInitialConfigurationState = {
  cadenceWinConfigured: boolean;
  cadenceLoseConfigured: boolean;
  cadenceEntryConfigured: boolean;
};

export type CadenceInitialConfiguration = {
  [key in InitialConfigurationStep]?: {
    connectedTriggers: ConnectedTrigger[];
    marketingActions?: StepMarketingActions[];
  };
};

export type EntryStepFlowVersionData = {
  isEntryActionBubbleOpen: boolean;
  marketingActionEssentials: MarketingActionEssentials;
  connectedTriggersBubble: Pick<
    React.ComponentProps<typeof EntryTriggerBubble>,
    'onConfirm' | 'smartlists'
  >;
  isEntryFirstConfiguration?: boolean;
  createNewMarketingAction: (value: Partial<StepMarketingActions>) => void;
  upsertMarketingAction: (value: Partial<StepMarketingActions>) => void;
  deleteStepMarketingAction: (data: { id: number; stepId: number }) => void;
  submitMultipleMarketingActions: (data: StepMarketingActions[]) => void;
  onConnectToStep: (destinationId: number, triggerKind: TriggerKind) => void;
  setCurrentStepConfiguration: (
    currentStepConfiguration: InitialConfigurationStep,
  ) => void;
  position: { x: number; y: number };
};

export type CadenceFinnerGrainEventsSearchObjectTypes =
  | 'payment_pack'
  | 'shop_item'
  | 'giftcard'
  | 'private_pass'
  | 'contract';

export type FinnerGrainEventBaseSetup = {
  eventType: string;
  itemIds: number[];
};
