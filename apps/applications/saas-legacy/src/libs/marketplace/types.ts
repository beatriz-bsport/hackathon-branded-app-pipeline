import { Immutable } from 'seamless-immutable';

import { Coach } from '#src/libs/associated-coach/types';
import { SCT } from '#src/libs/category/types';
import { Establishment } from '#src/libs/establishment/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { Offer } from '#src/libs/offer/types';
import { PaymentCombo } from '#src/libs/payment-combo/types';
import {
  PaymentPack,
  PaymentPackCategoryWithPacks,
} from '#src/libs/payment-packs/types';
import { PrivatePassCategoryWithPasses } from '#src/libs/private-service/types';
import { WidgetCustomCSS } from '#src/libs/theme/types';
import { ErrorAndLoading } from '#src/libs/types';
import { NewsletterV2FieldsKind } from './constants';

/**
 * The available components we can use in the marketplace
 */
export type MarketplaceCommonFilter = {
  coaches?: number[];
  establishments?: number[];
  metaActivities?: number[];
  levels?: number[];
  establishmentGroups?: number[];
};

export type MarketplaceOnlineFiltering = {
  onlineFilter?: { is_online?: boolean };
};

export type MarketplaceCalendarData = MarketplaceCommonFilter &
  MarketplaceOnlineFiltering & {
    // @deprecated use cardMode instead
    compactMode?: true | false | null;
    cardMode?: true | false | null;
    todayOnly?: boolean;
    variant?: MarketplaceCalendarVariant;
    groupSessionByPeriod?: boolean;
    cardModeDisplayMinWidth?: number | string;
  };

export type MarketplaceCalendarVariant = 'activityName' | 'coach' | 'time';

export type MarketplaceWorkshopData = MarketplaceCommonFilter;

export enum MarketplacePrivateServiceTypeEnum {
  list = 'list',
  detail = 'detail',
}

export type MarketplacePrivateServiceData = {
  type: MarketplacePrivateServiceTypeEnum;
  serviceId?: number | null;
  privateGroups?: number[] | null;
};

export type MarketplacePrivateServiceSessionData = {
  date: string;
  establishment: number;
  associated_coach: number;
};

export type MarketplacePassParams = {
  hideFilters?: string;
  hidePaymentPack?: string;
  hidePrivatePass?: string;
  hidePaymentCombo?: string;
  paymentPackCategories?: number[] | null;
  privatePassCategories?: number[] | null;
};

export type MarketplacePassData = {
  hideFilters?: boolean;
  hidePaymentPack?: boolean;
  hidePrivatePass?: boolean;
  hidePaymentCombo?: boolean;
  paymentPackCategories?: number[];
  privatePassCategories?: number[];
};

export type MarketplacePaymentPackTemplateData = {
  paymentPackTemplateList?: Array<number>;
};

export type MarketplacePaymentPackTemplateParams = {
  paymentPackTemplateList: number[];
};

export type MarketplaceGiftcardData = {
  giftcards?: number[];
};

export type MarketplaceVODData = {
  videoId?: number;
};

export type MarketplacePlaylistData = {
  playlistId?: number;
};

export type MarketplaceNewsletterV2Data = {
  fieldsType?: `${NewsletterV2FieldsKind}`;
  showTitle?: boolean;
  title?: string;
  showSubtitle?: boolean;
  subtitle?: string;
  showSuccessTitle?: boolean;
  successTitle?: string;
  showSuccessText?: boolean;
  successText?: string;
  tag_id?: number;
};

export type MarketplaceComponentConfig = {
  calendar?: MarketplaceCalendarData;
  workshop?: MarketplaceWorkshopData;
  privateService?: MarketplacePrivateServiceData;
  paymentPackTemplate?: MarketplacePaymentPackTemplateData;
  pass?: MarketplacePassData;
  vod?: {};
  subscription?: {};
  shop?: {};
  playlist?: MarketplacePlaylistData;
};

export type MarketplaceTabConfig = {
  component_type: string;
  title: string;
  index: number;
  config: MarketplaceComponentConfig;
};

export type WidgetConfig = {
  parentElement: string;
  companyId: number;
  franchiseId: number;
  dialogMode: 0 | 1 | 2;
  language?: string;
  widgetType: string;
  config: MarketplaceComponentConfig;
  showFab: boolean;
  fullScreenPopup: boolean;
  styles: WidgetCustomCSS;
  isBackofficePreview?: boolean;
};

/**
 * @description This optional type is to be used wisely. Props from the widget configuration down to the page
 * are not consistently passed down to the bsport-saas-related page. That is why all props are optional.
 */
export type OptionalWidgetConfig = Partial<WidgetConfig>;

export type MarketplaceSettings = {
  company: number;
  id: number;
  is_custom: boolean;
  config: MarketplaceTabConfig[];
};

export type PricingOptionOrdering = [number, null | number][];

export type BookingFunnelConfiguration = {
  company: number;
  custom_pricing_option_ordering_enabled: boolean;
  custom_pricing_option_ordering: PricingOptionOrdering;
  current_pricing_option_ordering: PricingOptionOrdering;
};

