import Immutable from 'seamless-immutable';

import {
  MARKETPLACE_OFFER_CARD_CONFIGURATION,
  MARKETPLACE_OFFER_CARD_PREVIEW,
} from '#libs/marketplace/components/MarketplaceCardOfferCSSOnly';
import {
  MARKETPLACE_PAYMENT_COMBO_CARD_CONFIGURATION,
  MARKETPLACE_PAYMENT_COMBO_CARD_PREVIEW,
} from '#libs/marketplace/components/MarketplacePaymentComboCard/custom_css_variant';
import {
  MARKETPLACE_PAYMENT_PACK_CARD_CONFIGURATION,
  MARKETPLACE_PAYMENT_PACK_CARD_PREVIEW,
} from '#libs/marketplace/components/MarketplacePaymentPackCard/custom_css_variant';
import {
  MARKETPLACE_PAYMENT_PACK_COMPATIBILITY_MODAL_CONFIGURATION,
  MARKETPLACE_PAYMENT_PACK_COMPATIBILITY_MODAL_PREVIEW,
} from '#libs/marketplace/components/MarketplacePaymentPackCompatibilityModal/custom_css_variant';
import {
  MARKETPLACE_PAYMENT_PACK_RESTRICTION_MODAL_CONFIGURATION,
  MARKETPLACE_PAYMENT_PACK_RESTRICTION_MODAL_PREVIEW,
} from '#libs/marketplace/components/MarketplacePaymentPackRestrictionModal/custom_css_variant';
import {
  MARKETPLACE_PRIVATE_PASS_CARD_CONFIGURATION,
  MARKETPLACE_PRIVATE_PASS_CARD_PREVIEW,
} from '#libs/marketplace/components/MarketplacePrivatePassCard/custom_css_variant';
import {
  MARKETPLACE_PRIVATE_PASS_COMPATIBILITY_MODAL_CONFIGURATION,
  MARKETPLACE_PRIVATE_PASS_COMPATIBILITY_MODAL_PREVIEW,
} from '#libs/marketplace/components/MarketplacePrivatePassCompatibilityModal/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_CARD_CONFIGURATION,
  MARKETPLACE_CONTRACT_CARD_PREVIEW,
} from '#libs/marketplace/components/@Subscription/MarketplaceContractCard/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_CHECKOUT_CONFIGURATION,
  MARKETPLACE_CONTRACT_CHECKOUT_PREVIEW,
} from '#libs/marketplace/components/@Subscription/MarketplaceContractCheckout/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_DETAIL_CONFIGURATION,
  MARKETPLACE_CONTRACT_DETAIL_PREVIEW,
} from '#libs/marketplace/components/@Subscription/MarketplaceContractDetail/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_DETAIL_MODAL_CONFIGURATION,
  MARKETPLACE_CONTRACT_DETAIL_MODAL_PREVIEW,
} from '#libs/marketplace/components/@Subscription/MarketplaceContractDetailModal/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_TERMS_MODAL_CONFIGURATION,
  MARKETPLACE_CONTRACT_TERMS_MODAL_PREVIEW,
} from '#libs/marketplace/components/MarketplaceContractTermsModal/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_COOLDOWN_MODAL_CONFIGURATION,
  MARKETPLACE_CONTRACT_COOLDOWN_MODAL_PREVIEW,
} from '#libs/marketplace/components/@Subscription/MarketplaceContractCooldownModal/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_COUPON_FORM_MODAL_CONFIGURATION,
  MARKETPLACE_CONTRACT_COUPON_FORM_MODAL_PREVIEW,
} from '#libs/marketplace/components/MarketplaceCouponFormModal/custom_css_variant';
import {
  MARKETPLACE_PAYMENT_PACK_OFFPEAK_RESTRICTION_MODAL_CONFIGURATION,
  MARKETPLACE_PAYMENT_PACK_OFFPEAK_RESTRICTION_MODAL_PREVIEW,
} from '#libs/marketplace/components/MarketplacePaymentPackOffPeakRestrictionModal/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_NOT_FOUND_CONFIGURATION,
  MARKETPLACE_CONTRACT_NOT_FOUND_PREVIEW,
} from '#libs/marketplace/components/@Subscription/MarketplaceContractNotFound/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_PAYMENT_CONFIGURATION,
  MARKETPLACE_CONTRACT_PAYMENT_PREVIEW,
} from '#libs/marketplace/components/MarketplaceContractPayment/custom_css_variant';
import {
  MARKETPLACE_COLLECT_PAYMENT_METHOD_CONFIGURATION,
  MARKETPLACE_COLLECT_PAYMENT_METHOD_PREVIEW,
} from '#libs/marketplace/components/MarketplaceCollectPaymentMethod/custom_css_variant';
import {
  MARKETPLACE_CALENDAR_FILTER_CONFIGURATION,
  MARKETPLACE_CALENDAR_FILTER_PREVIEW,
} from '#libs/marketplace/components/MarketplaceFilterCSSOnly/custom_css_variant';
import {
  MARKETPLACE_OFFER_LIST_ITEM_CONFIGURATION,
  MARKETPLACE_OFFER_LIST_ITEM_PREVIEW,
} from '#libs/marketplace/components/MarketplaceOfferListItemCSSOnly/custom_css_variant';
import {
  MARKETPLACE_WEEK_TIME_TABLE_CONFIGURATION,
  MARKETPLACE_WEEK_TIME_TABLE_PREVIEW,
} from '#libs/marketplace/components/MarketplaceWeekTimeTableCSSOnly/custom_css_variant';
import {
  MARKETPLACE_SEARCH_CONFIGURATION,
  MARKETPLACE_SEARCH_PREVIEW,
} from '#components/css-only/Search/custom_css_variant';
import {
  MARKETPLACE_FILTER_CONFIGURATION,
  MARKETPLACE_FILTER_PREVIEW,
} from '#libs/marketplace/components/MarketplaceFilter/custom_css_variant';
import {
  MARKETPLACE_DATE_PICKER_CONFIGURATION,
  MARKETPLACE_DATE_PICKER_PREVIEW,
} from '#libs/marketplace/components/MarketplaceDatePicker/custom_css_variant';
import {
  MARKETPLACE_SELECT_CONFIGURATION,
  MARKETPLACE_SELECT_PREVIEW,
} from '#components/css-only/Select/custom_css_variant';

