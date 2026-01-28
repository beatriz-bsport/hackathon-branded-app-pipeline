import Immutable from 'seamless-immutable';
import { Box, Position, Rect, Viewport } from 'react-flow-renderer';
import type {
  Cadence,
  CadenceInitialConfigurationState,
  CadenceStep,
  ConnectedTrigger,
  TriggerConfig,
  TriggerConfigTypeAssertion,
  TriggerEventConfig,
} from '#src/libs/sequential_marketing/types';
import {
  DestinationStatus,
  TriggerIdentifier,
} from '#src/libs/sequential_marketing/constants';
import { CADENCE_FINER_GRAIN_ALLOWED_EVENTS_LIST } from './constants/event';

export const isCadenceInitialConfigurationCompleted = (
  cadenceMinimalConfigurationState: CadenceInitialConfigurationState,
) => {
  return (
    cadenceMinimalConfigurationState?.cadenceLoseConfigured &&
    cadenceMinimalConfigurationState.cadenceWinConfigured &&
    cadenceMinimalConfigurationState.cadenceEntryConfigured
  );
};

export const getCadenceWinOrLoseConnectedTriggers = (
  cadence: Cadence,
  kind: DestinationStatus,
) => {
  switch (kind) {
    case DestinationStatus.WIN:
      return cadence.cadence_exits?.filter(
        (_exit) =>
          !_exit?.disabled &&
          _exit?.destination_config?.status === DestinationStatus.WIN,
      );
    case DestinationStatus.FAIL:
      return cadence.cadence_exits?.filter(
        (_exit) =>
          !_exit?.disabled &&
          _exit?.destination_config?.status === DestinationStatus.FAIL,
      );
    default:
      return [];
  }
};

/** Updates the source step 'exits' property by replacing the old ConnectedTrigger version by the new one.
 *
 * @remarks
 * This function is used to update the 'exits' property for each ConnectedTrigger
 * source step, where all the ConnectedTriggers are retrieved.
 * It is replacing the old ConnectedTrigger by its updated version
 * (with new destination_config) : updatedTrigger.
 *
 * @param {ConnectedTrigger} updatedTrigger - The updated ConnectedTrigger that will replace the old version.
 * @param {CadenceStep} sourceStep - The source step of the ConnectedTrigger.
 * @param {ConnectedTrigger[]} updatedExits - The 'exits' property of the source step already partially updated.
 * @returns {CadenceStep} The source step with its 'exits' property updated with updatedTrigger.
 */
export const updatedSourceStep = (
  updatedTrigger: ConnectedTrigger,
  sourceStep: Immutable.ImmutableObject<CadenceStep>,
  updatedExits?: ConnectedTrigger[],
): CadenceStep => {
  return {
    ...sourceStep,
    exits: [...(updatedExits || sourceStep.exits), updatedTrigger],
  };
};

/** Updates the source step 'exits' property by removing the disabled connected trigger.

@param {string} disabledTriggerUuid - The UUID of the disabled ConnectedTrigger.
@param {Immutable.ImmutableObject<CadenceStep>} sourceStep - The source step of the ConnectedTrigger.
@param {ConnectedTrigger[]} updatedExits - The 'exits' property of the source step already partially updated.
@returns {CadenceStep} The source step with its 'exits' property updated.
*/
export const updatedSourceStepWithDisabledConnectedTrigger = (
  disabledTriggerUuid: string,
  sourceStep: Immutable.ImmutableObject<CadenceStep>,
  updatedExits?: ConnectedTrigger[],
): CadenceStep => {
  return {
    ...sourceStep,
    exits: [
      ...((updatedExits || sourceStep?.exits)?.filter(
        (connectedTrigger) =>
          connectedTrigger.trigger_config.uuid !== disabledTriggerUuid,
      ) ?? []),
    ],
  };
};

export const rectToBox = ({ x, y, width, height }: Rect): Box => ({
  x,
  y,
  x2: x + width,
  y2: y + height,
});

export const boxToRect = ({ x, y, x2, y2 }: Box): Rect => ({
  x,
  y,
  width: x2 - x,
  height: y2 - y,
});

