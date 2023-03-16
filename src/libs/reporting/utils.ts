import React from 'react';
import moment from 'moment-timezone';

import { TFunction } from 'i18next';
import { ClassNameMap } from '@material-ui/styles';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import LensIcon from '@material-ui/icons/Lens';
import EventIcon from '@material-ui/icons/Event';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import CategoryIcon from '@material-ui/icons/Category';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import EuroIcon from '@material-ui/icons/EuroSymbol';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import WorkshopIcon from '@material-ui/icons/Today';
import StarIcon from '@material-ui/icons/Star';
import PlusOneIcon from '@material-ui/icons/PlusOne';
import privateServiceIcon from '@material-ui/icons/AccessTime';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ReceiptIcon from '@material-ui/icons/Receipt';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import UpdateIcon from '@material-ui/icons/Update';
import StoreIcon from '@material-ui/icons/Store';
import CashBookIcon from '@material-ui/icons/BusinessCenter';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import {
  getCurrencyDisplay,
  getCurrencyDisplayWithPrice,
} from '../theme/selectors';
import type {
  ReportCategoryEnum,
  ReportCategory,
  ReportMetadataColumn,
  ReportMetadata,
  ReportConfiguration,
} from './types';

export const CATEGORIES: ReportCategory[] = [
  {
    id: 'members',
    icon: PeopleIcon,
  },
  {
    id: 'offers',
    icon: EventIcon,
  },
  {
    id: 'bookings',
    icon: EventAvailableIcon,
  },
  {
    id: 'payments',
    icon: CreditCardIcon,
  },
  {
    id: 'on_spot_payments',
    icon: CreditCardIcon,
  },
  {
    id: 'products',
    icon: ShoppingBasketIcon,
  },
  {
    id: 'invoices',
    icon: ShoppingBasketIcon,
  },
  {
    id: 'memberships',
    icon: AccountBoxIcon,
  },
  {
    id: 'basket',
    icon: ShoppingCartIcon,
  },
  {
    id: 'credit',
    name: 'Crédit',
    icon: getCurrencyDisplay() === '€' ? EuroIcon : AttachMoneyIcon,
  },
  {
    id: 'payment_sumup',
    name: 'Totaux paiements',
    icon: ReceiptIcon,
  },
  {
    id: 'private_cpasses',
    icon: AccountBoxIcon,
  },
  {
    id: 'private_cpasses_expired',
    icon: HourglassEmptyIcon,
  },
  {
    id: 'expired_pass',
    icon: HourglassEmptyIcon,
  },
  {
    id: 'shop',
    icon: StoreIcon,
  },
  {
    id: 'private_bookings',
    icon: EventAvailableIcon,
  },
  {
    id: 'discount',
    icon: CardGiftcardIcon,
  },
  {
    id: 'subscription',
    icon: UpdateIcon,
  },
  {
    id: 'first_booking',
    icon: PlusOneIcon,
  },
  {
    id: 'first_attendance',
    icon: PlusOneIcon,
  },
  {
    id: 'first_privatebooking',
    icon: PlusOneIcon,
  },
  {
    id: 'activities',
    icon: StarIcon,
  },
  {
    id: 'workshop',
    name: 'Ateliers ',
    icon: WorkshopIcon,
  },
  {
    id: 'activityByEst',
    icon: WorkshopIcon,
  },
  {
    id: 'activityByCoach',
    icon: WorkshopIcon,
  },
  {
    id: 'privateService',
    icon: privateServiceIcon,
  },
  {
    id: 'privateService:Coach',
    icon: privateServiceIcon,
  },
  {
    id: 'privateServiceEst',
    icon: privateServiceIcon,
  },
  {
    id: 'dayBookings',
    icon: EventAvailableIcon,
  },
  {
    id: 'cashbook',
    icon: CashBookIcon,
  },
  {
    id: 'video',
    icon: VideoLibraryIcon,
  },
];

export function getCategory(categoryID: ReportCategoryEnum): ReportCategory {
  return (
    CATEGORIES.find((c) => c.id === categoryID) || {
      icon: CategoryIcon,
      id: categoryID,
    }
  );
}

export function getIconFromCategory(
  categoryID: ReportCategoryEnum,
): React.ReactElement {
  const cat = getCategory(categoryID);
  return (cat && cat.icon) || LensIcon;
}

export function getColumn(
  metadata: ReportMetadata,
  report: ReportConfiguration,
  column: string,
) {
  const reportMetadata = metadata?.results?.find(
    (r) => r.category === report.category,
  );

  if (!reportMetadata) return null;
  return (
    reportMetadata.columns?.find((c) => c.identifier === column) || {
      identifier: column,
      datatype: 'string',
    }
  );
}

// TODO Test it
export function getConverter(
  column: ReportMetadataColumn,
  classes: ClassNameMap<string>,
  t: TFunction,
) {
  if (!column || !column.datatype) {
    return (value: any) => ({ value });
  }
  const { datatype } = column;
  return (value: any) => {
    if (datatype === 'price') {
      if (typeof value === 'number' || !value) {
        return {
          cellProps: { className: classes.right },
          value: `${getCurrencyDisplayWithPrice(
            parseFloat(value || '0').toFixed(2),
          )}`,
        };
      }
    }
    if (datatype === 'number') {
      return {
        value: parseFloat(value || '0').toFixed(2),
      };
    }
    if (datatype === 'cts') {
      if (typeof value === 'number' || !value) {
        return {
          cellProps: { className: classes.right },
          value: `${getCurrencyDisplayWithPrice(
            (parseFloat(value || '0') / 100).toFixed(2),
          )}`,
        };
      }
    }
    if (datatype === 'int') {
      if (typeof value === 'number' || !value) {
        return {
          cellProps: { className: classes.right },
          value: parseInt(value || '0', 10),
        };
      }
    }
    if (datatype === 'percent') {
      if (typeof value === 'number' || !value) {
        return {
          cellProps: { className: classes.right },
          value: `${parseFloat(value || '0').toFixed(2)}%`,
        };
      }
    }
    if (datatype === 'time') {
      return {
        value,
      };
    }
    if (datatype === 'date') {
      return {
        value: value ? moment(value, 'YYYY-MM-DD').format('L') : '',
      };
    }
    if (datatype === 'dow') {
      return {
        value: moment.weekdays()[(parseInt(value, 10) + 1) % 7],
      };
    }
    if (datatype === 'boolean') {
      if (value) {
        return { value: t('yes') };
      }
      return { value: t('no') };
    }
    if (datatype === 'datetime') {
      if (value) {
        return {
          value: moment(value, 'YYYY-MM-DD[,] HH[:]mm').format('L HH[h]mm'),
        };
      }
      return '';
    }

    if (datatype === 'payout_status') {
      if (value) {
        return {
          value: t(`payment:payout.status.${value}`),
        };
      }
      return '';
    }
    if (datatype === 'product_type') {
      return { value: t(`product_type.${value}`) };
    }
    if (datatype === 'payment_method') {
      if (value && (typeof value === 'string' || !value)) {
        return {
          value: (value || '')
            .split(',')
            .map((v) => t(`payment_method.${v}`))
            .join(', '),
        };
      }
      return { value: t('payment_method.none') };
    }
    if (datatype === 'payment_method_with_credit_account') {
      return { value: t(`payment_method_with_credit_account.${value}`) };
    }
    if (datatype === 'dispute_status') {
      return { value: t(`payment:disputeStatus.${value}`) };
    }
    return { value };
  };
}
