import { v4 as uuidv4 } from 'uuid';
import {
  DestinationKind,
  FilterIdentifier,
  TRIGGER_TEMPORARY_ID,
  TriggerIdentifier,
  TriggerKind,
} from '#libs/sequential_marketing/constants';
import type {
  ConnectedTrigger,
  GraphCanvas,
} from '#libs/sequential_marketing/types';
import type { StoredStep } from '#libs/sequential_marketing/components/graph/hooks/types';

/** Determine the horizontal position of a node in the graph located 400 units away from its source.
 * @param {GraphCanvas} sourceCanvas - Position of the source node
 * @returns {string} - Return the horizontal position
 */
export const getHorizontalPositionFromSource = (sourceCanvas: GraphCanvas) =>
  (parseFloat(sourceCanvas?.position?.x) || 0 + 400).toString();

/** Get the default values for a ConnectedTrigger.
 * @param {TriggerKind} triggerKind - Sequential marketing trigger kind
 * @param {StoredStep} source - Source step of the trigger
 * @param {DestinationKind} destinationKind - Destination kind for the trigger
 * @returns {ConnectedTrigger} - Return a ConnectedTrigger with default values
 */
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
            x: getHorizontalPositionFromSource(source?.canvas),
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
            x: getHorizontalPositionFromSource(source?.canvas),
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
            x: getHorizontalPositionFromSource(source?.canvas),
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
            x: getHorizontalPositionFromSource(source?.canvas),
            y: source?.canvas?.position?.y,
          },
        },
      };
    default:
      return null;
  }
};
