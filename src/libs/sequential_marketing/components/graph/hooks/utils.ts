import { v4 as uuidv4 } from 'uuid';
import {
  DEFAULT_NODE_GAP,
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
  ((parseFloat(sourceCanvas?.position?.x) || 0) + DEFAULT_NODE_GAP).toString();

/** Computes the average of two input numbers and returns it as a string.
 * @param {number} a - The value of the first parameter.
 * @param {number} b - The value of the second parameter.
 * @returns {string} - The average position as a string.
 */
export const getMiddlePosition = (a: number, b: number) =>
  ((a + b) / 2).toString();

/** Determines the optimal position for the new ConnectedTrigger based on its source step and destination step positions.
 *
 * If the ConnectedTrigger lacks a destination step, it will be positioned to the right of its source step.
 * If the ConnectedTrigger has a destination step, it will be centered between its source and destination steps.
 *
 * @param {StoredStep} source - The source step of the ConnectedTrigger.
 * @param {StoredStep} destination - The destination step of the ConnectedTrigger, if connecting step to step.
 * @returns {GraphCanvas} - The calculated position for the ConnectedTrigger.
 */
export const getConnectedTriggerPosition = (
  source: StoredStep,
  destination?: StoredStep,
): GraphCanvas => {
  if (destination?.canvas?.position && source?.canvas?.position)
    return {
      position: {
        x: getMiddlePosition(
          parseFloat(source.canvas.position.x),
          parseFloat(destination.canvas.position.x),
        ),
        y: getMiddlePosition(
          parseFloat(source.canvas.position.y),
          parseFloat(destination.canvas.position.y),
        ),
      },
    };
  return {
    position: {
      x: getHorizontalPositionFromSource(source?.canvas),
      y: source?.canvas?.position?.y,
    },
  };
};

/** Get the default values for a ConnectedTrigger.
 * @param {TriggerKind} triggerKind - Sequential marketing trigger kind
 * @param {StoredStep} source - Source step of the trigger
 * @param {number} sourceId - Id of the trigger source step
 * @param {DestinationKind} destinationKind - Destination kind for the trigger
 * @param {StoredStep} destination - Destination step of the trigger, in case of connect step to step
 * @param {string} triggerUuid - Uuid of the trigger_config
 * @returns {ConnectedTrigger} - Return a ConnectedTrigger with default values
 */

type TriggerDefaultValuesParameters = {
  triggerKind: TriggerKind;
  source?: StoredStep;
  sourceId?: number;
  destinationKind?: DestinationKind;
  destination?: StoredStep;
  triggerUuid?: string;
};

export const getConnectedTriggerDefaultValues = ({
  triggerKind,
  source,
  sourceId,
  destinationKind,
  destination,
  triggerUuid,
}: TriggerDefaultValuesParameters): ConnectedTrigger => {
  const position = getConnectedTriggerPosition(source, destination);

  switch (triggerKind) {
    case TriggerKind.ONLY_EVENT_TRIGGER:
      return {
        trigger_config: {
          uuid: triggerUuid || `${TRIGGER_TEMPORARY_ID}_${uuidv4()}`,
          identifier: TriggerIdentifier.EVENT,
          event_type: null,
        },
        destination_config: {
          source_id: source?.id || sourceId || null,
          destination_id: destination?.id || null,
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
        canvas: position,
      };
    case TriggerKind.ONLY_SMARTLIST_FILTERING:
      return {
        trigger_config: {
          uuid: TRIGGER_TEMPORARY_ID,
          identifier: TriggerIdentifier.EMPTY,
        },
        destination_config: {
          source_id: source?.id || sourceId || null,
          destination_id: destination?.id || null,
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
        canvas: position,
      };
    case TriggerKind.ONLY_TIMEOUT:
      return {
        trigger_config: {
          uuid: TRIGGER_TEMPORARY_ID,
          identifier: TriggerIdentifier.TIMEOUT,
          timeout: null,
        },
        destination_config: {
          source_id: source?.id || sourceId || null,
          destination_id: destination?.id || null,
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
        canvas: position,
      };
    case TriggerKind.EVENT_TRIGGER_AND_SMARTLIST_FILTERING:
      return {
        trigger_config: {
          uuid: TRIGGER_TEMPORARY_ID,
          identifier: TriggerIdentifier.EVENT,
          event_type: null,
        },
        destination_config: {
          source_id: source?.id || sourceId || null,
          destination_id: destination?.id || null,
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
        canvas: position,
      };
    default:
      return null;
  }
};

/** Returns a new ConnectedTrigger with the provided TriggerKind.
 * @param {ConnectedTrigger} connectedTrigger - The connected trigger to modify.
 * @param {TriggerKind} newKind - The new kind for the trigger.
 * @returns {ConnectedTrigger} - A modified ConnectedTrigger with the same destination and position but with the new kind.
 */
export const changeConnectedTriggerKind = (
  connectedTrigger: ConnectedTrigger,
  newKind: TriggerKind,
): ConnectedTrigger => {
  switch (newKind) {
    case TriggerKind.ONLY_EVENT_TRIGGER:
      return {
        ...connectedTrigger,
        trigger_config: {
          uuid: connectedTrigger.trigger_config.uuid,
          identifier: TriggerIdentifier.EVENT,
          event_type: null,
        },
        filtering_config: {
          uuid: connectedTrigger.filtering_config.uuid,
          identifier: FilterIdentifier.EMPTY,
          smartlist_pk: null,
        },
      };
    case TriggerKind.ONLY_SMARTLIST_FILTERING:
      return {
        ...connectedTrigger,
        trigger_config: {
          uuid: connectedTrigger.trigger_config.uuid,
          identifier: TriggerIdentifier.EMPTY,
        },
        filtering_config: {
          uuid: connectedTrigger.filtering_config.uuid,
          identifier: FilterIdentifier.SMARTLIST,
          smartlist_pk: null,
        },
      };
    case TriggerKind.ONLY_TIMEOUT:
      return {
        ...connectedTrigger,
        trigger_config: {
          uuid: connectedTrigger.trigger_config.uuid,
          identifier: TriggerIdentifier.TIMEOUT,
          timeout: null,
        },
        filtering_config: {
          uuid: connectedTrigger.filtering_config.uuid,
          identifier: FilterIdentifier.EMPTY,
          smartlist_pk: null,
        },
      };
    case TriggerKind.EVENT_TRIGGER_AND_SMARTLIST_FILTERING:
      return {
        ...connectedTrigger,
        trigger_config: {
          uuid: connectedTrigger.trigger_config.uuid,
          identifier: TriggerIdentifier.EVENT,
          event_type: null,
        },
        filtering_config: {
          uuid: connectedTrigger.filtering_config.uuid,
          identifier: FilterIdentifier.SMARTLIST,
          smartlist_pk: null,
        },
      };
    default:
      return null;
  }
};
