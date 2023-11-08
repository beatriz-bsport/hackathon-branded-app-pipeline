// @ts-nocheck
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
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';
import {
  BillingPlanMetadataIdentifierEnum,
  MemberMetadataIdentifierEnum,
  MembersPurchaseMetadataIdentifierEnum,
  MetaActivityMetadataIdentifierEnum,
  OfferMetadataIdentifierEnum,
  SubscriptionMetadataIdentifierEnum,
  ExpenseMetadataIdentifierEnum,
  PaymentByInstalmentsMetadataIdentifierEnum,
  PrivateBookingMetadataIdentifierEnum,
  PrivateServiceMetadataIdentifierEnum,
  ShopItemMetadataIdentifierEnum,
  UnpaidPrivateBookingMetadataIdentifierEnum,
  VideoPurchaseMetadataIdentifierEnum,
  VideoMetadataIdentifierEnum,
  DayBookingsMetadataIdentifierEnum,
  FirstAttendanceMetadataIdentifierEnum,
  FirstBookingMetadataIdentifierEnum,
  BookingMetadataIdentifierEnum,
  FirstPrivateBookingMetadataIdentifierEnum,
  GiftcardMetadataIdentifierEnum,
  ConsumerGiftcardMetadataIdentifierEnum,
  PrivateConsumerPassMetadataIdentifierEnum,
  ExpiredConsumerPaymentPackMetadataIdentifierEnum,
  ConsumerPaymentPackMetadataIdentifierEnum,
  UniversalPassMetadataIdentifierEnum,
  BasketMetadataIdentifierEnum,
  CreditMetadataIdentifierEnum,
  InvoiceMetadataIdentifierEnum,
  PaymentMetadataIdentifierEnum,
  UnpaidInvoiceMetadataIdentifierEnum,
  OnSpotPaymentMetadataIdentifierEnum,
  DisputeMetadataIdentifierEnum,
  DiscountMetadataIdentifierEnum,
  PaymentSumupMetadataIdentifierEnum,
  ReferralGrantMetadataIdentifierEnum,
} from '@bsport/common/lib/master-data/metadata-identifiers';
import uniqBy from 'lodash/uniqBy';
import {
  BOOKING_STATUS_CANCELLED_BY_CONSUMER,
  BOOKING_STATUS_CANCELLED_BY_MANAGER,
  BOOKING_STATUS_CANCELLED_BY_OFFER,
  BOOKING_STATUS_OK,
} from '@bsport/common/lib/master-data/booking_status_code';
import {
  getCurrencyDisplay,
  getCurrencyDisplayWithPrice,
} from '../theme/selectors';
import type {
  ReportCategory,
  ReportMetadataColumn,
  ReportMetadata,
  ReportConfiguration,
  CellConverter,
} from './types';
import type {
  DataSourceFieldMetadata,
  DatatypeFilterConfigGroup,
  AllComparator,
  DataSourceMedadataDataType,
  DynamicFilterDataType,
} from '#libs/datatype-filtering/types';
import { checkIdentifierAlreadyExist } from '#libs/datatype-filtering/utils';
import {
  DATATYPE_FILTERABLE_BY_ID_IN,
  FILTER_EQUAL_OPERAND,
  FILTER_GTE_OPERAND,
  FILTER_IN_OPERAND,
  FILTER_LTE_OPERAND,
  FILTER_NOT_EQUAL_OPERAND,
  FILTER_OUT_OPERAND,
  HOUR_SUBDATA_TYPE,
  ReportFilterableDataType,
} from '#libs/datatype-filtering/constants';
import { handleGetDynamicDataForFiltersReturn } from '#libs/datatype-filtering/dynamic-data-hoc';
import {
  GREEN_GREY_BOOLEAN_CHIPS,
  RED_GREEN_BOOLEAN_CHIPS,
  RED_GREEN_INVERTED_BOOLEAN_CHIPS,
  STATUS_CHIPS,
  CONDITION_CHIPS,
} from './constants';

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
export const getConverter = (
  column: ReportMetadataColumn,
  classes: ClassNameMap<string>,
  t: TFunction,
): CellConverter => {
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
    if (datatype === 'payout_status' && typeof value === 'number') {
      return { value: t(`payment:payout.status.${value}`) };
    }
    return { value };
  };
};

