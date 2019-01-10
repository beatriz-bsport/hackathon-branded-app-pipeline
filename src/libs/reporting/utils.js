// @flow

import PeopleIcon from '@material-ui/icons/People';
import PaymentIcon from '@material-ui/icons/Payment';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import LensIcon from '@material-ui/icons/Lens';

import type { ReportCategoryEnum, ReportCategory } from './types';

export const CATEGORIES: ReportCategory[] = [
  {
    id: 'members',
    name: 'Membres',
    icon: PeopleIcon,
  },
  {
    id: 'sessions',
    name: 'Sessions',
    icon: null,
  },
  {
    id: 'sessions_detailed',
    name: 'Bookings',
    icon: null,
  },
  {
    id: 'payments',
    name: 'Payments',
    icon: PaymentIcon,
  },
  {
    id: 'products',
    name: 'Products',
    icon: ShoppingBasketIcon,
  },
];

export function getIconFromCategory(category: ReportCategoryEnum): * {
  return CATEGORIES.find((c) => c.id === category).icon || LensIcon;
}
