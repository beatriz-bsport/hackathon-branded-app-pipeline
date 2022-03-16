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
import { getCurrencyDisplay } from '../theme/selectors';
import type { ReportCategoryEnum, ReportCategory } from './types';

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

export function getCategory(categoryID: ReportCategoryEnum): * {
  return (
    CATEGORIES.find((c) => c.id === categoryID) || {
      icon: CategoryIcon,
      id: categoryID,
    }
  );
}

export function getIconFromCategory(categoryID: ReportCategoryEnum): * {
  const cat = getCategory(categoryID);
  return (cat && cat.icon) || LensIcon;
}
