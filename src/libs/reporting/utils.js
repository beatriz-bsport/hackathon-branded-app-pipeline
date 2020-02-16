// @flow

import PeopleIcon from '@material-ui/icons/People';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import LensIcon from '@material-ui/icons/Lens';
import EventIcon from '@material-ui/icons/Event';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import CategoryIcon from '@material-ui/icons/Category';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import EuroIcon from '@material-ui/icons/EuroSymbol';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ReceiptIcon from '@material-ui/icons/Receipt';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import UpdateIcon from '@material-ui/icons/Update';
import type { ReportCategoryEnum, ReportCategory } from './types';

export const CATEGORIES: ReportCategory[] = [
  {
    id: 'members',
    name: 'Membres',
    icon: PeopleIcon,
  },
  {
    id: 'offers',
    name: 'Séances',
    icon: EventIcon,
  },
  {
    id: 'bookings',
    name: 'Reservations (cours collectif)',
    icon: EventAvailableIcon,
  },
  {
    id: 'payments',
    name: 'Paiements',
    icon: CreditCardIcon,
  },
  {
    id: 'products',
    name: 'Products',
    icon: ShoppingBasketIcon,
  },
  {
    id: 'invoices',
    name: 'Achats',
    icon: ShoppingBasketIcon,
  },
  {
    id: 'memberships',
    name: 'Cartes de cours',
    icon: AccountBoxIcon,
  },
  {
    id: 'basket',
    name: 'Panier',
    icon: ShoppingCartIcon,
  },
  {
    id: 'credit',
    name: 'Crédit',
    icon: EuroIcon,
  },
  {
    id: 'payment_sumup',
    name: 'Totaux paiements',
    icon: ReceiptIcon,
  },
  {
    id: 'private_cpasses',
    name: 'Carte cours privé',
    icon: AccountBoxIcon,
  },
  {
    id: 'private_bookings',
    name: 'Reservations (cours privé)',
    icon: EventAvailableIcon,
  },
  {
    id: 'discount',
    name: 'Promotions',
    icon: CardGiftcardIcon,
  },
  {
    id: 'subscription',
    name: 'Abonnements récurrents',
    icon: UpdateIcon,
  },
];

export function getCategory(categoryID: ReportCategoryEnum): * {
  return (
    CATEGORIES.find((c) => c.id === categoryID) || {
      icon: CategoryIcon,
      name: categoryID,
      id: categoryID,
    }
  );
}

export function getIconFromCategory(categoryID: ReportCategoryEnum): * {
  const cat = getCategory(categoryID);
  return (cat && cat.icon) || LensIcon;
}
