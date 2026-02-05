import { faker } from '@faker-js/faker';

import {
  FilterIdentifier,
  TriggerIdentifier,
  TriggerKind,
  CADENCE_EVENT_ALL_CHOICES,
  DESTINATION_KIND_CHOICES,
  DESTINATION_STATUS_CHOICES,
  CADENCE_MARKETING_ACTION_CHOICES,
  MarketingActionKind,
  MarketingActions,
  CadenceStatus,
  TagActionType,
} from './constants';
import type {
  Cadence,
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
    filtered_pks: [],
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
        faker.helpers.arrayElement(smartlistIds) ?? 0,
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
  return {
    tag_id: tag_id || faker.number.int(),
    tag_action_type: TagActionType.ADD,
  };
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
    kind || faker.helpers.arrayElement(Object.values(MarketingActionKind));

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

export function stepMarketingActionBatchFactory(
  length: number,
): Partial<StepMarketingActions>[] {
  const res: number[] = [];
  for (let i = 0; i < length; i += 1) {
    res.push(i);
  }
  return res.map((index) => {
    const kind = index % 5;
    return stepMarketingActionFactory({
      communication_kind: CADENCE_MARKETING_ACTION_CHOICES[kind],
      kind:
        CADENCE_MARKETING_ACTION_CHOICES[kind] === MarketingActions.ADD_TAG
          ? MarketingActionKind.TAG
          : MarketingActionKind.COMMUNICATION,
    });
  });
}

export function cadenceFactory({
  id,
  company,
  name,
  active,
  archived,
  priority_index,
  entries,
  cadence_exits,
  steps,
  entrypoint_step_id,
  initialized,
  is_multiple_visit_allowed,
  cadence_status,
  has_disabled_finer_grained_items,
}: Partial<Cadence>): Cadence {
  return {
    id: id || faker.number.int(),
    company: company || faker.number.int(100),
    name: name || faker.lorem.word(),
    active: active || true,
    archived: archived || true,
    priority_index: priority_index || faker.number.int(100),
    entries: entries || [],
    cadence_exits: cadence_exits || [],
    steps: steps || [],
    entrypoint_step_id: entrypoint_step_id || faker.number.int(),
    initialized: initialized || true,
    is_multiple_visit_allowed: is_multiple_visit_allowed || false,
    cadence_status:
      cadence_status ||
      faker.helpers.arrayElement(Object.values(CadenceStatus)),
    has_disabled_finer_grained_items: has_disabled_finer_grained_items || false,
  };
}

export const cadenceListFactory = (count: number) => {
  return faker.helpers.multiple(() => cadenceFactory({}), { count });
};
