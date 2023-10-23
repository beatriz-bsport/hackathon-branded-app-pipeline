import React from 'react';
import { useTranslation } from 'react-i18next';

import { TriggerIdentifier } from '#libs/sequential_marketing/constants';
import {
  TriggerText,
  getEventCategoryText,
} from '#libs/sequential_marketing/components/helpers/utils';

import type { SmartList } from '#libs/smart-list/types';
import type { ConnectedTrigger } from '#libs/sequential_marketing/types';

export const useConnectedTriggerChip = () => {
  const { t } = useTranslation('marketing');

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
          if (
            connected_trigger_config.filtering_config?.smartlist_pk ===
            smartlist?.id
          ) {
            return smartlist.name;
          }
          return t('All');
        case TriggerIdentifier.EVENT:
          return t(
            `cadence.triggers.events.${getEventCategoryText(
              connected_trigger_config.trigger_config?.event_type,
            )}`,
          );
        case TriggerIdentifier.TIMEOUT:
          return t('cadence.triggers.timeout.timout_days_chip', {
            days: connected_trigger_config.trigger_config?.timeout || 0,
          });
        default:
          return t('Error');
      }
    },
    [t],
  );

  /** Function returning the exact name corresponding to the event connected trigger in parameter
   * @param {TFunction} t - Translation function
   * @param {ConnectedTrigger} connected_trigger_config - Cadence event connected trigger config
   * @returns {string} - Return the corresponding translated name
   */
  const getEventTriggerDetailText = React.useCallback(
    (connected_trigger_config: ConnectedTrigger) => {
      if (
        connected_trigger_config?.trigger_config?.identifier !==
        TriggerIdentifier.EVENT
      ) {
        return TriggerText({ connected_trigger_config });
      }
      return t(
        `cadence.form.event.${connected_trigger_config?.trigger_config?.event_type}`,
      );
    },
    [t],
  );

  return { getTriggerLabel, getEventTriggerDetailText };
};

export default useConnectedTriggerChip;
