// @ts-nocheck
import { useTranslation } from 'react-i18next';
import { SvgIcon } from '@material-ui/core/SvgIcon';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import GroupIcon from '@material-ui/icons/Group';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import ErrorIcon from '@material-ui/icons/Error';
import TimerIcon from '@material-ui/icons/Timer';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import ReceiptIcon from '@material-ui/icons/Receipt';
import CreditCardIcon from '@material-ui/icons/CreditCard';

import {
  CadenceEventCategoryEnum,
  TriggerEnum,
  CADENCE_EVENT_GROUPED_BY_CATEGORY,
} from '../constants';

import type { CadenceConnectedTriggerConfig } from '../types';
import type { SmartList } from '#libs/smart-list/types';

type TriggerProps = {
  connected_trigger_config: CadenceConnectedTriggerConfig<SmartList>;
};

const categoryIconDict: {
  [key in CadenceEventCategoryEnum]: SvgIcon;
} = {
  [CadenceEventCategoryEnum.CADENCE_EVENT_PURCHASE_CATEGORY]: ShoppingCartIcon,
  [CadenceEventCategoryEnum.CADENCE_EVENT_BOOKING_CATEGORY]:
    ConfirmationNumberIcon,
  [CadenceEventCategoryEnum.CADENCE_EVENT_BASKET_CATEGORY]: ShoppingBasketIcon,
  [CadenceEventCategoryEnum.CADENCE_EVENT_INVOICE_CATEGORY]: ReceiptIcon,
  [CadenceEventCategoryEnum.CADENCE_EVENT_BILLING_PLAN_CATEGORY]:
    CreditCardIcon,
};

const categoryChipDict: { [key in CadenceEventCategoryEnum]: string } = {
  [CadenceEventCategoryEnum.CADENCE_EVENT_PURCHASE_CATEGORY]: 'purchase_chip',
  [CadenceEventCategoryEnum.CADENCE_EVENT_BOOKING_CATEGORY]: 'book_chip',
  [CadenceEventCategoryEnum.CADENCE_EVENT_BASKET_CATEGORY]: 'basket_chip',
  [CadenceEventCategoryEnum.CADENCE_EVENT_INVOICE_CATEGORY]: 'invoice_chip',
  [CadenceEventCategoryEnum.CADENCE_EVENT_BILLING_PLAN_CATEGORY]:
    'billing_plan_chip',
};

const getEventCategoryIcon: (eventType: string) => SvgIcon = (
  event_type: string,
) => {
  for (const category in CadenceEventCategoryEnum) {
    if (CADENCE_EVENT_GROUPED_BY_CATEGORY[category].includes(event_type)) {
      return categoryIconDict[category];
    }
  }
  return ErrorIcon;
};

const getEventCategoryText: (eventType: string) => string = (
  event_type: string,
) => {
  for (const category in CadenceEventCategoryEnum) {
    if (CADENCE_EVENT_GROUPED_BY_CATEGORY[category].includes(event_type)) {
      return categoryChipDict[category];
    }
  }
  return 'label';
};

export const TriggerIcon = ({ connected_trigger_config }: TriggerProps) => {
  switch (connected_trigger_config?.trigger_config?.identifier) {
    case TriggerEnum.EMPTY_TRIGGER_IDENTIFIER:
      if (connected_trigger_config?.filtering_config?.smartlist_pk) {
        return GroupIcon;
      }
      return AllInclusiveIcon;
    case TriggerEnum.EVENT_TRIGGER_IDENTIFIER:
      return getEventCategoryIcon(
        connected_trigger_config?.trigger_config?.event_type,
      );
    case TriggerEnum.TIMEOUT_TRIGGER_IDENTIFIER:
      return TimerIcon;
    default:
      return ErrorIcon;
  }
};

export const TriggerText = ({ connected_trigger_config }: TriggerProps) => {
  const { t } = useTranslation('marketing');

  switch (connected_trigger_config?.trigger_config?.identifier) {
    case TriggerEnum.EMPTY_TRIGGER_IDENTIFIER:
      if (connected_trigger_config?.filtering_config?.smartlist_pk) {
        return connected_trigger_config?.filtering_config?.smartlist?.name;
      }
      return t('All');
    case TriggerEnum.EVENT_TRIGGER_IDENTIFIER:
      return t(
        `cadence.triggers.events.${getEventCategoryText(
          connected_trigger_config?.trigger_config?.event_type,
        )}`,
      );
    case TriggerEnum.TIMEOUT_TRIGGER_IDENTIFIER:
      return t('cadence.triggers.timeout.timout_days_chip', {
        days: connected_trigger_config?.trigger_config?.timeout || 0,
      });
    default:
      return t('Error');
  }
};
