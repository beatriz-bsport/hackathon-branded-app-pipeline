import React from 'react';
import { useTranslation } from 'react-i18next';

import { TriggerIdentifier } from '#src/libs/sequential_marketing/constants';

import type { SmartList } from '#src/libs/smart-list/types';
import type { ConnectedTrigger } from '#src/libs/sequential_marketing/types';

export const useConnectedTriggerChip = () => {
  const { t } = useTranslation('marketing');

  /** Function returning the exact name corresponding to the event connected trigger in parameter
   * @param {TFunction} t - Translation function
   * @param {ConnectedTrigger} connected_trigger_config - Cadence event connected trigger config
   * @returns {string} - Return the corresponding translated name
   */
  const getEventTriggerDetailText = React.useCallback(
    (connected_trigger_config: ConnectedTrigger): string =>
      connected_trigger_config?.trigger_config?.identifier ===
      TriggerIdentifier.EVENT
        ? t(
            `cadence.form.event.${connected_trigger_config?.trigger_config?.event_type}`,
          )
        : '',
    [t],
  );

  /** Function returning the name corresponding to the connected trigger in parameter
   * @param {TFunction} t - Translation function
   * @param {ConnectedTrigger} connected_trigger_config - Cadence connected trigger config
   * @param {SmartList} smartlist - Smartlist used in connected_trigger_config filtering
   * @returns {string} - Return the corresponding translated name
   */
  const getTriggerLabel = React.useCallback(
    (
      connected_trigger_config: ConnectedTrigger,
      smartlist?: SmartList | undefined,
    ) => {
      switch (connected_trigger_config?.trigger_config?.identifier) {
        case TriggerIdentifier.EMPTY:
          return connected_trigger_config.filtering_config?.smartlist_pk ===
            smartlist?.id
            ? smartlist?.name || ''
            : '';

        case TriggerIdentifier.EVENT:
          return getEventTriggerDetailText(connected_trigger_config);

        case TriggerIdentifier.TIMEOUT:
          const timeoutDays =
            connected_trigger_config?.trigger_config?.timeout ?? 0;
          const timeoutHours =
            connected_trigger_config?.trigger_config?.timeout_hours ?? 0;

          const timeoutDayLabel = t(
            'cadence.triggers.timeout.timeout_days_chip',
            { count: timeoutDays },
          );
          const timeoutHourLabel = t(
            'cadence.triggers.timeout.timeout_hours_chip',
            { count: timeoutHours },
          );

          if (!timeoutDays) {
            return timeoutHourLabel;
          }
          if (!timeoutHours) {
            return timeoutDayLabel;
          }
          return timeoutDayLabel + ' + ' + timeoutHourLabel;

        default:
          return 'Error';
      }
    },
    [getEventTriggerDetailText, t],
  );

  return { getTriggerLabel };
};

export default useConnectedTriggerChip;
