import Immutable from 'seamless-immutable';
import type {
  Cadence,
  CadenceInitialConfigurationState,
  CadenceStep,
  ConnectedTrigger,
} from '#libs/sequential_marketing/types';
import { DestinationStatus } from '#libs/sequential_marketing/constants';

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
 * @param {ConnectedTrigger[]} updatedExits - The the 'exits' property of the source step already partially updated.
 * @returns {CadenceStep} The source step with its 'exits' property updated with updatedTrigger.
 */
export const updatedSourceStep = (
  updatedTrigger: ConnectedTrigger,
  sourceStep: Immutable.ImmutableObject<CadenceStep>,
  updatedExits?: ConnectedTrigger[],
): CadenceStep => {
  return {
    ...sourceStep,
    exits: [
      ...((updatedExits || sourceStep.exits).filter(
        (trigger) =>
          trigger?.trigger_config?.uuid !==
          updatedTrigger?.trigger_config?.uuid,
      ) ?? []),
      updatedTrigger,
    ],
  };
};