export type MarketplaceSettingState = {
  loading: boolean;
  error?: Error;
  settings: MarketplaceSettings | null;
  bookingFunnel: {
    loading: boolean;
    error: Error;
    configuration: BookingFunnelConfiguration | null;
  };
};

export type MarketplaceMetaActivity = MetaActivity &
  ErrorAndLoading & {
    nextPage: number | null;
    count: number;
    offers: Offer<Coach, Establishment>[];
  };

export type MarketplaceFilters = {
  coaches: number[];
  establishments: number[];
  levels: number[];
  activity__in: number[];
  establishment_group__in: number[];
};
export type MarketplaceFiltersSetter = (
  key: keyof MarketplaceFilters,
) => (value: number[]) => void;

export type MarketplaceCategoryPassFilterOption = {
  label: string;
  value: number | string;
};

export type MarketplacePassFiltersHookOptions = {
  selectedCategories?: Array<number | string>;

  paymentPackByCategory?: Immutable<PaymentPackCategoryWithPacks[]>;
  restrictedPaymentPackCategories?: number[];
  fuzzySearchPaymentPackResults?: number[] | null;

  privatePassByCategory?: Immutable<PrivatePassCategoryWithPasses[]>;
  restrictedPrivatePassCategories?: number[];
  fuzzySearchPrivatePassResults?: number[] | null;

  paymentComboList?: PaymentCombo[];
  fuzzySearchPaymentComboResults?: number[] | null;
};

export type MarketplacePassSearchHookOptions = {
  paymentPackByCategory: Immutable<PaymentPackCategoryWithPacks[]>;
  restrictedPaymentPackCategories: number[];
  privatePassByCategory: Immutable<PrivatePassCategoryWithPasses[]>;
  restrictedPrivatePassCategories: number[];
};

export type MarketplacePassPagePaymentPack = PaymentPack & {
  categories: SCT[];
  metaActivities: MetaActivity[];
  establishments: Establishment[];
};

export type MarketplacePassDialogStateKey =
  | 'isPaymentPackDetailsDialogOpen'
  | 'isPaymentPackCompatibilityDialogOpen'
  | 'isPaymentPackRestrictionDialogOpen'
  | 'isPrivatePassDetailsDialogOpen'
  | 'isPrivatePassCompatibilityDialogOpen'
  | 'isPaymentPackOffPeakRestrictionDialogOpen'
  | 'isPaymentComboDetailsDialogOpen';

export enum MarketplacePassPageDialogState {
  PaymentPackDetail = 'isPaymentPackDetailsDialogOpen',
  PaymentPackCompatibility = 'isPaymentPackCompatibilityDialogOpen',
  PaymentPackRestriction = 'isPaymentPackRestrictionDialogOpen',
  PaymentPackOffPeakRestriction = 'isPaymentPackOffPeakRestrictionDialogOpen',
  PrivatePassDetail = 'isPrivatePassDetailsDialogOpen',
  PrivatePassCompatibility = 'isPrivatePassCompatibilityDialogOpen',
  PaymentComboDetail = 'isPaymentComboDetailsDialogOpen',
}

export interface EventWithElementTarget extends Event {
  target: EventTarget;
}

export enum MarketplacePaymentMethods {
  card = 'card',
  sepa = 'sepa_debit',
  bacs = 'bacs_debit',
  bsport = 'bsport:credit',
  terminal = 'terminal',
}

export type MarketplacePaymentMethodsType =
  | typeof MarketplacePaymentMethods.card
  | typeof MarketplacePaymentMethods.sepa
  | typeof MarketplacePaymentMethods.bacs
  | typeof MarketplacePaymentMethods.bsport
  | typeof MarketplacePaymentMethods.terminal;

export enum MarketplaceStripeElementType {
  card = 'card',
  sepa = 'iban',
}
export type BillingDetails = {
  name: string;
  email?: string;
  phone?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
};
/**
 *  @description Type for the state used by the React component
 * responsible for managing the collection of payment method information.
 */

export type MarketplacePaymentMethodBillingDetails = BillingDetails & {
  sortCode?: string;
  accountNumber?: string;
};

export type OfferFeature =
  | {
      isBookable: boolean;
      isWaitingList: boolean;
      loading: boolean;
      isRegistered: boolean;
      isRegisteredWaitingList: boolean;
      noInteraction: boolean;
      blocked_by_tags: boolean;
      blockedByTags?: undefined;
    }
  | {
      isBookable: boolean;
      isWaitingList: boolean;
      loading: boolean;
      isRegistered: any;
      isRegisteredWaitingList: boolean;
      noInteraction: any;
      blockedByTags: any;
      blocked_by_tags?: undefined;
    };

export enum PassesPageTabNames {
  ALL = 'all',
  PASSES = 'passes',
  APPOINTMENT_PASSES = 'appointment-passes',
}

export enum PassTypes {
  PAYMENTPACK = 'paymentPack',
  PRIVATEPASS = 'privatePass',
  PAYMENTCOMBO = 'paymentCombo',
}
