import { useTranslation } from 'react-i18next';
import SvgIcon from '@material-ui/core/SvgIcon';
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
  EventsCategory,
  TriggerIdentifier,
  CADENCE_EVENT_GROUPED_BY_CATEGORY,
  Events,
} from '../../constants';

import type { ConnectedTrigger } from '../../types';
import { SmartList } from '#libs/smart-list/types';

type TriggerIconProps = {
  connected_trigger_config: ConnectedTrigger;
};

type TriggerTextProps = {
  connected_trigger_config: ConnectedTrigger;
  smartlist: SmartList | undefined;
};
const categoryIconDict: {
  [key in EventsCategory]: typeof SvgIcon;
} = {
  [EventsCategory.CADENCE_EVENT_PURCHASE_CATEGORY]: ShoppingCartIcon,
  [EventsCategory.CADENCE_EVENT_BOOKING_CATEGORY]: ConfirmationNumberIcon,
  [EventsCategory.CADENCE_EVENT_BASKET_CATEGORY]: ShoppingBasketIcon,
  [EventsCategory.CADENCE_EVENT_INVOICE_CATEGORY]: ReceiptIcon,
  [EventsCategory.CADENCE_EVENT_BILLING_PLAN_CATEGORY]: CreditCardIcon,
};

const categoryChipDict: { [key in EventsCategory]: string } = {
  [EventsCategory.CADENCE_EVENT_PURCHASE_CATEGORY]: 'purchase_chip',
  [EventsCategory.CADENCE_EVENT_BOOKING_CATEGORY]: 'book_chip',
  [EventsCategory.CADENCE_EVENT_BASKET_CATEGORY]: 'basket_chip',
  [EventsCategory.CADENCE_EVENT_INVOICE_CATEGORY]: 'invoice_chip',
  [EventsCategory.CADENCE_EVENT_BILLING_PLAN_CATEGORY]: 'billing_plan_chip',
};

const getEventCategoryIcon: (eventType: Events) => typeof SvgIcon = (
  eventType: Events,
) => {
  for (const category of Object.keys(CADENCE_EVENT_GROUPED_BY_CATEGORY)) {
    // @ts-expect-error
    if (CADENCE_EVENT_GROUPED_BY_CATEGORY[category].includes(eventType)) {
      // @ts-expect-error
      return categoryIconDict[category];
    }
  }
  return ErrorIcon;
};

const getEventCategoryText: (eventType: Events) => string = (
  eventType: Events,
) => {
  for (const category in EventsCategory) {
    // @ts-expect-error
    if (CADENCE_EVENT_GROUPED_BY_CATEGORY[category].includes(eventType)) {
      // @ts-expect-error
      return categoryChipDict[category];
    }
  }
  return 'label';
};

export const TriggerIcon = ({ connected_trigger_config }: TriggerIconProps) => {
  switch (connected_trigger_config?.trigger_config?.identifier) {
    case TriggerIdentifier.EMPTY:
      if (connected_trigger_config?.filtering_config?.smartlist_pk) {
        return GroupIcon;
      }
      return AllInclusiveIcon;
    case TriggerIdentifier.EVENT:
      return getEventCategoryIcon(
        connected_trigger_config?.trigger_config?.event_type,
      );
    case TriggerIdentifier.TIMEOUT:
      return TimerIcon;
    default:
      return ErrorIcon;
  }
};

export const TriggerText = ({
  connected_trigger_config,
  smartlist,
}: TriggerTextProps) => {
  const { t } = useTranslation('marketing');

  switch (connected_trigger_config?.trigger_config?.identifier) {
    case TriggerIdentifier.EMPTY:
      if (
        connected_trigger_config?.filtering_config?.smartlist_pk &&
        connected_trigger_config?.filtering_config?.smartlist_pk ===
          smartlist?.id
      ) {
        return smartlist.name;
      }
      return t('All');
    case TriggerIdentifier.EVENT:
      return t(
        `cadence.triggers.events.${getEventCategoryText(
          connected_trigger_config?.trigger_config?.event_type,
        )}`,
      );
    case TriggerIdentifier.TIMEOUT:
      return t('cadence.triggers.timeout.timout_days_chip', {
        days: connected_trigger_config?.trigger_config?.timeout || 0,
      });
    default:
      return t('Error');
  }
};
