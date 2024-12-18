import { v4 as uuidv4 } from 'uuid';
import {
  DEFAULT_NODE_GAP,
  DestinationKind,
  DestinationStatus,
  FilterIdentifier,
  TRIGGER_DEFAULT_TIMEOUT_DAYS,
  TRIGGER_TEMPORARY_ID,
  TriggerIdentifier,
  TriggerKind,
} from '#src/libs/sequential_marketing/constants';
import type {
  ConnectedTrigger,
  DestinationConfig,
  GraphCanvas,
} from '#src/libs/sequential_marketing/types';
import type { StoredStep } from '#src/libs/sequential_marketing/components/graph/hooks/types';

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
const _getMiddlePosition = (a: number, b: number) => ((a + b) / 2).toString();

/** Determines the optimal position for the new ConnectedTrigger based on its source step and destination step positions.
 *
 * If the ConnectedTrigger lacks a destination step, it will be positioned to the right of its source step.
 * If the ConnectedTrigger has a destination step, it will be centered between its source and destination steps.
 *
 * @param {StoredStep} source - The source step of the ConnectedTrigger.
 * @param {StoredStep} destination - The destination step of the ConnectedTrigger, if connecting step to step.
 * @returns {GraphCanvas} - The calculated position for the ConnectedTrigger.
 */
const _getConnectedTriggerPosition = (
  source: StoredStep,
  destination?: StoredStep,
): GraphCanvas => {
  if (destination?.canvas?.position && source?.canvas?.position)
    return {
      position: {
        x: _getMiddlePosition(
          parseFloat(source.canvas.position.x),
          parseFloat(destination.canvas.position.x),
        ),
        y: _getMiddlePosition(
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
 * @param {StoredStep} destination - Destination step of the trigger, in case of connect step to step
 * @param {number} destinationId - Id of the trigger destination step
 * @param {DestinationKind} destinationKind - Destination kind for the trigger
 * @param {DestinationStatus} destinationStatus - Destination status for the trigger
 * @param {string} triggerUuid - Uuid of the trigger_config
 * @param {boolean} isTemporary - Indicates whether the trigger should have a temporary uuid or not
 * @returns {ConnectedTrigger} - Return a ConnectedTrigger with default values
 */

type TriggerDefaultValuesParameters = {
  triggerKind: TriggerKind;
  source?: StoredStep;
  sourceId?: number;
  destination?: StoredStep;
  destinationId?: number;
  destinationKind?: DestinationKind;
  destinationStatus?: DestinationStatus;
  triggerUuid?: string;
  isTemporary?: boolean;
};

export const getConnectedTriggerDefaultValues = ({
  triggerKind,
  source,
  sourceId,
  destination,
  destinationId,
  destinationKind,
  destinationStatus,
  triggerUuid,
  isTemporary,
}: TriggerDefaultValuesParameters): ConnectedTrigger => {
  const position = _getConnectedTriggerPosition(source, destination);

  const triggerConfigUuid =
    triggerUuid ||
    (isTemporary ? `${TRIGGER_TEMPORARY_ID}_${uuidv4()}` : uuidv4());

  const hasCanvasPosition =
    destinationKind &&
    [DestinationKind.STEP_TO_OUTSIDE, DestinationKind.STEP_TO_STEP].includes(
      destinationKind,
    );

  const destination_config: DestinationConfig = {
    source_id: source?.id || sourceId || null,
    destination_id: destination?.id || destinationId || null,
    kind: destinationKind || null,
    reason: null,
    status: destinationStatus || null,
    uuid: uuidv4(),
  };

  switch (triggerKind) {
    case TriggerKind.ONLY_EVENT_TRIGGER:
      return {
        trigger_config: {
          uuid: triggerConfigUuid,
          identifier: TriggerIdentifier.EVENT,
          event_type: null,
        },
        filtering_config: {
          identifier: FilterIdentifier.EMPTY,
          uuid: uuidv4(),
        },
        destination_config,
        ...(hasCanvasPosition ? { canvas: position } : {}),
      };
    case TriggerKind.ONLY_SMARTLIST_FILTERING:
      return {
        trigger_config: {
          uuid: triggerConfigUuid,
          identifier: TriggerIdentifier.EMPTY,
        },
        filtering_config: {
          identifier: FilterIdentifier.SMARTLIST,
          uuid: uuidv4(),
        },
        destination_config,
        ...(hasCanvasPosition ? { canvas: position } : {}),
      };
    case TriggerKind.ONLY_TIMEOUT:
      return {
        trigger_config: {
          uuid: triggerConfigUuid,
          identifier: TriggerIdentifier.TIMEOUT,
          timeout: TRIGGER_DEFAULT_TIMEOUT_DAYS,
        },
        filtering_config: {
          identifier: FilterIdentifier.EMPTY,
          uuid: uuidv4(),
        },
        destination_config,
        ...(hasCanvasPosition ? { canvas: position } : {}),
      };
    case TriggerKind.EVENT_TRIGGER_AND_SMARTLIST_FILTERING:
      return {
        trigger_config: {
          uuid: triggerConfigUuid,
          identifier: TriggerIdentifier.EVENT,
          event_type: null,
        },
        filtering_config: {
          identifier: FilterIdentifier.SMARTLIST,
          uuid: uuidv4(),
        },
        destination_config,
        ...(hasCanvasPosition ? { canvas: position } : {}),
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
        },
      };
    case TriggerKind.ONLY_TIMEOUT:
      return {
        ...connectedTrigger,
        trigger_config: {
          uuid: connectedTrigger.trigger_config.uuid,
          identifier: TriggerIdentifier.TIMEOUT,
          timeout: TRIGGER_DEFAULT_TIMEOUT_DAYS,
        },
        filtering_config: {
          uuid: connectedTrigger.filtering_config.uuid,
          identifier: FilterIdentifier.EMPTY,
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
        },
      };
    default:
      return null;
  }
};

/** Replaces the connected trigger uuid by a random one generated with uuidv4.
 * @param {ConnectedTrigger} connectedTrigger - The connected trigger to modify.
 * @returns {ConnectedTrigger} - A modified connected trigger with a new trigger_config uuid.
 */
export const refreshConnectedTriggerUuid = (
  connectedTrigger: ConnectedTrigger,
): ConnectedTrigger => ({
  ...connectedTrigger,
  trigger_config: {
    ...connectedTrigger.trigger_config,
    uuid: uuidv4(),
  },
});
