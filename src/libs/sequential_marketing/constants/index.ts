import {
  CADENCE_EVENT_GROUPED_BY_CATEGORY,
  RuleBetweenEntryEvent,
  CADENCE_EVENT_ALL_CHOICES,
  CADENCE_EVENT_CATEGORY_CHOICES,
  Events,
  EventsCategory,
} from './event';

import {
  CADENCE_MARKETING_ACTION_CHOICES,
  MarketingActions,
  MarketingActionKind,
} from './marketing_actions';

import {
  TriggerIdentifier,
  DestinationKind,
  DestinationStatus,
  TriggerKind,
  DESTINATION_KIND_CHOICES,
  DESTINATION_STATUS_CHOICES,
  TRIGGER_DEFAULT_TIMEOUT_DAYS,
  TRIGGER_KIND_CHOICES,
  TRIGGER_TEMPORARY_ID,
} from './triggers';

import {
  DEFAULT_X_FOR_ENTRYSTEP,
  DEFAULT_X_FOR_EXIT,
  DEFAULT_X_FOR_INNERSTEP,
  DEFAULT_X_FOR_TRIGGER,
} from './steps';

import {
  DEFAULT_NODE_GAP,
  ELEMENT_MAX_WIDTH,
  ELEMENT_WIDTH,
  HEADER_HEIGHT,
  OUTPUT_SECTION_HEIGHT,
  OUTPUT_SECTION_WIDTH,
} from './graph';

import { FilterIdentifier } from './filters';

import { CadencePanelMode } from './panel';

import { SequentialMarketingColors } from './colors';

export {
  // EVENT
  EventsCategory,
  Events,
  RuleBetweenEntryEvent,
  CADENCE_EVENT_GROUPED_BY_CATEGORY,
  CADENCE_EVENT_ALL_CHOICES,
  CADENCE_EVENT_CATEGORY_CHOICES,
  // MARKETING ACTIONS
  MarketingActions,
  MarketingActionKind,
  CADENCE_MARKETING_ACTION_CHOICES,
  // TRIGGER
  TriggerIdentifier,
  DestinationKind,
  DestinationStatus,
  TriggerKind,
  DESTINATION_KIND_CHOICES,
  DESTINATION_STATUS_CHOICES,
  TRIGGER_DEFAULT_TIMEOUT_DAYS,
  TRIGGER_KIND_CHOICES,
  TRIGGER_TEMPORARY_ID,
  // FILTER
  FilterIdentifier,
  // PANEL
  CadencePanelMode,
  // COLORS
  SequentialMarketingColors,
  // STEPS
  DEFAULT_X_FOR_ENTRYSTEP,
  DEFAULT_X_FOR_EXIT,
  DEFAULT_X_FOR_INNERSTEP,
  DEFAULT_X_FOR_TRIGGER,
  // GRAPH
  DEFAULT_NODE_GAP,
  ELEMENT_MAX_WIDTH,
  ELEMENT_WIDTH,
  HEADER_HEIGHT,
  OUTPUT_SECTION_HEIGHT,
  OUTPUT_SECTION_WIDTH,
};

export const SEQUENTIAL_MARKETING_AUTHORIZED_COMPANY_IDS = [498];