import {
  CSSComponentPreviews,
  MarketplaceCSSComponentConfig,
  MarketplacePage,
} from '#libs/exportable-components/types';

/* import {
  MARKETPLACE_GROUP_OFFER_LIST_ITEM_CONFIGURATION,
  MARKETPLACE_GROUP_OFFER_LIST_ITEM_PREVIEW,
} from '#libs/marketplace/components/MarketplaceGroupOfferListItem.component';
import {
  MARKETPLACE_WORKSHOP_CARD_CONFIGURATION,
  MARKETPLACE_WORKSHOP_CARD_PREVIEW,
} from '#libs/marketplace/components/MarketplaceWorkshopCard.component';
import {
  MARKETPLACE_FILTER_CONFIGURATION,
  MARKETPLACE_FILTER_PREVIEW,
} from '#libs/marketplace/components/MarketplaceFilterCSSOnly';
import {
  MARKETPLACE_FILTERS_CONFIGURATION,
  MARKETPLACE_FILTERS_PREVIEW,
} from '#libs/marketplace/components/MarketplaceFiltersCSSOnly';
import {
  MARKETPLACE_BOOK_BUTTON_CONFIGURATION,
  MARKETPLACE_BOOK_BUTTON_PREVIEW,
} from '#libs/marketplace/components/MarketplaceBookButtonCSSOnly';
import {
  MARKETPLACE_DATE_PICKER_CONFIGURATION,
  MARKETPLACE_DATE_PICKER_PREVIEW,
} from '#libs/marketplace/components/MarketplaceDatePicker';
import {
  MARKETPLACE_ACTIVITY_CONFIGURATION,
  MARKETPLACE_ACTIVITY_PREVIEW,
} from '#libs/marketplace/components/MarketplaceActivityCSSOnly';
import {
  MARKETPLACE_CALENDAR_CONFIGURATION,
  MARKETPLACE_CALENDAR_PREVIEW,
} from '#libs/marketplace/components/MarketplaceCalendarCSSOnly';
import {
  MARKETPLACE_TIME_TABLE_CONFIGURATION,
  MARKETPLACE_TIME_TABLE_PREVIEW,
} from '#libs/marketplace/components/MarketplaceWeekTimeTableCSSOnly';
import {
  MARKETPLACE_OFFER_LIST_ITEM_CONFIGURATION,
  MARKETPLACE_OFFER_LIST_ITEM_PREVIEW,
} from '#libs/marketplace/components/MarketplaceOfferListItemCSSOnly';
import {
  MARKETPLACE_LEVEL_CONFIGURATION,
  MARKETPLACE_LEVEL_PREVIEW,
} from '#libs/marketplace/components/MarketplaceLevelCSSOnly';
import {
  MARKETPLACE_BROADCAST_CONFIGURATION,
  MARKETPLACE_BROADCAST_PREVIEW,
} from '#libs/marketplace/components/MarketplaceBroadcastCSSOnly';
import {
  MARKETPLACE_WORKSHOP_CONFIGURATION,
  MARKETPLACE_WORKSHOP_PREVIEW,
} from '#libs/marketplace/components/MarketplaceWorkshop.component';
*/

