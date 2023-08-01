import {
  CADENCE_EVENT_GROUPED_BY_CATEGORY,
  RuleBetweenEntryEvent,
  CADENCE_EVENT_ALL_CHOICES,
  CadenceEventsEnum,
  CadenceEventCategoryEnum,
} from './event';

import {
  CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
  CADENCE_MARKETING_ACTION_SMS,
  CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
  CADENCE_MARKETING_ACTION_TAG_MANAGEMENT,
  CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
  CADENCE_MARKETING_ACTION_CHOICES,
  CadenceMarketingActionsEnum,
} from './marketing_actions';

import {
  // TRIGGER
  TriggerEnum,

  // CADENCE CONNECTED TRIGGERS REASONS
  CadenceConnectedTriggerReasonEnum,
  // CADENCE DESTINATION STATUS
  CadenceDestinationEnum,
  // STEP CONNECTED TRIGGERS REASONS
  StepConnectedTriggerReasonEnum,
  // STEP DESTINATION KIND
  StepDestinationEnum,
} from './triggers';

import { FiltersEnum } from './filters';

import { CadencePanelMode } from './panel';

export {
  // EVENT
  CadenceEventCategoryEnum,
  CadenceEventsEnum,
  RuleBetweenEntryEvent,
  CADENCE_EVENT_GROUPED_BY_CATEGORY,
  CADENCE_EVENT_ALL_CHOICES,
  // MARKETING ACTIONS
  CadenceMarketingActionsEnum,
  CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
  CADENCE_MARKETING_ACTION_SMS,
  CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
  CADENCE_MARKETING_ACTION_TAG_MANAGEMENT,
  CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
  CADENCE_MARKETING_ACTION_CHOICES,
  // TRIGGER
  TriggerEnum,
  // FILTER
  FiltersEnum,
  // CADENCE CONNECTED TRIGGERS REASONS
  CadenceConnectedTriggerReasonEnum,
  // CADENCE DESTINATION STATUS
  CadenceDestinationEnum,
  // STEP CONNECTED TRIGGERS REASONS
  StepConnectedTriggerReasonEnum,
  // STEP DESTINATION KIND
  StepDestinationEnum,
  // PANEL,
  CadencePanelMode,
};

export const SEQUENTIAL_MARKETING_AUTHORIZED_COMPANY_IDS = [
  498, 383, 412, 845, 432, 997, 1319, 434,
];

export const HANDLE_BUTTON_STYLE = {
  background: '#888',
  width: '14px',
  height: '14px',
};
