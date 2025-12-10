/**
 * This file mirrors the type definitions from
 * apps/customer_data_platform/sequential_marketing/cadence_templates/types.py
 * in the bsport-django repository.
 *
 * Any changes made here must also be applied in that file to keep both
 * implementations aligned.
 */

import type { TFunction } from 'i18next';
import type {
  DestinationKind,
  DestinationStatus,
  Events as SequentialMarketingEventListened,
  FilterIdentifier as FilteringIdentifier,
  MarketingActionKind,
  MarketingActions as MarketingActionCommunicationKind,
  TriggerIdentifier,
} from '#src/libs/sequential_marketing/constants';
import {
  CoreBackendEnvironment,
  FeatureBranchIdentifier,
} from '#src/utils/environment';

export type PositionData = {
  x: string;
  y: string;
};

export type CanvasData = {
  position: PositionData;
};

export type TriggerConfigData = {
  identifier: TriggerIdentifier;
  timeout?: number | null;
  event_type?: SequentialMarketingEventListened | null;
  filtered_pks?: unknown[] | null;
};

export type DestinationConfigData = {
  reason?: string | null;
  source_id?: number | null;
  destination_id?: number | null;
  kind: DestinationKind;
  status?: DestinationStatus | null;
};

export type FilteringConfigData = {
  identifier: FilteringIdentifier;
  smartlist_pk?: number | null;
};

export type ConnectedTriggerData = {
  trigger_config: TriggerConfigData;
  destination_config: DestinationConfigData;
  filtering_config: FilteringConfigData;
  canvas?: CanvasData | null;
};

// Supported languages for email designs used in cadence templates: English, French, German
export type CadenceTemplateEmailDesign = {
  en: number | null;
  fr: number | null;
  de: number | null;
};

export type ActionSpecData = {
  subject?: string;
  email_design?: CadenceTemplateEmailDesign | null;
  text_content?: string;
  communication_kind?: MarketingActionCommunicationKind;
  tag_id?: number;
};

export type MarketingActionData = {
  name: string;
  kind: MarketingActionKind;
  action_spec: ActionSpecData;
};

export type StepData = {
  id: number;
  name: string;
  is_entrypoint: boolean;
  exits: ConnectedTriggerData[];
  canvas: CanvasData;
  marketing_actions: MarketingActionData[];
};

export type InitialConfigData = {
  entry_list: ConnectedTriggerData[];
  win_exit_list: ConnectedTriggerData[];
  lose_exit_list: ConnectedTriggerData[];
};

export type CadenceConfigData = {
  name: string;
  is_multiple_visit_allowed: boolean;
  initial_config: InitialConfigData;
  steps: StepData[];
};

export type CadenceTemplate = {
  description: string;
  cover: string;
  getConfig: (t: TFunction) => CadenceConfigData;
};

// Mapping of environments/feature branches to email design IDs for each supported language
export type CadenceTemplateEmailDesignMap = {
  [CoreBackendEnvironment.LOCAL]: CadenceTemplateEmailDesign;
  [CoreBackendEnvironment.DEV]: CadenceTemplateEmailDesign;
  [CoreBackendEnvironment.STAGING]: CadenceTemplateEmailDesign;
  [CoreBackendEnvironment.PRODUCTION]: CadenceTemplateEmailDesign;
  [FeatureBranchIdentifier.PIKACHU]: CadenceTemplateEmailDesign;
};
