// @flow

import PeopleIcon from '@material-ui/icons/People';
import PaymentIcon from '@material-ui/icons/Payment';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import LensIcon from '@material-ui/icons/Lens';
import EventIcon from '@material-ui/icons/Event';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import CreditCardIcon from '@material-ui/icons/CreditCard';

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
    icon: EventIcon,
  },
  {
    id: 'sessions_detailed',
    name: 'Bookings',
    icon: EventAvailableIcon,
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
  {
    id: 'invoices',
    name: 'Paiements',
    icon: CreditCardIcon,
  },
];

export function getIconFromCategory(category: ReportCategoryEnum): * {
  const cat = CATEGORIES.find((c) => c.id === category);
  return (cat && cat.icon) || LensIcon;
}