export const EXPORTABLE_COMPONENT_TYPE_VOD = 'vod';
export const EXPORTABLE_COMPONENT_TYPE_CALENDAR_V2 = 'calendarV2';
export const EXPORTABLE_COMPONENT_TYPE_CALENDAR = 'calendar';
export const EXPORTABLE_COMPONENT_TYPE_WORKSHOP = 'workshop';
export const EXPORTABLE_COMPONENT_TYPE_PASS = 'pass';
export const EXPORTABLE_COMPONENT_TYPE_PRIVATE_SERVICE = 'privateService';
export const EXPORTABLE_COMPONENT_TYPE_LOGIN_BUTTON = 'loginButton';
export const EXPORTABLE_COMPONENT_TYPE_PLAYLIST = 'playlist';
export const EXPORTABLE_COMPONENT_TYPE_SHOP = 'shop';
export const EXPORTABLE_COMPONENT_TYPE_SUBSCRIPTION = 'subscription';
export const EXPORTABLE_COMPONENT_TYPE_NEWSLETTER = 'newsletter';
export const EXPORTABLE_COMPONENT_TYPE_GIFTCARD = 'giftcard';
export const EXPORTABLE_COMPONENT_TYPE_PAYMENT_PACK_TEMPLATE =
  'paymentPackTemplate';

export const EXPORTABLE_COMPONENTS = [
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_CALENDAR_V2,
    label: 'marketplace.calendar',
    defaultConfig: {
      // @ts-ignore
      coaches: [],
      // @ts-ignore
      establishments: [],
      // @ts-ignore
      metaActivities: [],
      // @ts-ignore
      levels: [],
      // @ts-ignore
      variant: null,
      groupSessionByPeriod: true,
    },
  },

  {
    identifier: EXPORTABLE_COMPONENT_TYPE_CALENDAR,
    label: 'marketplace.calendar',
    defaultConfig: {
      coaches: [],
      establishments: [],
      metaActivities: [],
      levels: [],
      variant: null,
      groupSessionByPeriod: true,
    },
  },

  {
    identifier: EXPORTABLE_COMPONENT_TYPE_WORKSHOP,
    label: 'marketplace.workshop',
    defaultConfig: {
      // @ts-ignore
      coaches: [],
      // @ts-ignore
      establishments: [],
      // @ts-ignore
      metaActivities: [],
      // @ts-ignore
      levels: [],
    },
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_PASS,
    label: 'marketplace.pass',
    defaultConfig: {
      // @ts-ignore
      paymentPackCategories: [],
      // @ts-ignore
      privatePassCategories: [],
    },
  },
  {
    label: 'marketplace.vod',
    identifier: EXPORTABLE_COMPONENT_TYPE_VOD,
    defaultConfig: {
      // @ts-ignore
      videoId: null,
    },
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_PRIVATE_SERVICE,
    label: 'marketplace.private_service',
    defaultConfig: {
      type: 'list', // or 'detail';
    },
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_SUBSCRIPTION,
    label: 'marketplace.contract.tabName',
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_SHOP,
    label: 'marketplace.shop.tabName',
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_PLAYLIST,
    label: 'marketplace.playlist',
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_NEWSLETTER,
    label: 'newsletter',
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_GIFTCARD,
    label: 'giftcard',
    defaultConfig: {
      // @ts-ignore
      giftcards: [],
    },
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_LOGIN_BUTTON,
    label: 'loginButton',
  },
];

