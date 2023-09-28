import {
  FilterIdentifier,
  TRIGGER_TEMPORARY_ID,
  TriggerIdentifier,
  TriggerKind,
} from '#libs/sequential_marketing/constants';
import type { ConnectedTrigger } from '#libs/sequential_marketing/types';
import type { StoredStep } from '#libs/sequential_marketing/components/graph/hooks/types';

export const getDefaultValuesComplete: (
  kind: TriggerKind,
  source?: StoredStep,
) => ConnectedTrigger = (kind: TriggerKind, source?: StoredStep) => {
  switch (kind) {
    case TriggerKind.ONLY_EVENT_TRIGGER:
      return {
        trigger_config: {
          uuid: TRIGGER_TEMPORARY_ID,
          identifier: TriggerIdentifier.EVENT,
          event_type: null,
          timeout: null,
        },
        destination_config: {
          source_id: source?.id || null,
          destination_id: null,
          kind: null,
          reason: '',
          status: null,
          uuid: null,
        },
        filtering_config: {
          identifier: FilterIdentifier.EMPTY,
          uuid: null,
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
          event_type: null,
          timeout: null,
        },
        destination_config: {
          source_id: source?.id || null,
          destination_id: null,
          kind: null,
          reason: '',
          status: null,
          uuid: null,
        },
        filtering_config: {
          identifier: FilterIdentifier.SMARTLIST,
          uuid: null,
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
          event_type: null,
          timeout: null,
        },
        destination_config: {
          source_id: source?.id || null,
          destination_id: null,
          kind: null,
          reason: '',
          status: null,
          uuid: null,
        },
        filtering_config: {
          identifier: FilterIdentifier.EMPTY,
          uuid: null,
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
          timeout: null,
        },
        destination_config: {
          source_id: source?.id || null,
          destination_id: null,
          kind: null,
          reason: '',
          status: null,
          uuid: null,
        },
        filtering_config: {
          identifier: FilterIdentifier.SMARTLIST,
          uuid: null,
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
