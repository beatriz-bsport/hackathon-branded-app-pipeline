import React from 'react';
import get from 'lodash/get';

import { DateTime, Info } from 'luxon';
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
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories.js';
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
  AccessMonitoringMetadataIdentifierEnum,
} from '@bsport/common/lib/master-data/metadata-identifiers.js';
import uniqBy from 'lodash/uniqBy';
import {
  BOOKING_STATUS_CANCELLED_BY_CONSUMER,
  BOOKING_STATUS_CANCELLED_BY_MANAGER,
  BOOKING_STATUS_CANCELLED_BY_OFFER,
  BOOKING_STATUS_OK,
} from '@bsport/common/lib/master-data/booking_status_code.js';
import type { SvgIconProps } from '@material-ui/core/SvgIcon';

import {
  getCurrencyDisplay,
  getCurrencyDisplayWithPrice,
} from '#src/libs/theme/selectors';

import type { ObjectLevelPermissions } from '#src/libs/role/types';
import type {
  DataSourceFieldMetadata,
  DatatypeFilterConfigGroup,
  AllComparator,
  DataSourceMedadataDataType,
  DatatypeFilterConfigItemValueProducts,
  DatatypeFilterConfigItemValueDynamic,
  DatatypeFilterConfigItem,
} from '#src/libs/datatype-filtering/types';
import {
  DATATYPE_FILTERABLE_BY_ID_IN,
  DATATYPE_PRESET_INTEGER_VALUE,
  FILTER_EQUAL_OPERAND,
  FILTER_GTE_OPERAND,
  FILTER_IN_OPERAND,
  FILTER_LTE_OPERAND,
  FILTER_NOT_EQUAL_OPERAND,
  FILTER_OUT_OPERAND,
  HOUR_SUBDATA_TYPE,
  ReportFilterableDataType,
} from '#src/libs/datatype-filtering/constants';
import type { handleGetDynamicDataForFiltersType } from '#src/libs/datatype-filtering/dynamic-data-hoc';
import {
  checkIdentifierAlreadyExist,
  checkMemberFilterAlreadyExist,
} from '#src/libs/datatype-filtering/utils';
import {
  GREEN_GREY_BOOLEAN_CHIPS,
  RED_GREEN_BOOLEAN_CHIPS,
  RED_GREEN_INVERTED_BOOLEAN_CHIPS,
  STATUS_CHIPS,
  CONDITION_CHIPS,
  MEMBER_FILTERING_COLUMN_IDENTIFIERS,
  REFERRAL_GRANT_REFERRED_MEMBER_FILTERING_IDENTIFIERS,
  REFERRAL_GRANT_REFERRING_MEMBER_FILTERING_IDENTIFIERS,
  DESTINATION_MEMBER_FILTERING_IDENTIFIERS,
  SOURCE_MEMBER_FILTERING_IDENTIFIERS,
  ACCESS_MONITORING_MEMBER_FILTERING_IDENTIFIERS,
  GROUPED_IDENTIFIERS_FILTER,
  FILTERABLE_PRODUCT_TYPE_OPTIONS,
  FILTERABLE_PRODUCT_CATEGORY_OPTIONS,
  FILTERABLE_BILLING_PLAN_PRODUCT_TYPE_OPTIONS,
} from '#src/libs/reporting/common/constants';
import type {
  ReportCategory,
  ReportMetadata,
  ReportConfiguration,
  ReportObjectPermissions,
  ReportMetadataValueWithLabel,
} from './types';
import { BuyableItemOptions } from '#src/libs/checkout/types';
import { ConsumerGiftcardKind } from '@bsport/common/lib/master-data/giftcard.js';

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
    // @ts-expect-error
    name: 'Crédit',
    icon: getCurrencyDisplay() === '€' ? EuroIcon : AttachMoneyIcon,
  },
  {
    id: 'payment_sumup',
    // @ts-expect-error
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
    // @ts-expect-error
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
): React.ComponentType<SvgIconProps> {
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

export const getConverter = (
  column: {
    column_identifier?: string;
    identifier?: string;
    datatype: string;
  },
  classes: ClassNameMap<string>,
  t: TFunction,
) => {
  if (!column || !column.datatype) {
    return (value: any) => ({ value });
  }
  const { datatype } = column;

  return (value: string | number | undefined) => {
    if (datatype === 'price') {
      return {
        cellProps: { className: classes.right },
        value:
          value !== null && value !== undefined
            ? `${getCurrencyDisplayWithPrice(Number(value).toFixed(2))}`
            : '',
      };
    }

    if (datatype === 'number') {
      return {
        value: Number(value).toFixed(2),
      };
    }

    if (datatype === 'cts') {
      return {
        cellProps: { className: classes.right },
        value:
          value !== null && value !== undefined
            ? `${getCurrencyDisplayWithPrice((Number(value) / 100).toFixed(2))}`
            : '',
      };
    }

    if (datatype === 'int') {
      const valueInt = Math.floor(Number(value));
      return {
        cellProps: { className: classes.right },
        value: valueInt,
      };
    }

    if (datatype === 'percent') {
      return {
        cellProps: { className: classes.right },
        value: `${Number(value).toFixed(2)}%`,
      };
    }

    if (datatype === 'dow') {
      return {
        value: Info.weekdays('long')[Math.floor(Number(value)) % 7] || '',
      };
    }

    if (datatype === 'boolean') {
      return { value: t(value ? 'yes' : 'no') as string };
    }

    if (datatype === 'time') {
      return {
        value,
      };
    }

    if (datatype === 'date') {
      const date = DateTime.fromISO(String(value));
      return {
        value: date.isValid ? date.toFormat('D') : '',
      };
    }

    if (datatype === 'datetime') {
      const date = DateTime.fromFormat(String(value), "yyyy-MM-dd',' HH:mm:ss");
      return {
        value: date.isValid ? date.toFormat("D HH'h'mm") : '',
      };
    }

    if (datatype === 'product_type' && column?.identifier === 'product_type') {
      return { value: t(`product_type.${value}`) as string };
    }

    if (datatype === 'payment_method') {
      return {
        value:
          value && typeof value === 'string'
            ? value
                .split(',')
                .map((v) => t(`payment_method.${v}`))
                .join(', ')
            : (t('payment_method.none') as string),
      };
    }

    if (datatype === 'payment_method_with_credit_account') {
      return {
        value: t(`payment_method_with_credit_account.${value}`) as string,
      };
    }

    if (datatype === 'dispute_status') {
      return { value: t(`payment:disputeStatus.${value}`) as string };
    }

    if (datatype === 'payout_status') {
      return {
        value:
          typeof value === 'number'
            ? (t(`payment:payout.status.${value}`) as string)
            : value,
      };
    }

    if (datatype === ReportFilterableDataType.CONSUMER_GIFTCARD_KIND) {
      if (value === ConsumerGiftcardKind.PRINTABLE) {
        return {
          value: t('giftcard:consumerGiftcard.form.type.option.physical'),
        };
      }
      if (value === ConsumerGiftcardKind.DIGITAL) {
        return {
          value: t('giftcard:consumerGiftcard.form.type.option.digital'),
        };
      }
    }

    return { value };
  };
};

const dateConverterToLink = (date: string): string => {
  return DateTime.fromFormat(date, 'yyyy-MM-dd').toFormat('yyyy/MM/dd');
};

type GenerateRowLinkProps = {
  reportCategory: ReportCategoryEnum;
  rowExtraData: { [key: string]: string | number | null };
  // For the new webshop page, the link is /shop/products/{shopItemPk} instead of /shop/{shopItemPk}
  // So we are forced to get this information from the companyTheme, to be deleted asap
  displayNewWebshop?: boolean;
};

export const generateRowLink = ({
  reportCategory,
  rowExtraData,
  displayNewWebshop,
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
        return `/offer/${rowExtraData[OfferMetadataIdentifierEnum.OFFER_ID]}`;
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
          // @ts-expect-error
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
      if (rowExtraData[ShopItemMetadataIdentifierEnum.SHOPITEM_PK]) {
        if (displayNewWebshop)
          return `/shop/products/${
            rowExtraData[ShopItemMetadataIdentifierEnum.SHOPITEM_PK]
          }`;
        return `/shop/${
          rowExtraData[ShopItemMetadataIdentifierEnum.SHOPITEM_PK]
        }`;
      }
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
 * @returns Unique filterable columns by identifiers
 */

export const getFilterableColumns = (
  filterGroups: DatatypeFilterConfigGroup[],
  columns: DataSourceFieldMetadata[],
  isFranchisor: boolean,
  t: TFunction,
) =>
  uniqBy(
    (columns ?? []).filter((d) => {
      if (!d.is_filterable) return false;
      // For franchisors, we only allow the 'company' datatype among DATATYPE_FILTERABLE_BY_ID_IN and the ones in
      // DATATYPE_PRESET_INTEGER_VALUE

      if (
        isFranchisor &&
        DATATYPE_FILTERABLE_BY_ID_IN.includes(d.datatype) &&
        d.datatype !== 'company' &&
        !DATATYPE_PRESET_INTEGER_VALUE.includes(d.datatype)
      )
        return false;
      // If the column has already been filtered on, a filter on the same column can't be applied
      if (
        filterGroups &&
        checkIdentifierAlreadyExist(d.identifier, filterGroups)
      )
        return false;
      if (
        filterGroups &&
        checkMemberFilterAlreadyExist(d.datatype, d.identifier, filterGroups)
      ) {
        return false;
      }
      return true;
    }),
    (column) =>
      t(`${getColumnLabelTranslation(column.datatype, column.identifier)}`),
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

export const isDatatypeFilterConfigItemValueProducts = (
  value:
    | number
    | boolean
    | number[]
    | DatatypeFilterConfigItemValueProducts
    | DatatypeFilterConfigItemValueDynamic,
): value is DatatypeFilterConfigItemValueProducts =>
  typeof value === 'object' &&
  value !== null &&
  'object_ids' in value &&
  'buyable_item_identifier' in value;

export const isDatatypeFilterConfigItemValueDynamic = (
  value:
    | number
    | boolean
    | number[]
    | DatatypeFilterConfigItemValueProducts
    | DatatypeFilterConfigItemValueDynamic,
): value is DatatypeFilterConfigItemValueDynamic =>
  typeof value === 'object' &&
  value !== null &&
  'object_ids' in value &&
  'dynamic_foreign_key' in value;

export const getSingleValueLabel = (
  datatype: DataSourceMedadataDataType,
  value:
    | boolean
    | number[]
    | number
    | DatatypeFilterConfigItemValueProducts
    | DatatypeFilterConfigItemValueDynamic,
  subDataType: 0 | 1 | null,
  getDataByTypeAndId: handleGetDynamicDataForFiltersType,
  t: TFunction,
) => {
  switch (datatype) {
    case ReportFilterableDataType.ACTIVITY:
    case ReportFilterableDataType.BILLING_ESTABLISHMENT:
    case ReportFilterableDataType.BILLING_GROUP:
    case ReportFilterableDataType.BILLING_GROUP_ADDRESS:
    case ReportFilterableDataType.COACH:
    case ReportFilterableDataType.COMPANY:
    case ReportFilterableDataType.CONTRACT:
    case ReportFilterableDataType.COUPON:
    case ReportFilterableDataType.ESTABLISHMENT:
    case ReportFilterableDataType.ESTABLISHMENT_GROUP:
    case ReportFilterableDataType.GIFTCARD:
    case ReportFilterableDataType.PAYMENT_PACK:
    case ReportFilterableDataType.PAYMENT_PACK_CATEGORY:
    case ReportFilterableDataType.PRIVATE_PASS:
    case ReportFilterableDataType.PRIVATE_PASS_CATEGORY:
    case ReportFilterableDataType.PRIVATE_SERVICE:
    case ReportFilterableDataType.PRIVATE_SLOT:
    case ReportFilterableDataType.SUBSHOP:
    case ReportFilterableDataType.SUPPLIER:
    case ReportFilterableDataType.VIDEO:
    case ReportFilterableDataType.STAFF:
    case ReportFilterableDataType.USER:
      // @ts-expect-error
      return `${getDataByTypeAndId(datatype, value) ?? ''}`;
    case ReportFilterableDataType.PRODUCTS:
      if (isDatatypeFilterConfigItemValueProducts(value)) {
        const datatypeFiltering = FILTERABLE_PRODUCT_TYPE_OPTIONS.find(
          (option) => option.value === value.buyable_item_identifier,
        )?.datatypeFiltering;
        return `${
          getDataByTypeAndId(datatypeFiltering, value.object_ids) ?? ''
        }`;
      }
      return '';
    case ReportFilterableDataType.PRODUCT_CATEGORY:
      if (isDatatypeFilterConfigItemValueProducts(value)) {
        const datatypeFiltering = FILTERABLE_PRODUCT_CATEGORY_OPTIONS.find(
          (option) => option.value === value.buyable_item_identifier,
        )?.datatypeFiltering;
        return `${
          getDataByTypeAndId(datatypeFiltering, value.object_ids) ?? ''
        }`;
      }
      return '';
    case ReportFilterableDataType.BILLING_PLAN_PRODUCT:
      if (isDatatypeFilterConfigItemValueDynamic(value)) {
        const datatypeFiltering =
          FILTERABLE_BILLING_PLAN_PRODUCT_TYPE_OPTIONS.find(
            (option) => option.value === value.dynamic_foreign_key,
          )?.datatypeFiltering;
        return `${
          getDataByTypeAndId(datatypeFiltering, value.object_ids) ?? ''
        }`;
      }
      return '';
    // Those above are the ones filterable by ID
    case ReportFilterableDataType.DATE:
    case ReportFilterableDataType.TIME:
    case ReportFilterableDataType.DATETIME:
      if (subDataType === HOUR_SUBDATA_TYPE) {
        return typeof value === 'number'
          ? DateTime.fromSeconds(value as number).toFormat('t')
          : DateTime.now().toFormat('t');
      }
      return typeof value === 'number'
        ? DateTime.fromSeconds(value as number).toFormat('D')
        : DateTime.now().toFormat('D');
    case ReportFilterableDataType.BOOLEAN:
      return value === true ? t('yes') : t('no');
    case ReportFilterableDataType.PAYOUT_STATUS:
      return t(`payment:payout.status.${value}`);
    case ReportFilterableDataType.INVOICE_STATUS:
      return t(`invoice:status.${value}`);
    case ReportFilterableDataType.BILLING_PLAN_STATUS:
      return t(`reporting:presetValuesByDatatype.billing_plan_status.${value}`);
    case ReportFilterableDataType.DISPUTE_STATUS:
      return t(`payment:disputeStatus.${value}`);
    case ReportFilterableDataType.BOOKING_STATUS_CODE:
      if (Array.isArray(value)) {
        switch (value[0]) {
          case BOOKING_STATUS_OK.id:
            return t('booking:filters.notCancelled');
          case BOOKING_STATUS_CANCELLED_BY_MANAGER.id:
            return t('booking:filters.managerCanceled');
          case BOOKING_STATUS_CANCELLED_BY_CONSUMER.id:
            return t('booking:filters.consumerCanceled');
          case BOOKING_STATUS_CANCELLED_BY_OFFER.id:
            return t('booking:filters.canceled');
          default:
            return value[0];
        }
      }
      return value;
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
    case ReportFilterableDataType.ACCESS_MONITORING_STATUS:
      return t(`accessControl:filters.accessStatus.${value}`);
    case ReportFilterableDataType.ACCESS_MONITORING_ADMISSION:
      return t(`accessControl:filters.entryStatus.${value}`);
    case ReportFilterableDataType.CONSUMER_GIFTCARD_KIND:
      if (Array.isArray(value) && value.length > 0) {
        switch (value[0]) {
          case ConsumerGiftcardKind.PRINTABLE:
            return t('giftcard:consumerGiftcard.form.type.option.physical');
          case ConsumerGiftcardKind.DIGITAL:
            return t('giftcard:consumerGiftcard.form.type.option.digital');
          default:
            return value[0];
        }
      }
    case ReportFilterableDataType.PRODUCT_TYPE:
      if (Array.isArray(value)) {
        return t(
          `${
            FILTERABLE_PRODUCT_TYPE_OPTIONS.find(
              (option) => option.value === value?.[0],
            )?.translationKey || ''
          }`,
        );
      }
      return value;

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
        return `: ${DateTime.fromSeconds(value[0]).toFormat(
          't',
        )} → ${DateTime.fromSeconds(value[1]).toFormat('t')}`;
      }
      return `: ${DateTime.fromSeconds(value[0]).toFormat(
        'D',
      )} → ${DateTime.fromSeconds(value[1]).toFormat('D')}`;

    default:
      return `(${value?.length})`;
  }
};

/**
 * Returns a boolean to know if the current column cells can be rendered with Chip components
 * @param columnName The optional column name found in the renderer data
 * @param reportCategory The associated report category name
 * @returns {boolean}
 */
export const isColumnChipsable = (
  columnName: string = '',
  reportCategory: string,
) => {
  const isStatusChip = STATUS_CHIPS.includes(columnName);
  const isBooleanGreenGreyChip = GREEN_GREY_BOOLEAN_CHIPS.includes(columnName);
  const isBooleanRedGreenChip = RED_GREEN_BOOLEAN_CHIPS.includes(columnName);
  const isBooleanRedGreenInvertedChip =
    RED_GREEN_INVERTED_BOOLEAN_CHIPS.includes(columnName);
  const isConditionChip =
    CONDITION_CHIPS.includes(columnName) ||
    (columnName === 'credits' && reportCategory === 'credit');
  const isTagChip = columnName.substring(0, 4) === 'tag:';

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

export const ReportColumnPermissions = {
  [ReportCategoryEnum.BILLING_PLAN]: {
    [BillingPlanMetadataIdentifierEnum.EMAIL]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.MEMBERS_PURCHASE]: {
    [MembersPurchaseMetadataIdentifierEnum.EMAIL]: [
      'member.allowed_actions.readInfo',
    ],
    [MembersPurchaseMetadataIdentifierEnum.PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.MEMBERS]: {
    [MemberMetadataIdentifierEnum.EMAIL]: ['member.allowed_actions.readInfo'],
    [MemberMetadataIdentifierEnum.PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
    [MemberMetadataIdentifierEnum.BIRTHDAY]: [
      'member.allowed_actions.readInfo',
    ],
    [MemberMetadataIdentifierEnum.FULL_ADDRESS]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.OFFERS]: {
    [OfferMetadataIdentifierEnum.EMAIL]: ['member.allowed_actions.readInfo'],
  },
  [ReportCategoryEnum.SUBSCRIPTION]: {
    [SubscriptionMetadataIdentifierEnum.EMAIL]: [
      'member.allowed_actions.readInfo',
    ],
    [SubscriptionMetadataIdentifierEnum.PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.FIRST_BOOKING]: {
    [FirstBookingMetadataIdentifierEnum.EMAIL]: [
      'member.allowed_actions.readInfo',
    ],
    [FirstBookingMetadataIdentifierEnum.PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.FIRST_ATTENDANCE]: {
    [FirstAttendanceMetadataIdentifierEnum.EMAIL]: [
      'member.allowed_actions.readInfo',
    ],
    [FirstAttendanceMetadataIdentifierEnum.PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.FIRST_PRIVATE_BOOKING]: {
    [FirstPrivateBookingMetadataIdentifierEnum.EMAIL]: [
      'member.allowed_actions.readInfo',
    ],
    [FirstPrivateBookingMetadataIdentifierEnum.PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.UNPAID_PRIVATE_BOOKINGS]: {
    [UnpaidInvoiceMetadataIdentifierEnum.EMAIL]: [
      'member.allowed_actions.readInfo',
    ],
    [UnpaidInvoiceMetadataIdentifierEnum.PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.BOOKINGS]: {
    [BookingMetadataIdentifierEnum.EMAIL]: ['member.allowed_actions.readInfo'],
    [BookingMetadataIdentifierEnum.PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.EXPIRED_PASS]: {
    [ExpiredConsumerPaymentPackMetadataIdentifierEnum.EMAIL]: [
      'member.allowed_actions.readInfo',
    ],
    [ExpiredConsumerPaymentPackMetadataIdentifierEnum.PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.PRIVATE_CONSUMER_PASS_EXPIRED]: {
    [PrivateConsumerPassMetadataIdentifierEnum.EMAIL]: [
      'member.allowed_actions.readInfo',
    ],
    [PrivateConsumerPassMetadataIdentifierEnum.PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.UNIVERSAL_PASSES]: {
    [UniversalPassMetadataIdentifierEnum.EMAIL]: [
      'member.allowed_actions.readInfo',
    ],
    [UniversalPassMetadataIdentifierEnum.PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.PRIVATE_SERVICE]: {
    // @ts-expect-error
    [PrivateServiceMetadataIdentifierEnum.EMAIL]: [
      'member.allowed_actions.readInfo',
    ],

    // @ts-expect-error
    [PrivateServiceMetadataIdentifierEnum.PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.MEMBERSHIPS]: {
    [ConsumerPaymentPackMetadataIdentifierEnum.EMAIL]: [
      'member.allowed_actions.readInfo',
    ],
    [ConsumerPaymentPackMetadataIdentifierEnum.PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.BASKET]: {
    [BasketMetadataIdentifierEnum.EMAIL]: ['member.allowed_actions.readInfo'],
    [BasketMetadataIdentifierEnum.PHONE_NUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.CREDIT]: {
    [CreditMetadataIdentifierEnum.EMAIL]: ['member.allowed_actions.readInfo'],
    [CreditMetadataIdentifierEnum.PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.DISCOUNT]: {
    [DiscountMetadataIdentifierEnum.EMAIL]: ['member.allowed_actions.readInfo'],
  },
  [ReportCategoryEnum.CONSUMER_GIFTCARD]: {
    [ConsumerGiftcardMetadataIdentifierEnum.SRC_FIRSTNAME]: [
      'member.allowed_actions.readInfo',
    ],
    [ConsumerGiftcardMetadataIdentifierEnum.SRC_LASTNAME]: [
      'member.allowed_actions.readInfo',
    ],
    [ConsumerGiftcardMetadataIdentifierEnum.SRC_EMAIL]: [
      'member.allowed_actions.readInfo',
    ],
    [ConsumerGiftcardMetadataIdentifierEnum.SRC_PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.INVOICES]: {
    [InvoiceMetadataIdentifierEnum.EMAIL]: ['member.allowed_actions.readInfo'],
    [InvoiceMetadataIdentifierEnum.PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.UNPAID_INVOICES]: {
    [UnpaidInvoiceMetadataIdentifierEnum.EMAIL]: [
      'member.allowed_actions.readInfo',
    ],
    [UnpaidInvoiceMetadataIdentifierEnum.PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.PAYMENTS]: {
    [PaymentMetadataIdentifierEnum.EMAIL]: ['member.allowed_actions.readInfo'],
  },
  [ReportCategoryEnum.ON_SPOT_PAYMENTS]: {
    [OnSpotPaymentMetadataIdentifierEnum.EMAIL]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.DISPUTE]: {
    [DisputeMetadataIdentifierEnum.EMAIL]: ['member.allowed_actions.readInfo'],
  },
  [ReportCategoryEnum.PAYMENT_INSTALMENTS]: {
    [PaymentByInstalmentsMetadataIdentifierEnum.EMAIL]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.VIDEO_PURCHASE]: {
    [VideoPurchaseMetadataIdentifierEnum.EMAIL]: [
      'member.allowed_actions.readInfo',
    ],
    [VideoPurchaseMetadataIdentifierEnum.PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.PRIVATE_CONSUMER_PASS]: {
    [PrivateConsumerPassMetadataIdentifierEnum.EMAIL]: [
      'member.allowed_actions.readInfo',
    ],
    [PrivateConsumerPassMetadataIdentifierEnum.PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.PRIVATE_BOOKINGS]: {
    [PrivateBookingMetadataIdentifierEnum.EMAIL]: [
      'member.allowed_actions.readInfo',
    ],
    [PrivateBookingMetadataIdentifierEnum.PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
  [ReportCategoryEnum.ACCESS_MONITORING]: {
    [AccessMonitoringMetadataIdentifierEnum.MEMBER_EMAIL]: [
      'member.allowed_actions.readInfo',
    ],
    [AccessMonitoringMetadataIdentifierEnum.MEMBER_PHONENUMBER]: [
      'member.allowed_actions.readInfo',
    ],
  },
};
// The field 'global_category' coming from the backend on Report instances isn't reliable
// hence this mapping between categories and global categories
const MAP_REPORT_CATEGORIES_TO_GLOBAL_CATEGORIES = {
  [ReportCategoryEnum.BASKET]: 'Payments',
  [ReportCategoryEnum.CASHBOOK]: 'Payments',
  [ReportCategoryEnum.CREDIT]: 'Payments',
  [ReportCategoryEnum.EXPENSE]: 'Payments',
  [ReportCategoryEnum.INVOICES]: 'Payments',
  [ReportCategoryEnum.UNPAID_INVOICES]: 'Payments',
  [ReportCategoryEnum.PAYMENTS]: 'Payments',
  [ReportCategoryEnum.PAYMENT_SUMUP]: 'Payments',
  [ReportCategoryEnum.ON_SPOT_PAYMENTS]: 'Payments',
  [ReportCategoryEnum.DISPUTE]: 'Payments',
  [ReportCategoryEnum.PAYMENT_INSTALMENTS]: 'Payments',
  [ReportCategoryEnum.VIDEO_PURCHASE]: 'Payments',
  // ----------------
  [ReportCategoryEnum.BILLING_PLAN]: 'Club',
  [ReportCategoryEnum.MEMBERS_PURCHASE]: 'Club',
  [ReportCategoryEnum.MEMBERS]: 'Club',
  [ReportCategoryEnum.ACTIVITIES]: 'Club',
  [ReportCategoryEnum.ACTIVITY_BY_ESTABLISHMENT]: 'Club',
  [ReportCategoryEnum.ACTIVITY_BY_COACH]: 'Club',
  [ReportCategoryEnum.WORKSHOP]: 'Club',
  [ReportCategoryEnum.OFFERS]: 'Club',
  [ReportCategoryEnum.SUBSCRIPTION]: 'Club',
  [ReportCategoryEnum.PRIVATE_SERVICE]: 'Club',
  [ReportCategoryEnum.REFERRAL_GRANT]: 'Club',
  [ReportCategoryEnum.ACCESS_MONITORING]: 'Club',
  // ----------------
  [ReportCategoryEnum.DAY_BOOKINGS]: 'Bookings',
  [ReportCategoryEnum.FIRST_BOOKING]: 'Bookings',
  [ReportCategoryEnum.BOOKINGS]: 'Bookings',
  [ReportCategoryEnum.FIRST_ATTENDANCE]: 'Bookings',
  [ReportCategoryEnum.FIRST_PRIVATE_BOOKING]: 'Bookings',
  [ReportCategoryEnum.PRIVATE_BOOKINGS]: 'Bookings',
  [ReportCategoryEnum.UNPAID_PRIVATE_BOOKINGS]: 'Bookings',
  // ----------------
  [ReportCategoryEnum.PRIVATE_CONSUMER_PASS_EXPIRED]: 'Products',
  [ReportCategoryEnum.EXPIRED_PASS]: 'Products',
  [ReportCategoryEnum.MEMBERSHIPS]: 'Products',
  [ReportCategoryEnum.PRIVATE_CONSUMER_PASS]: 'Products',
  [ReportCategoryEnum.UNIVERSAL_PASSES]: 'Products',
  [ReportCategoryEnum.DISCOUNT]: 'Products',
  [ReportCategoryEnum.GIFTCARD]: 'Products',
  [ReportCategoryEnum.CONSUMER_GIFTCARD]: 'Products',
  [ReportCategoryEnum.SHOP]: 'Products',
  [ReportCategoryEnum.VIDEO]: 'Products',
};

export const getReportGlobalCategoryFromCategory = (
  category: ReportCategoryEnum,

  // @ts-expect-error
): string => MAP_REPORT_CATEGORIES_TO_GLOBAL_CATEGORIES[category];

export const getReportObjectPermissions = (
  objectLevelPermissions: ObjectLevelPermissions,
  report: ReportConfiguration,
): ReportObjectPermissions => {
  const globalCategory = getReportGlobalCategoryFromCategory(report.category);

  return get(
    objectLevelPermissions,
    ['report', globalCategory, report.category, 'allowed_actions'],
    { read: true, edit: true, delete: true, create: true },
  );
};

export const getReportObjectPermissionsBasedOnCategory = (
  objectLevelPermissions: ObjectLevelPermissions,
  category: ReportCategoryEnum,
): ReportObjectPermissions => {
  const globalCategory = getReportGlobalCategoryFromCategory(category);

  return get(
    objectLevelPermissions,
    ['report', globalCategory, category, 'allowed_actions'],
    { read: true, edit: true, delete: true, create: true },
  );
};

/** This function is helpful when using Fuse. The result of fuse.search has the type
 *```
 *X[] | Fuse.FuseResultWithMatches<X>[] | Fuse.FuseResultWithScore<X>[] |
 *(Fuse.FuseResultWithMatches<...> & Fuse.FuseResultWithScore<...>)[]
 *```
 *according to TS (where X is the type of the items you give to the search),
 *but it's actually never X[] directly, so this is used to make TS understand that.
 */
export function isNotReportMetadataValueWithLabel<T extends Object[]>(
  fuseSearchResults: T,
): fuseSearchResults is Exclude<T, ReportMetadataValueWithLabel[]> {
  return fuseSearchResults.length > 0 && 'item' in fuseSearchResults[0];
}

/**
 * Get column label depending on identifier.
 * MEMBER_FILTERING_COLUMN_IDENTIFIERS are identifiers pointing to 1 filtering
 * instead of 1 identifier = 1 filter
 */
export const getColumnLabelTranslation = (
  datatype: DataSourceMedadataDataType,
  identifier: string,
) => {
  if (datatype === 'user') {
    if (
      MEMBER_FILTERING_COLUMN_IDENTIFIERS.includes(identifier) ||
      ACCESS_MONITORING_MEMBER_FILTERING_IDENTIFIERS.includes(identifier)
    ) {
      return 'groupedColumns.member';
    }
    if (
      // @ts-expect-error string not assignable to enum
      REFERRAL_GRANT_REFERRED_MEMBER_FILTERING_IDENTIFIERS.includes(identifier)
    ) {
      return 'groupedColumns.referred_member';
    }
    if (
      // @ts-expect-error string not assignable to enum
      REFERRAL_GRANT_REFERRING_MEMBER_FILTERING_IDENTIFIERS.includes(identifier)
    ) {
      return 'groupedColumns.referring_member';
    }
    if (DESTINATION_MEMBER_FILTERING_IDENTIFIERS.includes(identifier)) {
      return 'groupedColumns.dst_member';
    }
    if (SOURCE_MEMBER_FILTERING_IDENTIFIERS.includes(identifier)) {
      return 'groupedColumns.src_member';
    }
  }
  return `columns.${identifier}`;
};

/**
 * @description Method used to check if a filter is still appliable because
 * its corresponding column is displayed
 *
 * @param datatype Column's datatype
 * @param reportColumnIdentifiers List of identifiers displayed by report
 * @param columnIdentifier Column's identifier
 * @returns Boolean which indicates if column has been removed from report
 */
export const isReportColumnRemoved = (
  datatype: DataSourceMedadataDataType,
  reportColumnIdentifiers: string[],
  columnIdentifier: string,
) => {
  if (datatype !== 'user') {
    return !reportColumnIdentifiers?.includes(columnIdentifier);
  }

  for (const group of GROUPED_IDENTIFIERS_FILTER) {
    if (group.includes(columnIdentifier)) {
      return !group.some((identifier) =>
        reportColumnIdentifiers?.includes(identifier),
      );
    }
  }

  return !reportColumnIdentifiers?.includes(columnIdentifier);
};

export const retrieveFilterableProductOptions = (
  reportCategory: ReportCategoryEnum,
  datatype: string,
) =>
  FILTERABLE_PRODUCT_TYPE_OPTIONS.filter((option) => {
    if (
      reportCategory === ReportCategoryEnum.INVOICES ||
      datatype === 'product_category'
    ) {
      return option.value !== BuyableItemOptions.BUYABLE_ITEM_GIFTCARD;
    }

    return option;
  });

/**
 * @description This method checks that a filterItem of datatype "products" and "product_category"
 * are compatible with each other if existing
 *
 * Only the case where both comparator is "IN" are taken into account
 * @param productFilterItem filterItem with datatype === "products"
 * @param productCategoryFilterItem filterItem with datatype === "product_category"
 * @returns True if they are incompatible
 */
const __areComplexProductFiltersIncompatible = (
  productFilterItem: DatatypeFilterConfigItem,
  productCategoryFilterItem: DatatypeFilterConfigItem,
) => {
  if (!productFilterItem || !productCategoryFilterItem) {
    return false;
  }

  if (
    isDatatypeFilterConfigItemValueProducts(productFilterItem.value) &&
    productFilterItem.value.object_ids.length &&
    !!productFilterItem.value.buyable_item_identifier &&
    isDatatypeFilterConfigItemValueProducts(productCategoryFilterItem.value) &&
    !!productCategoryFilterItem.value.object_ids.length &&
    !!productCategoryFilterItem.value.buyable_item_identifier
  ) {
    // If both have "in" comparators, if their buyable_item_identifier are equal, they are incompatible
    if (
      productCategoryFilterItem.comparator === FILTER_IN_OPERAND &&
      productFilterItem.comparator === FILTER_IN_OPERAND
    )
      if (
        productCategoryFilterItem.value.buyable_item_identifier !==
        productFilterItem.value.buyable_item_identifier
      )
        return true;
  }
  return false;
};

/**
 * @description This method checks that a filterItem of datatype ("products" or "product_category") and "product_type"
 * are compatible with each other if existing
 *
 * Only 2 cases are handled here.
 * @param productFilterItem filterItem with datatype === "products"
 * @param productCategoryFilterItem filterItem with datatype === "product_category"
 * @returns True if they are incompatible
 */
const __isProductFilterIncompatibleWithProductTypeFilter = (
  productFilterItem: DatatypeFilterConfigItem,
  productTypeFilterItem: DatatypeFilterConfigItem,
) => {
  if (!productFilterItem || !productTypeFilterItem) {
    return false;
  }

  if (
    isDatatypeFilterConfigItemValueProducts(productFilterItem.value) &&
    productFilterItem.value.object_ids.length &&
    Array.isArray(productTypeFilterItem.value) &&
    productTypeFilterItem.value.length
  ) {
    if (
      productTypeFilterItem.comparator === FILTER_IN_OPERAND &&
      productFilterItem.comparator === FILTER_IN_OPERAND
    )
      if (
        !productTypeFilterItem.value.includes(
          productFilterItem.value.buyable_item_identifier,
        )
      )
        return true;

    if (
      productTypeFilterItem.comparator === FILTER_OUT_OPERAND &&
      productFilterItem.comparator === FILTER_IN_OPERAND
    )
      if (
        productTypeFilterItem.value.includes(
          productFilterItem.value.buyable_item_identifier,
        )
      )
        return true;
  }
  return false;
};

/**
 * This returns a boolean which checks if product filters have the same product type (i.e buyable_item_identifier in value)
 * within a group.
 *
 * For quick filters, groups key only have 1 group with multiple filters_data
 */
export const areProductFiltersInGroupIncompatible = (
  filtersData: DatatypeFilterConfigItem[],
) => {
  if (!filtersData) {
    return false;
  }

  const getFilterItem = (datatype: string) =>
    filtersData.find((filterItem) => filterItem.datatype === datatype) || null;

  const [productFilterItem, productCategoryFilterItem, productTypeFilterItem] =
    [
      getFilterItem('products'),
      getFilterItem('product_category'),
      getFilterItem('product_type'),
    ];

  const notNullFiltersCount = [
    productFilterItem,
    productCategoryFilterItem,
    productTypeFilterItem,
  ].filter(Boolean).length;

  if (notNullFiltersCount < 2) return false;

  if (
    __areComplexProductFiltersIncompatible(
      productFilterItem,
      productCategoryFilterItem,
    )
  ) {
    return true;
  }

  if (
    __isProductFilterIncompatibleWithProductTypeFilter(
      productFilterItem,
      productTypeFilterItem,
    ) ||
    __isProductFilterIncompatibleWithProductTypeFilter(
      productCategoryFilterItem,
      productTypeFilterItem,
    )
  ) {
    return true;
  }
};
