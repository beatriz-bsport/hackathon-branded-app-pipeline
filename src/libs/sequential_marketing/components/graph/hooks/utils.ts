import { v4 as uuidv4 } from 'uuid';
import {
  DestinationKind,
  FilterIdentifier,
  TRIGGER_TEMPORARY_ID,
  TriggerIdentifier,
  TriggerKind,
} from '#libs/sequential_marketing/constants';
import type { ConnectedTrigger } from '#libs/sequential_marketing/types';
import type { StoredStep } from '#libs/sequential_marketing/components/graph/hooks/types';

export const getDefaultValuesComplete = (
  triggerKind: TriggerKind,
  source?: StoredStep,
  destinationKind?: DestinationKind,
): ConnectedTrigger => {
  switch (triggerKind) {
    case TriggerKind.ONLY_EVENT_TRIGGER:
      return {
        trigger_config: {
          uuid: TRIGGER_TEMPORARY_ID,
          identifier: TriggerIdentifier.EVENT,
          event_type: null,
        },
        destination_config: {
          source_id: source?.id || null,
          destination_id: null,
          kind: destinationKind || null,
          reason: null,
          status: null,
          uuid: uuidv4(),
        },
        filtering_config: {
          identifier: FilterIdentifier.EMPTY,
          uuid: uuidv4(),
          smartlist_pk: null,
        },
        canvas: {
          position: {
            x: (parseFloat(source?.canvas?.position?.x) || 0 + 400).toString(),
            y: source?.canvas?.position?.y,
          },
        },
      };
    case TriggerKind.ONLY_SMARTLIST_FILTERING:
      return {
        trigger_config: {
          uuid: TRIGGER_TEMPORARY_ID,
          identifier: TriggerIdentifier.EMPTY,
        },
        destination_config: {
          source_id: source?.id || null,
          destination_id: null,
          kind: destinationKind || null,
          reason: null,
          status: null,
          uuid: uuidv4(),
        },
        filtering_config: {
          identifier: FilterIdentifier.SMARTLIST,
          uuid: uuidv4(),
          smartlist_pk: null,
        },
        canvas: {
          position: {
            x: (parseFloat(source?.canvas?.position?.x) || 0 + 400).toString(),
            y: source?.canvas?.position?.y,
          },
        },
      };
    case TriggerKind.ONLY_TIMEOUT:
      return {
        trigger_config: {
          uuid: TRIGGER_TEMPORARY_ID,
          identifier: TriggerIdentifier.TIMEOUT,
          timeout: null,
        },
        destination_config: {
          source_id: source?.id || null,
          destination_id: null,
          kind: destinationKind || null,
          reason: null,
          status: null,
          uuid: uuidv4(),
        },
        filtering_config: {
          identifier: FilterIdentifier.EMPTY,
          uuid: uuidv4(),
          smartlist_pk: null,
        },
        canvas: {
          position: {
            x: (parseFloat(source?.canvas?.position?.x) || 0 + 400).toString(),
            y: source?.canvas?.position?.y,
          },
        },
      };
    case TriggerKind.EVENT_TRIGGER_AND_SMARTLIST_FILTERING:
      return {
        trigger_config: {
          uuid: TRIGGER_TEMPORARY_ID,
          identifier: TriggerIdentifier.EVENT,
          event_type: null,
        },
        destination_config: {
          source_id: source?.id || null,
          destination_id: null,
          kind: destinationKind || null,
          reason: null,
          status: null,
          uuid: uuidv4(),
        },
        filtering_config: {
          identifier: FilterIdentifier.SMARTLIST,
          uuid: uuidv4(),
          smartlist_pk: null,
        },
        canvas: {
          position: {
            x: (parseFloat(source?.canvas?.position?.x) || 0 + 400).toString(),
            y: source?.canvas?.position?.y,
          },
        },
      };
    default:
      return null;
  }
};
