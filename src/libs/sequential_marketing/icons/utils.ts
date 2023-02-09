import { useTranslation } from 'react-i18next';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import GroupIcon from '@material-ui/icons/Group';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import ErrorIcon from '@material-ui/icons/Error';
import TimerIcon from '@material-ui/icons/Timer';

import { TriggerEnum } from '../constants';

import type { CadenceConnectedTriggerConfig } from '../types';
import type { SmartList } from '#libs/smart-list/types';

type TriggerProps = {
  connected_trigger_config: CadenceConnectedTriggerConfig<SmartList>;
};

export const TriggerIcon = ({ connected_trigger_config }: TriggerProps) => {
  if (
    connected_trigger_config?.trigger_config?.identifier ===
    TriggerEnum.EMPTY_TRIGGER_IDENTIFIER
  ) {
    if (connected_trigger_config?.filtering_config?.smartlist_pk) {
      return GroupIcon;
    }
    return AllInclusiveIcon;
  }
  if (
    connected_trigger_config?.trigger_config?.identifier ===
    TriggerEnum.EVENT_TRIGGER_IDENTIFIER
  ) {
    return ShoppingCartIcon;
  }
  if (
    connected_trigger_config?.trigger_config?.identifier ===
    TriggerEnum.TIMEOUT_TRIGGER_IDENTIFIER
  ) {
    return TimerIcon;
  }
  return ErrorIcon;
};

export const TriggerText = ({ connected_trigger_config }: TriggerProps) => {
  const { t } = useTranslation('marketing');

  if (
    connected_trigger_config?.trigger_config?.identifier ===
    TriggerEnum.EMPTY_TRIGGER_IDENTIFIER
  ) {
    if (connected_trigger_config?.filtering_config?.smartlist_pk) {
      return connected_trigger_config?.filtering_config?.smartlist.name;
    }
    return t('All');
  }

  if (
    connected_trigger_config?.trigger_config?.identifier ===
    TriggerEnum.EVENT_TRIGGER_IDENTIFIER
  ) {
    return t('cadence.triggers.events.label');
  }

  if (
    connected_trigger_config?.trigger_config?.identifier ===
    TriggerEnum.TIMEOUT_TRIGGER_IDENTIFIER
  ) {
    return t('cadence.triggers.timeout.timout_days_chip', {
      days: connected_trigger_config?.trigger_config?.timeout || 0,
    });
  }

  return t('Error');
};