const dateConverterToLink = (date: string): string => {
  return moment(date, 'YYYY-MM-DD[,] HH[:]mm').format('YYYY/MM/DD');
};

type GenerateRowLinkProps = {
  reportCategory: string;
  rowExtraData: { [key: string]: string | number | null };
};

export const generateRowLink = ({
  reportCategory,
  rowExtraData,
}: GenerateRowLinkProps) => {
  switch (reportCategory) {
    case ReportCategoryEnum.BILLING_PLAN:
      if (rowExtraData[BillingPlanMetadataIdentifierEnum.BILLING_PLAN_PK])
        return `/subscription/${
          rowExtraData[BillingPlanMetadataIdentifierEnum.BILLING_PLAN_PK]
        }`;
      break;

    case ReportCategoryEnum.MEMBERS:
      if (rowExtraData[MemberMetadataIdentifierEnum.MEMBER_PK])
        return `/member/${
          rowExtraData[MemberMetadataIdentifierEnum.MEMBER_PK]
        }/info`;
      break;

    case ReportCategoryEnum.MEMBERS_PURCHASE:
      if (rowExtraData[MembersPurchaseMetadataIdentifierEnum.MEMBER_PK])
        return `/member/${
          rowExtraData[MembersPurchaseMetadataIdentifierEnum.MEMBER_PK]
        }/info`;
      break;

    case ReportCategoryEnum.ACTIVITIES:
      if (rowExtraData[MetaActivityMetadataIdentifierEnum.META_ACTIVITY_PK])
        return `/activity/${
          rowExtraData[MetaActivityMetadataIdentifierEnum.META_ACTIVITY_PK]
        }/general`;
      break;

    case ReportCategoryEnum.WORKSHOP:
      if (rowExtraData[MetaActivityMetadataIdentifierEnum.META_ACTIVITY_PK])
        return `/workshop-activity/${
          rowExtraData[MetaActivityMetadataIdentifierEnum.META_ACTIVITY_PK]
        }/general`;
      break;

    case ReportCategoryEnum.OFFERS:
      if (
        rowExtraData[OfferMetadataIdentifierEnum.DATE_START_DATE] &&
        rowExtraData[OfferMetadataIdentifierEnum.OFFER_ID]
      ) {
        return `/offer/${
          rowExtraData[OfferMetadataIdentifierEnum.OFFER_ID]
        }`;
      }
      break;

    case ReportCategoryEnum.SUBSCRIPTION:
      if (rowExtraData[SubscriptionMetadataIdentifierEnum.INVOICE_PK])
        return `/invoice/${
          rowExtraData[SubscriptionMetadataIdentifierEnum.INVOICE_PK]
        }`;
      break;

    case ReportCategoryEnum.PRIVATE_SERVICE:
      if (rowExtraData[PrivateServiceMetadataIdentifierEnum.PRIVATE_SERVICE_PK])
        return `/private-service/service/${
          rowExtraData[PrivateServiceMetadataIdentifierEnum.PRIVATE_SERVICE_PK]
        }/general`;
      break;

    case ReportCategoryEnum.DAY_BOOKINGS:
      if (rowExtraData[DayBookingsMetadataIdentifierEnum.DATE_START_DATE]) {
        const date = dateConverterToLink(
          rowExtraData[DayBookingsMetadataIdentifierEnum.DATE_START_DATE],
        );
        return `/calendar/${date}`;
      }
      break;

    case ReportCategoryEnum.FIRST_BOOKING:
      if (
        rowExtraData[FirstBookingMetadataIdentifierEnum.FIRST_BOOKING_ID] &&
        rowExtraData[FirstBookingMetadataIdentifierEnum.MEMBER_PK]
      )
        return `/member/${
          rowExtraData[FirstBookingMetadataIdentifierEnum.MEMBER_PK]
        }/bookings/${
          rowExtraData[FirstBookingMetadataIdentifierEnum.FIRST_BOOKING_ID]
        }`;
      break;

    case ReportCategoryEnum.FIRST_ATTENDANCE:
      if (
        rowExtraData[FirstAttendanceMetadataIdentifierEnum.BOOKING_ID] &&
        rowExtraData[FirstAttendanceMetadataIdentifierEnum.MEMBER_PK]
      )
        return `/member/${
          rowExtraData[FirstAttendanceMetadataIdentifierEnum.MEMBER_PK]
        }/bookings/${
          rowExtraData[FirstAttendanceMetadataIdentifierEnum.BOOKING_ID]
        }`;
      break;

    case ReportCategoryEnum.BOOKINGS:
      if (
        rowExtraData[BookingMetadataIdentifierEnum.BOOKING_PK] &&
        rowExtraData[BookingMetadataIdentifierEnum.MEMBER_PK]
      )
        return `/member/${
          rowExtraData[BookingMetadataIdentifierEnum.MEMBER_PK]
        }/bookings/${rowExtraData[BookingMetadataIdentifierEnum.BOOKING_PK]}`;
      break;

    case ReportCategoryEnum.FIRST_PRIVATE_BOOKING:
      if (
        rowExtraData[
          FirstPrivateBookingMetadataIdentifierEnum.PRIVATEBOOKING_PK
        ] &&
        rowExtraData[FirstPrivateBookingMetadataIdentifierEnum.MEMBER_PK]
      )
        return `/member/${
          rowExtraData[FirstPrivateBookingMetadataIdentifierEnum.MEMBER_PK]
        }/private-booking/${
          rowExtraData[
            FirstPrivateBookingMetadataIdentifierEnum.PRIVATEBOOKING_PK
          ]
        }`;
      break;

    case ReportCategoryEnum.PRIVATE_BOOKINGS:
      if (
        rowExtraData[PrivateBookingMetadataIdentifierEnum.PRIVATEBOOKING_PK] &&
        rowExtraData[PrivateBookingMetadataIdentifierEnum.MEMBER_PK]
      )
        return `/member/${
          rowExtraData[PrivateBookingMetadataIdentifierEnum.MEMBER_PK]
        }/private-booking/${
          rowExtraData[PrivateBookingMetadataIdentifierEnum.PRIVATEBOOKING_PK]
        }`;
      break;

    case ReportCategoryEnum.UNPAID_PRIVATE_BOOKINGS:
      if (
        rowExtraData[
          UnpaidPrivateBookingMetadataIdentifierEnum.PRIVATE_BOOKING_PK
        ] &&
        rowExtraData[UnpaidPrivateBookingMetadataIdentifierEnum.MEMBER_PK]
      )
        return `/member/${
          rowExtraData[UnpaidPrivateBookingMetadataIdentifierEnum.MEMBER_PK]
        }/private-booking/${
          rowExtraData[
            UnpaidPrivateBookingMetadataIdentifierEnum.PRIVATE_BOOKING_PK
          ]
        }`;
      break;

    case ReportCategoryEnum.PRIVATE_CONSUMER_PASS:
      if (
        rowExtraData[PrivateConsumerPassMetadataIdentifierEnum.PK] &&
        rowExtraData[PrivateConsumerPassMetadataIdentifierEnum.MEMBER_PK]
      )
        return `/member/${
          rowExtraData[PrivateConsumerPassMetadataIdentifierEnum.MEMBER_PK]
        }/private-consumer-pass/${
          rowExtraData[PrivateConsumerPassMetadataIdentifierEnum.PK]
        }`;
      break;

    case ReportCategoryEnum.PRIVATE_CONSUMER_PASS_EXPIRED:
      if (
        rowExtraData[PrivateConsumerPassMetadataIdentifierEnum.PK] &&
        rowExtraData[PrivateConsumerPassMetadataIdentifierEnum.MEMBER_PK]
      )
        return `/member/${
          rowExtraData[PrivateConsumerPassMetadataIdentifierEnum.MEMBER_PK]
        }/private-consumer-pass/${
          rowExtraData[PrivateConsumerPassMetadataIdentifierEnum.PK]
        }`;
      break;

    case ReportCategoryEnum.REFERRAL_GRANT:
      if (rowExtraData[ReferralGrantMetadataIdentifierEnum.REFERRED_MEMBER_PK])
        return `/member/${
          rowExtraData[ReferralGrantMetadataIdentifierEnum.REFERRED_MEMBER_PK]
        }/info`;
      break;

    case ReportCategoryEnum.EXPIRED_PASS:
      if (
        rowExtraData[ExpiredConsumerPaymentPackMetadataIdentifierEnum.PK] &&
        rowExtraData[ExpiredConsumerPaymentPackMetadataIdentifierEnum.MEMBER_PK]
      )
        return `/member/${
          rowExtraData[
            ExpiredConsumerPaymentPackMetadataIdentifierEnum.MEMBER_PK
          ]
        }/pass/${
          rowExtraData[ExpiredConsumerPaymentPackMetadataIdentifierEnum.PK]
        }`;
      break;

    case ReportCategoryEnum.MEMBERSHIPS:
      if (
        rowExtraData[ConsumerPaymentPackMetadataIdentifierEnum.PK] &&
        rowExtraData[ConsumerPaymentPackMetadataIdentifierEnum.MEMBER_PK]
      )
        return `/member/${
          rowExtraData[ConsumerPaymentPackMetadataIdentifierEnum.MEMBER_PK]
        }/pass/${rowExtraData[ConsumerPaymentPackMetadataIdentifierEnum.PK]}`;
      break;

    case ReportCategoryEnum.UNIVERSAL_PASSES:
      if (
        rowExtraData[UniversalPassMetadataIdentifierEnum.PK] &&
        rowExtraData[UniversalPassMetadataIdentifierEnum.MEMBER_PK]
      )
        return `/member/${
          rowExtraData[UniversalPassMetadataIdentifierEnum.MEMBER_PK]
        }/pass/${rowExtraData[UniversalPassMetadataIdentifierEnum.PK]}`;
      break;

    case ReportCategoryEnum.CONSUMER_GIFTCARD:
      if (
        rowExtraData[ConsumerGiftcardMetadataIdentifierEnum.PK] &&
        rowExtraData[ConsumerGiftcardMetadataIdentifierEnum.MEMBER_PK]
      )
        return `/member/${
          rowExtraData[ConsumerGiftcardMetadataIdentifierEnum.MEMBER_PK]
        }/giftcard/${rowExtraData[ConsumerGiftcardMetadataIdentifierEnum.PK]}`;
      break;

    case ReportCategoryEnum.VIDEO_PURCHASE:
      if (
        rowExtraData[VideoPurchaseMetadataIdentifierEnum.PK] &&
        rowExtraData[VideoPurchaseMetadataIdentifierEnum.MEMBER_PK]
      )
        return `/member/${
          rowExtraData[VideoPurchaseMetadataIdentifierEnum.MEMBER_PK]
        }/vod/${rowExtraData[VideoPurchaseMetadataIdentifierEnum.PK]}`;
      break;

    case ReportCategoryEnum.BASKET:
      if (
        rowExtraData[BasketMetadataIdentifierEnum.BASKET_ID] &&
        rowExtraData[BasketMetadataIdentifierEnum.MEMBER_PK]
      )
        return `/member/${
          rowExtraData[BasketMetadataIdentifierEnum.MEMBER_PK]
        }/basket/${rowExtraData[BasketMetadataIdentifierEnum.BASKET_ID]}`;
      break;

    case ReportCategoryEnum.CREDIT:
      if (rowExtraData[CreditMetadataIdentifierEnum.MEMBER_PK])
        return `/member/${
          rowExtraData[CreditMetadataIdentifierEnum.MEMBER_PK]
        }/info`;
      break;

    case ReportCategoryEnum.EXPENSE:
      if (rowExtraData[ExpenseMetadataIdentifierEnum.EXPENSE_PK])
        return `/expense/${
          rowExtraData[ExpenseMetadataIdentifierEnum.EXPENSE_PK]
        }`;
      break;

    case ReportCategoryEnum.INVOICES:
      if (rowExtraData[InvoiceMetadataIdentifierEnum.PAYMENT_IDENTIFIER])
        return `/invoice/${
          rowExtraData[InvoiceMetadataIdentifierEnum.PAYMENT_IDENTIFIER]
        }`;
      break;

    case ReportCategoryEnum.UNPAID_INVOICES:
      if (rowExtraData[UnpaidInvoiceMetadataIdentifierEnum.PAYMENT_IDENTIFIER])
        return `/invoice/${
          rowExtraData[UnpaidInvoiceMetadataIdentifierEnum.PAYMENT_IDENTIFIER]
        }`;
      break;

    case ReportCategoryEnum.PAYMENTS:
      if (rowExtraData[PaymentMetadataIdentifierEnum.PAYMENT_IDENTIFIER])
        return `/invoice/${
          rowExtraData[PaymentMetadataIdentifierEnum.PAYMENT_IDENTIFIER]
        }`;
      break;

    case ReportCategoryEnum.PAYMENT_SUMUP:
      if (rowExtraData[PaymentSumupMetadataIdentifierEnum.INVOICE_PK])
        return `/invoice/${
          rowExtraData[PaymentSumupMetadataIdentifierEnum.INVOICE_PK]
        }`;
      break;

    case ReportCategoryEnum.ON_SPOT_PAYMENTS:
      if (rowExtraData[OnSpotPaymentMetadataIdentifierEnum.PAYMENT_IDENTIFIER])
        return `/invoice/${
          rowExtraData[OnSpotPaymentMetadataIdentifierEnum.PAYMENT_IDENTIFIER]
        }`;
      break;

    case ReportCategoryEnum.DISPUTE:
      if (rowExtraData[DisputeMetadataIdentifierEnum.PAYMENT_IDENTIFIER])
        return `/invoice/${
          rowExtraData[DisputeMetadataIdentifierEnum.PAYMENT_IDENTIFIER]
        }`;
      break;

    case ReportCategoryEnum.PAYMENT_INSTALMENTS:
      if (
        rowExtraData[
          PaymentByInstalmentsMetadataIdentifierEnum.PAYMENT_IDENTIFIER
        ]
      )
        return `/invoice/${
          rowExtraData[
            PaymentByInstalmentsMetadataIdentifierEnum.PAYMENT_IDENTIFIER
          ]
        }`;
      break;

    case ReportCategoryEnum.GIFTCARD:
      if (rowExtraData[GiftcardMetadataIdentifierEnum.ID])
        return `/giftcard/${rowExtraData[GiftcardMetadataIdentifierEnum.ID]}`;
      break;

    case ReportCategoryEnum.SHOP:
      if (rowExtraData[ShopItemMetadataIdentifierEnum.SHOPITEM_PK])
        return `/shop/${
          rowExtraData[ShopItemMetadataIdentifierEnum.SHOPITEM_PK]
        }`;
      break;

    case ReportCategoryEnum.DISCOUNT:
      if (rowExtraData[DiscountMetadataIdentifierEnum.PAYMENT_IDENTIFIER])
        return `/invoice/${
          rowExtraData[DiscountMetadataIdentifierEnum.PAYMENT_IDENTIFIER]
        }`;
      break;

    case ReportCategoryEnum.VIDEO:
      if (rowExtraData[VideoMetadataIdentifierEnum.VIDEO_PK])
        return `/vod/video/${
          rowExtraData[VideoMetadataIdentifierEnum.VIDEO_PK]
        }`;
      break;

    default:
      return null;
  }

  return null;
};

