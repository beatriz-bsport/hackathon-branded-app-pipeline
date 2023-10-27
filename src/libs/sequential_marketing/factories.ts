import { faker } from '@faker-js/faker';

import { smartlistFactory } from '#libs/smart-list/factories';
import {
  FilterIdentifier,
  TriggerIdentifier,
  TriggerKind,
  CADENCE_EVENT_ALL_CHOICES,
  DESTINATION_KIND_CHOICES,
  DESTINATION_STATUS_CHOICES,
} from './constants';
import type {
  CadenceStep,
  ConnectedTrigger,
  DestinationConfig,
  FilteringConfig,
  GraphCanvas,
  StepMarketingActions,
  StepMarketingActionsCommunicationSpec,
  StepMarketingActionsTagSpec,
  TriggerEmptyConfig,
  TriggerEventConfig,
  TriggerTimeoutConfig,
} from './types';
import {
  CADENCE_MARKETING_ACTION_KIND_CHOICES,
  CADENCE_MARKETING_ACTION_CHOICES,
  MarketingActionKind,
} from './constants/marketing_actions';

function TriggerEmptyConfigFactory(): TriggerEmptyConfig {
  return {
    uuid: faker.string.uuid(),
    identifier: TriggerIdentifier.EMPTY,
  };
}

function TriggerTimeoutConfigFactory(): TriggerTimeoutConfig {
  return {
    uuid: faker.string.uuid(),
    identifier: TriggerIdentifier.TIMEOUT,
    timeout: faker.number.int({ max: 7, min: 1 }),
  };
}

function TriggerEventConfigFactory(): TriggerEventConfig {
  return {
    uuid: faker.string.uuid(),
    identifier: TriggerIdentifier.EVENT,
    event_type: faker.helpers.arrayElement(CADENCE_EVENT_ALL_CHOICES),
  };
}

function DestinationConfigFactory(): DestinationConfig {
  return {
    destination_id: faker.number.int(100),
    kind: faker.helpers.arrayElement(DESTINATION_KIND_CHOICES),
    reason: faker.hacker.phrase(),
    status: faker.helpers.arrayElement(DESTINATION_STATUS_CHOICES),
    uuid: faker.string.uuid(),
  };
}

function FilteringConfigFactory(smartlistId?: number): FilteringConfig {
  return {
    uuid: faker.string.uuid(),
    identifier: smartlistId
      ? FilterIdentifier.SMARTLIST
      : FilterIdentifier.EMPTY,
    smartlist_pk: smartlistId || null,
  };
}

function GraphCanvasFactory(): GraphCanvas {
  return {
    position: {
      x: faker.number.int(100).toString(),
      y: faker.number.int(100).toString(),
    },
  };
}

export function triggerFactory(
  kind?: TriggerKind | number,
  smartlistId?: number,
): Partial<ConnectedTrigger> {
  const triggerKind = kind ?? faker.number.int(3);
  switch (triggerKind) {
    case TriggerKind.ONLY_EVENT_TRIGGER:
      return {
        trigger_config: TriggerEventConfigFactory(),
        destination_config: DestinationConfigFactory(),
        filtering_config: FilteringConfigFactory(),
        canvas: GraphCanvasFactory(),
      };
    case TriggerKind.ONLY_SMARTLIST_FILTERING:
      return {
        trigger_config: TriggerEmptyConfigFactory(),
        destination_config: DestinationConfigFactory(),
        filtering_config: FilteringConfigFactory(smartlistId || 1),
        canvas: GraphCanvasFactory(),
      };
    case TriggerKind.EVENT_TRIGGER_AND_SMARTLIST_FILTERING:
      return {
        trigger_config: TriggerEventConfigFactory(),
        destination_config: DestinationConfigFactory(),
        filtering_config: FilteringConfigFactory(smartlistId || 1),
        canvas: GraphCanvasFactory(),
      };
    default:
      // TriggerKind.ONLY_TIMEOUT
      return {
        trigger_config: TriggerTimeoutConfigFactory(),
        destination_config: DestinationConfigFactory(),
        filtering_config: FilteringConfigFactory(),
        canvas: GraphCanvasFactory(),
      };
  }
}

export function triggerBatchFactory(
  length: number,
  smartlistIds?: number[],
): Partial<ConnectedTrigger>[] {
  const res: number[] = [];
  for (let i = 0; i < length; i += 1) {
    res.push(i);
  }
  return res.map((index) => {
    const kind = index % 4;
    if (
      kind === TriggerKind.ONLY_SMARTLIST_FILTERING ||
      TriggerKind.EVENT_TRIGGER_AND_SMARTLIST_FILTERING
    )
      return triggerFactory(
        kind,
        faker.helpers.arrayElement(smartlistIds) || smartlistFactory().id,
      );
    return triggerFactory(kind);
  });
}

export function cadenceStepFactory({
  name,
  company,
  cadence,
  is_entrypoint,
  disabled,
  exits,
}: Partial<CadenceStep>): CadenceStep {
  return {
    id: faker.number.int(),
    company: company || faker.number.int(100),
    cadence: cadence || faker.number.int(50),
    name: name || faker.lorem.word(),
    is_entrypoint: is_entrypoint || false,
    disabled: disabled || false,
    exits: exits || [],
    canvas: GraphCanvasFactory(),
  };
}

function stepMarketingActionsTagSpecFactory({
  tag_id,
}: Partial<StepMarketingActionsTagSpec>): StepMarketingActionsTagSpec {
  return { tag_id: tag_id || faker.number.int() };
}

function stepMarketingActionsCommunicationSpecFactory({
  email_design,
  text_content,
  subject,
  communication_kind,
}: Partial<StepMarketingActionsCommunicationSpec>): StepMarketingActionsCommunicationSpec {
  return {
    email_design: email_design || faker.number.int(50),
    text_content: text_content || faker.hacker.phrase(),
    subject: subject || faker.lorem.word(),
    communication_kind:
      communication_kind ||
      faker.helpers.arrayElement(CADENCE_MARKETING_ACTION_CHOICES),
  };
}

type StepMarketingActionFactoryProps = Partial<StepMarketingActions> &
  Partial<StepMarketingActionsCommunicationSpec> &
  Partial<StepMarketingActionsTagSpec>;

export function stepMarketingActionFactory({
  company,
  cadence_step,
  name,
  disabled,
  kind,
  email_design,
  communication_kind,
  tag_id,
}: StepMarketingActionFactoryProps): Partial<StepMarketingActions> {
  const factoryKind =
    kind || faker.helpers.arrayElement(CADENCE_MARKETING_ACTION_KIND_CHOICES);

  const factoryActionSpec =
    factoryKind === MarketingActionKind.TAG
      ? stepMarketingActionsTagSpecFactory({ tag_id })
      : stepMarketingActionsCommunicationSpecFactory({
          email_design,
          communication_kind,
        });

  return {
    id: faker.number.int(),
    company: company || faker.number.int(100),
    cadence_step: cadence_step || faker.number.int(50),
    name: name || faker.lorem.word(),
    disabled: disabled || false,
    kind: factoryKind,
    action_spec: factoryActionSpec,
  };
}
