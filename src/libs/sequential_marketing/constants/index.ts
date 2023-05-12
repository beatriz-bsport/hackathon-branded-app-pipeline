import {
  CADENCE_EVENT_GROUPED_BY_CATEGORY,
  RuleBetweenEntryEvent,
  CADENCE_EVENT_ALL_CHOICES,
  Events,
  EventsCategory,
} from './event';

import {
  CADENCE_MARKETING_ACTION_CHOICES,
  CadenceMarketingActionsEnum,
} from './marketing_actions';

import {
  TriggerIdentifier,
  DestinationKind,
  DestinationStatus,
} from './triggers';

import { FilterIdentifier } from './filters';

import { CadencePanelMode } from './panel';

export {
  // EVENT
  EventsCategory,
  Events,
  RuleBetweenEntryEvent,
  CADENCE_EVENT_GROUPED_BY_CATEGORY,
  CADENCE_EVENT_ALL_CHOICES,
  // MARKETING ACTIONS
  CadenceMarketingActionsEnum,
  CADENCE_MARKETING_ACTION_CHOICES,
  // TRIGGER
  TriggerIdentifier,
  DestinationKind,
  DestinationStatus,
  // FILTER
  FilterIdentifier,
  // PANEL,
  CadencePanelMode,
};

export const SEQUENTIAL_MARKETING_AUTHORIZED_COMPANY_IDS = [498];