/**
 *
 * @param filterGroups Every filtersItem that are applied
 * @param columns All the columns of the report that were chosen
 * @param isFranchisor If report comes from franchisor side
 * @returns Unique filterable columns by identifiers and datatype
 */

export const getFilterableColumns = (
  filterGroups: DatatypeFilterConfigGroup[],
  columns: DataSourceFieldMetadata[],
  isFranchisor: boolean,
) =>
  uniqBy(
    (columns || []).filter((d) => {
      if (!d.is_filterable) return false;
      // For franchisors, we only allow the 'company' datatype among DATATYPE_FILTERABLE_BY_ID_IN
      if (
        isFranchisor &&
        DATATYPE_FILTERABLE_BY_ID_IN.includes(d.datatype) &&
        d.datatype !== 'company'
      )
        return false;
      // If the column has already been filtered on, a filter on the same column can't be applied
      if (
        filterGroups &&
        checkIdentifierAlreadyExist(d.identifier, filterGroups)
      )
        return false;
      return true;
    }),
    (column) => [column.datatype, column.identifier],
  );

export const getComparatorLabel = (comparator: AllComparator) => {
  switch (comparator) {
    case FILTER_EQUAL_OPERAND:
    case FILTER_IN_OPERAND:
      return '=';
    case FILTER_NOT_EQUAL_OPERAND:
    case FILTER_OUT_OPERAND:
      return '≠';
    case FILTER_GTE_OPERAND:
      return '≥';
    case FILTER_LTE_OPERAND:
      return '≤';
    default:
      return '';
  }
};

