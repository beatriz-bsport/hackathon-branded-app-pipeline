import { Cadence } from '#libs/sequential_marketing/types';
import { DestinationStatus } from '#libs/sequential_marketing/constants';

export const isMinimalCadenceConfigurationCompleted =
  (cadenceMinimalConfigurationState: {
    cadenceWinConfigured: boolean;
    cadenceLoseConfigured: boolean;
    cadenceEntryConfigured: boolean;
  }) => {
    return (
      cadenceMinimalConfigurationState.cadenceLoseConfigured &&
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