export type SetState = (key: string) => (value: any) => void;

/* TEMPLATE

{
  label: 'filters', "the uniq key of the component"
  css: MarketplaceFiltersCSS,  "the uniq css imported as raw string upper in the component"
  pages: ['workshop', 'calendar'], "All the page of the widget where the component is use"
  showAsFlex: true, "Boolean to display the component as center for small component"
  defaultState: { example: true },
  variations: [      "Array of configuration to modify the props send to the component"
   loadingVariation,
   variantVariation,
  ],
   },
 }
*/
export const CSS_COMPONENTS: MarketplaceCSSComponentConfig[] = [
  MARKETPLACE_SEARCH_CONFIGURATION,
  MARKETPLACE_FILTER_CONFIGURATION,
  MARKETPLACE_DATE_PICKER_CONFIGURATION,
  MARKETPLACE_SELECT_CONFIGURATION,
  MARKETPLACE_OFFER_CARD_CONFIGURATION,
  MARKETPLACE_OFFER_LIST_ITEM_CONFIGURATION,
  MARKETPLACE_CALENDAR_FILTER_CONFIGURATION,
  MARKETPLACE_PAYMENT_COMBO_CARD_CONFIGURATION,
  MARKETPLACE_PAYMENT_PACK_CARD_CONFIGURATION,
  MARKETPLACE_PAYMENT_PACK_COMPATIBILITY_MODAL_CONFIGURATION,
  MARKETPLACE_PAYMENT_PACK_RESTRICTION_MODAL_CONFIGURATION,
  MARKETPLACE_PAYMENT_PACK_OFFPEAK_RESTRICTION_MODAL_CONFIGURATION,
  MARKETPLACE_PRIVATE_PASS_CARD_CONFIGURATION,
  MARKETPLACE_PRIVATE_PASS_COMPATIBILITY_MODAL_CONFIGURATION,
  MARKETPLACE_CONTRACT_CARD_CONFIGURATION,
  MARKETPLACE_CONTRACT_CHECKOUT_CONFIGURATION,
  MARKETPLACE_CONTRACT_DETAIL_CONFIGURATION,
  MARKETPLACE_CONTRACT_DETAIL_MODAL_CONFIGURATION,
  MARKETPLACE_CONTRACT_TERMS_MODAL_CONFIGURATION,
  MARKETPLACE_CONTRACT_COOLDOWN_MODAL_CONFIGURATION,
  MARKETPLACE_CONTRACT_COUPON_FORM_MODAL_CONFIGURATION,
  MARKETPLACE_CONTRACT_NOT_FOUND_CONFIGURATION,
  MARKETPLACE_CONTRACT_PAYMENT_CONFIGURATION,
  MARKETPLACE_COLLECT_PAYMENT_METHOD_CONFIGURATION,
  MARKETPLACE_WEEK_TIME_TABLE_CONFIGURATION,

  /*
  MARKETPLACE_FILTER_CONFIGURATION,
  MARKETPLACE_FILTERS_CONFIGURATION,
  MARKETPLACE_DATE_PICKER_CONFIGURATION,
  MARKETPLACE_GROUP_OFFER_LIST_ITEM_CONFIGURATION,
  MARKETPLACE_OFFER_LIST_ITEM_CONFIGURATION,
  MARKETPLACE_WORKSHOP_CARD_CONFIGURATION,
  MARKETPLACE_TIME_TABLE_CONFIGURATION,
  MARKETPLACE_ACTIVITY_CONFIGURATION,
  MARKETPLACE_BOOK_BUTTON_CONFIGURATION,
  MARKETPLACE_LEVEL_CONFIGURATION,
  MARKETPLACE_BROADCAST_CONFIGURATION,
  MARKETPLACE_CALENDAR_CONFIGURATION,
  MARKETPLACE_WORKSHOP_CONFIGURATION,
  */
];