export const getSingleValueLabel = (
  datatype: DataSourceMedadataDataType,
  value: boolean | number[] | number,
  subDataType: 0 | 1 | null,
  getDataByTypeAndId: (
    type: DynamicFilterDataType,
    valueId?: number[],
  ) => handleGetDynamicDataForFiltersReturn,
  t: TFunction,
) => {
  switch (datatype) {
    case ReportFilterableDataType.ACTIVITY:
    case ReportFilterableDataType.BILLING_ESTABLISHMENT:
    case ReportFilterableDataType.BILLING_GROUP:
    case ReportFilterableDataType.COACH:
    case ReportFilterableDataType.COMPANY:
    case ReportFilterableDataType.CONTRACT:
    case ReportFilterableDataType.COUPON:
    case ReportFilterableDataType.ESTABLISHMENT:
    case ReportFilterableDataType.GIFTCARD:
    case ReportFilterableDataType.PAYMENT_PACK:
    case ReportFilterableDataType.PAYMENT_PACK_CATEGORY:
    case ReportFilterableDataType.PRIVATE_PASS:
    case ReportFilterableDataType.PRIVATE_PASS_CATEGORY:
    case ReportFilterableDataType.PRIVATE_SERVICE:
    case ReportFilterableDataType.PRIVATE_SLOT:
    case ReportFilterableDataType.SUBSHOP:
    case ReportFilterableDataType.VIDEO:
    case ReportFilterableDataType.STAFF:
      return `${getDataByTypeAndId(datatype, value) ?? ''}`;
    // Those above are the ones filterable by ID
    case ReportFilterableDataType.DATE:
    case ReportFilterableDataType.TIME:
    case ReportFilterableDataType.DATETIME:
      if (subDataType === HOUR_SUBDATA_TYPE) {
        return moment.unix(value as number).format('LT');
      }
      return moment.unix(value as number).format('L');
    case ReportFilterableDataType.BOOLEAN:
      return value === true ? t('yes') : t('no');
    case ReportFilterableDataType.PAYOUT_STATUS:
      return t(`payment:payout.status.${value}`);
    case ReportFilterableDataType.INVOICE_STATUS:
      return t(`invoice:status.${value}`);
    case ReportFilterableDataType.BILLING_PLAN_STATUS:
      return t(`subscription:billing_plan_status.${value}`);
    case ReportFilterableDataType.DISPUTE_STATUS:
      return t(`payment:disputeStatus.${value}`);
    case ReportFilterableDataType.BOOKING_STATUS_CODE:
      switch (value) {
        case BOOKING_STATUS_OK.id:
          return t('booking:filters.notCancelled');
        case BOOKING_STATUS_CANCELLED_BY_MANAGER.id:
          return t('booking:filters.managerCanceled');
        case BOOKING_STATUS_CANCELLED_BY_CONSUMER.id:
          return t('booking:filters.consumerCanceled');
        case BOOKING_STATUS_CANCELLED_BY_OFFER.id:
          return t('booking:filters.canceled');
        default:
          return value;
      }
    case ReportFilterableDataType.SOURCE_DEVICE:
      return t(`reporting:presetValuesByDatatype.source_device.${value}`);
    case ReportFilterableDataType.PAYMENT_ENGINE:
      return t(`invoice:paymentEngine.label.${value}`);
    case ReportFilterableDataType.PAYMENT_METHOD:
      return t(`payment:method.${value}`);
    case ReportFilterableDataType.PAYMENT_METHOD_WITH_CREDIT_ACCOUNT:
      return t(`payment:method.${value}`);
    case ReportFilterableDataType.DOW:
      return t(`datetime:time.isoWeekdayNumber.${value}`);
    default:
      return value;
  }
};