export function getNodeToolbarTransform(
  nodeRect: Rect,
  viewport: Viewport,
  position: Position,
  offset: number,
  align?: 'start' | 'end',
): string {
  // center
  let alignmentOffset = 0.5;

  if (align === 'start') {
    alignmentOffset = 0;
  } else if (align === 'end') {
    alignmentOffset = 1;
  }

  // we set the x any y position of the toolbar based on the nodes position
  let pos = [0, 0];
  // and than shift it based on the alignment. The shift values are in %.
  let shift = [0, 0];

  switch (position) {
    case Position.Right:
      pos = [
        (nodeRect.x + nodeRect.width) * viewport.zoom + viewport.x + offset,
        (nodeRect.y + nodeRect.height * alignmentOffset) * viewport.zoom +
          viewport.y,
      ];
      shift = [0, -100 * alignmentOffset];
      break;
    case Position.Bottom:
      pos[1] =
        (nodeRect.y + nodeRect.height) * viewport.zoom + viewport.y + offset;
      shift[1] = 0;
      break;
    case Position.Left:
      pos = [
        nodeRect.x * viewport.zoom + viewport.x - offset,
        (nodeRect.y + nodeRect.height * alignmentOffset) * viewport.zoom +
          viewport.y,
      ];
      shift = [-100, -100 * alignmentOffset];
      break;
    case Position.Top:
      pos = [
        (nodeRect.x + nodeRect.width * alignmentOffset) * viewport.zoom +
          viewport.x,
        nodeRect.y * viewport.zoom + viewport.y - offset,
      ];
      shift = [-100 * alignmentOffset, -100];
      break;
    default:
      pos = [0, 0];
      shift = [0, 0];
  }

  return `translate(${pos[0]}px, ${pos[1]}px) translate(${shift[0]}%, ${shift[1]}%)`;
}

/** Clean the trigger config by removing the filtered_pks field from it.
 *  Used when changing the event type on the audience event selector node.
 *  Prevents issues where old filtered_pks values could be retained when switching
 *  to other events that don't have finer graining, and avoids keeping incorrect data
 *  between finer graining events.
 *
 * @param {TriggerConfig} config - The base config to clean.
 * @returns {TriggerConfig} Cleaned config without a filtered_pks field.
 */
export function removeFilteredPks(config: TriggerConfig): TriggerConfig {
  // Check if the object is a TriggerEventConfig and so if he can have filtered_pks as a field
  if (config?.identifier === TriggerIdentifier.EVENT) {
    // destructure the object to extract filtered_pks value out of it
    const { filtered_pks, ...cleanedConfig } = config as TriggerEventConfig;
    return cleanedConfig; // returns the object without the filtered_pks field
  }
  return config; // returns the original object if not a TriggerEventConfig
}

/** The goal of this function is to take the trigger config parameter and to return
 *  a string to be able to assert and to validate which precise trigger config type it
 *  is out of these 3: TriggerEventConfig, TriggerTimeoutConfig, TriggerEmptyConfig.
 *  'event_type' only belongs to TriggerEventConfig, 'timeout' only belongs to
 *  TriggerTimeoutConfig, and if it is none of the two above, then it is a TriggerEmptyConfig.
 *
 * @param {TriggerConfig} config - The base config we want to assert the type.
 * @returns {string} a string indicating which trigger config type it is.
 */
export function getTriggerConfigType(
  config: TriggerConfig,
): TriggerConfigTypeAssertion {
  if ('event_type' in config) return 'TriggerEventConfig';
  if ('timeout' in config) return 'TriggerTimeoutConfig';
  return 'TriggerEmptyConfig';
}

/** The goal of this function is to take the trigger config parameter and to return
 *  a boolean to be able to assert and to validate if the trigger config is able to
 *  be used as finer grain trigger.
 *
 * @param {TriggerConfig} config - The base config we want to assert the type.
 * @returns {boolean} check if the trigger config has a valid finer grain setup
 */
export function checkIsValidFinerGrainTrigger(config: TriggerConfig) {
  if (!config) return false;

  const isTriggerConfigObject = typeof config === 'object';
  const isTriggerConfigEventType = 'event_type' in config;
  const hasTriggerConfigFilteredKeys = 'filtered_pks' in config;

  const eventConfig =
    isTriggerConfigObject && isTriggerConfigEventType
      ? (config as TriggerEventConfig)
      : null;

  return (
    eventConfig?.event_type != null &&
    CADENCE_FINER_GRAIN_ALLOWED_EVENTS_LIST.includes(eventConfig.event_type) &&
    hasTriggerConfigFilteredKeys &&
    Array.isArray(eventConfig?.filtered_pks) &&
    eventConfig?.filtered_pks?.length > 0
  );
}
