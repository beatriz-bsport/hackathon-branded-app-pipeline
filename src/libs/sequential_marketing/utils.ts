import Immutable from 'seamless-immutable';
import Config from '../../config';
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

/** Checks if sequential marketing is authorized for a given company.
 *
 * @param {number} companyId - The ID of the company.
 * @param {boolean} hasUpsell - Indicates whether the company has the upsell ot not.
 * @returns {boolean} True if sequential marketing is authorized, otherwise false.
 */
export const isSequentialMarketingAuthorized = (
  companyId: number,
  hasUpsell: boolean,
) => {
  return Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' || hasUpsell;
};