/*
We are using another object for the render to avoid importing unnecessary module
in the widget
Template
  key: (props: {  The render of the component for the editor ""
       theme, " Company theme ""
       setState, " implementation of a state for component where needed ""
       state,
       {...variations} " all the variations add new props needed by the components ""
     }) => {
   return (
     <MarketplaceFilters {...variations} />
   );
*/
export const CSS_COMPONENTS_BY_ID: Immutable.Immutable<CSSComponentPreviews> =
  Immutable({
    search: MARKETPLACE_SEARCH_PREVIEW,
    filter: MARKETPLACE_FILTER_PREVIEW,
    datePicker: MARKETPLACE_DATE_PICKER_PREVIEW,
    select: MARKETPLACE_SELECT_PREVIEW,
    cardOffer: MARKETPLACE_OFFER_CARD_PREVIEW,
    offerListItem: MARKETPLACE_OFFER_LIST_ITEM_PREVIEW,
    calendarFilters: MARKETPLACE_CALENDAR_FILTER_PREVIEW,
    calendarWeekTimeTable: MARKETPLACE_WEEK_TIME_TABLE_PREVIEW,
    paymentComboCard: MARKETPLACE_PAYMENT_COMBO_CARD_PREVIEW,
    paymentPackCard: MARKETPLACE_PAYMENT_PACK_CARD_PREVIEW,
    paymentPackCompatibilityModal:
      MARKETPLACE_PAYMENT_PACK_COMPATIBILITY_MODAL_PREVIEW,
    paymentPackRestrictionModal:
      MARKETPLACE_PAYMENT_PACK_RESTRICTION_MODAL_PREVIEW,
    paymentPackOffPeakRestrictionModal:
      MARKETPLACE_PAYMENT_PACK_OFFPEAK_RESTRICTION_MODAL_PREVIEW,
    privatePassCard: MARKETPLACE_PRIVATE_PASS_CARD_PREVIEW,
    privatePassCompatibilityModal:
      MARKETPLACE_PRIVATE_PASS_COMPATIBILITY_MODAL_PREVIEW,
    contractCard: MARKETPLACE_CONTRACT_CARD_PREVIEW,
    contractCheckout: MARKETPLACE_CONTRACT_CHECKOUT_PREVIEW,
    contractDetail: MARKETPLACE_CONTRACT_DETAIL_PREVIEW,
    contractDetailModal: MARKETPLACE_CONTRACT_DETAIL_MODAL_PREVIEW,
    contractTermsModal: MARKETPLACE_CONTRACT_TERMS_MODAL_PREVIEW,
    contractCooldownModal: MARKETPLACE_CONTRACT_COOLDOWN_MODAL_PREVIEW,
    contractCouponFormModal: MARKETPLACE_CONTRACT_COUPON_FORM_MODAL_PREVIEW,
    contractNotFound: MARKETPLACE_CONTRACT_NOT_FOUND_PREVIEW,
    contractPayment: MARKETPLACE_CONTRACT_PAYMENT_PREVIEW,
    collectPaymentMethod: MARKETPLACE_COLLECT_PAYMENT_METHOD_PREVIEW,
  });

export const CSS_COMPONENT_PAGES: Immutable.Immutable<MarketplacePage[]> =
  Immutable(Array.from(new Set(CSS_COMPONENTS.flatMap((c) => c.pages))));

export default CSS_COMPONENTS;
