// @ts-expect-error
import { faker } from '@faker-js/faker';
import { generateRandomInt } from '../../utils/factories';
import {
  FilterIdentifier,
  TriggerIdentifier,
  TriggerKind,
  CADENCE_EVENT_ALL_CHOICES,
  DESTINATION_KIND_CHOICES,
  DESTINATION_STATUS_CHOICES,
} from './constants';
import {
  ConnectedTrigger,
  DestinationConfig,
  FilteringConfig,
  GraphCanvas,
  TriggerEmptyConfig,
  TriggerEventConfig,
  TriggerTimeoutConfig,
} from './types';
import { smartlistFactory } from '#libs/smart-list/factories';

function TriggerEmptyConfigFactory(): TriggerEmptyConfig {
  return {
    uuid: faker.random.uuid(),
    identifier: TriggerIdentifier.EMPTY,
  };
}

function TriggerTimeoutConfigFactory(): TriggerTimeoutConfig {
  return {
    uuid: faker.random.uuid(),
    identifier: TriggerIdentifier.TIMEOUT,
    timeout: generateRandomInt(7),
  };
}

function TriggerEventConfigFactory(): TriggerEventConfig {
  return {
    uuid: faker.random.uuid(),
    identifier: TriggerIdentifier.EVENT,
    event_type:
      CADENCE_EVENT_ALL_CHOICES[
        generateRandomInt(CADENCE_EVENT_ALL_CHOICES.length - 1)
      ],
  };
}

function DestinationConfigFactory(): DestinationConfig {
  return {
    destination_id: generateRandomInt(100),
    kind: DESTINATION_KIND_CHOICES[
      generateRandomInt(DESTINATION_KIND_CHOICES.length - 1)
    ],
    reason: faker.hacker.phrase(),
    status:
      DESTINATION_STATUS_CHOICES[
        generateRandomInt(DESTINATION_STATUS_CHOICES.length - 1)
      ],
    uuid: faker.random.uuid(),
  };
}

function FilteringConfigFactory(smartlistId?: number): FilteringConfig {
  return {
    uuid: faker.random.uuid(),
    identifier: smartlistId
      ? FilterIdentifier.SMARTLIST
      : FilterIdentifier.EMPTY,
    smartlist_pk: smartlistId || null,
  };
}

function GraphCanvasFactory(): GraphCanvas {
  return {
    position: {
      x: generateRandomInt(100).toString(),
      y: generateRandomInt(100).toString(),
    },
  };
}

export function triggerFactory(
  kind?: TriggerKind | number,
  smartlistId?: number,
): Partial<ConnectedTrigger> {
  const triggerKind = kind ?? generateRandomInt(3);
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
      return triggerFactory(kind, smartlistFactory().id);
    return triggerFactory(kind);
  });
}