export const getMultipleValuesLabel = (
  datatype: DataSourceMedadataDataType,
  subDataType: 0 | 1 | null,
  value: number[],
) => {
  switch (datatype) {
    case ReportFilterableDataType.NUMBER:
    case ReportFilterableDataType.PRICE:
      return `: ${value[0]} → ${value[1]}`;
    case ReportFilterableDataType.DATE:
    case ReportFilterableDataType.TIME:
    case ReportFilterableDataType.DATETIME:
      if (subDataType === HOUR_SUBDATA_TYPE) {
        return `: ${moment.unix(value[0]).format('LT')} → ${moment
          .unix(value[1])
          .format('LT')}`;
      }
      return `: ${moment.unix(value[0]).format('L')} → ${moment
        .unix(value[1])
        .format('L')}`;

    default:
      return `(${value?.length})`;
  }
};

export const isColumnChipsable = (datatype: string, reportCategory: string) => {
  const isStatusChip = STATUS_CHIPS.includes(datatype);
  const isBooleanGreenGreyChip = GREEN_GREY_BOOLEAN_CHIPS.includes(datatype);
  const isBooleanRedGreenChip = RED_GREEN_BOOLEAN_CHIPS.includes(datatype);
  const isBooleanRedGreenInvertedChip =
    RED_GREEN_INVERTED_BOOLEAN_CHIPS.includes(datatype);
  const isConditionChip =
    CONDITION_CHIPS.includes(datatype) ||
    (datatype === 'credits' && reportCategory === 'credit');
  const isTagChip = datatype.substring(0, 4) === 'tag:';

  const isChipsable =
    isStatusChip ||
    isBooleanGreenGreyChip ||
    isBooleanRedGreenChip ||
    isBooleanRedGreenInvertedChip ||
    isConditionChip ||
    isTagChip;

  return {
    isStatusChip,
    isBooleanGreenGreyChip,
    isBooleanRedGreenChip,
    isBooleanRedGreenInvertedChip,
    isConditionChip,
    isTagChip,
    isChipsable,
  };
};
