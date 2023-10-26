import Immutable from 'seamless-immutable';

import {
  MARKETPLACE_OFFER_CARD_CONFIGURATION,
  MARKETPLACE_OFFER_CARD_PREVIEW,
} from '#marketplacecomponents/@Offer/MarketplaceCardOfferCSSOnly';

import {
  MARKETPLACE_BOOKER_MODULE_OFFER_SUMMARY_CONFIGURATION,
  MARKETPLACE_BOOKER_MODULE_OFFER_SUMMARY_PREVIEW,
} from '#marketplacecomponents/@Offer/BookerModuleOfferSummary';

import {
  MARKETPLACE_PAYMENT_COMBO_CARD_CONFIGURATION,
  MARKETPLACE_PAYMENT_COMBO_CARD_PREVIEW,
} from '#marketplacecomponents/@PaymentCombo/MarketplacePaymentComboCard/custom_css_variant';
import {
  MARKETPLACE_PAYMENT_PACK_CARD_CONFIGURATION,
  MARKETPLACE_PAYMENT_PACK_CARD_PREVIEW,
} from '#marketplacecomponents/@PaymentPack/MarketplacePaymentPackCard/custom_css_variant';
import {
  MARKETPLACE_PAYMENT_PACK_COMPATIBILITY_MODAL_CONFIGURATION,
  MARKETPLACE_PAYMENT_PACK_COMPATIBILITY_MODAL_PREVIEW,
} from '#marketplacecomponents/@PaymentPack/MarketplacePaymentPackCompatibilityModal/custom_css_variant';
import {
  MARKETPLACE_PAYMENT_PACK_RESTRICTION_MODAL_CONFIGURATION,
  MARKETPLACE_PAYMENT_PACK_RESTRICTION_MODAL_PREVIEW,
} from '#marketplacecomponents/@PaymentPack/MarketplacePaymentPackRestrictionModal/custom_css_variant';
import {
  MARKETPLACE_PRIVATE_PASS_CARD_CONFIGURATION,
  MARKETPLACE_PRIVATE_PASS_CARD_PREVIEW,
} from '#marketplacecomponents/@PrivatePass/MarketplacePrivatePassCard/custom_css_variant';
import {
  MARKETPLACE_PRIVATE_PASS_COMPATIBILITY_MODAL_CONFIGURATION,
  MARKETPLACE_PRIVATE_PASS_COMPATIBILITY_MODAL_PREVIEW,
} from '#marketplacecomponents/@PrivatePass/MarketplacePrivatePassCompatibilityModal/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_CARD_CONFIGURATION,
  MARKETPLACE_CONTRACT_CARD_PREVIEW,
} from '#marketplacecomponents/@Subscription/MarketplaceContractCard/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_CHECKOUT_CONFIGURATION,
  MARKETPLACE_CONTRACT_CHECKOUT_PREVIEW,
} from '#marketplacecomponents/@Subscription/MarketplaceContractCheckout/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_DETAIL_CONFIGURATION,
  MARKETPLACE_CONTRACT_DETAIL_PREVIEW,
} from '#marketplacecomponents/@Subscription/MarketplaceContractDetail/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_DETAIL_MODAL_CONFIGURATION,
  MARKETPLACE_CONTRACT_DETAIL_MODAL_PREVIEW,
} from '#marketplacecomponents/@Subscription/MarketplaceContractDetailModal/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_TERMS_MODAL_CONFIGURATION,
  MARKETPLACE_CONTRACT_TERMS_MODAL_PREVIEW,
} from '#marketplacecomponents/@Subscription/MarketplaceContractTermsModal/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_COOLDOWN_MODAL_CONFIGURATION,
  MARKETPLACE_CONTRACT_COOLDOWN_MODAL_PREVIEW,
} from '#marketplacecomponents/@Subscription/MarketplaceContractCooldownModal/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_COUPON_FORM_MODAL_CONFIGURATION,
  MARKETPLACE_CONTRACT_COUPON_FORM_MODAL_PREVIEW,
} from '#marketplacecomponents/@Coupon/MarketplaceCouponFormModal/custom_css_variant';
import {
  MARKETPLACE_PAYMENT_PACK_OFFPEAK_RESTRICTION_MODAL_CONFIGURATION,
  MARKETPLACE_PAYMENT_PACK_OFFPEAK_RESTRICTION_MODAL_PREVIEW,
} from '#marketplacecomponents/@PaymentPack/MarketplacePaymentPackOffPeakRestrictionModal/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_NOT_FOUND_CONFIGURATION,
  MARKETPLACE_CONTRACT_NOT_FOUND_PREVIEW,
} from '#marketplacecomponents/@Subscription/MarketplaceContractNotFound/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_PAYMENT_CONFIGURATION,
  MARKETPLACE_CONTRACT_PAYMENT_PREVIEW,
} from '#marketplacecomponents/@Payment/MarketplaceContractPayment/custom_css_variant';
import {
  MARKETPLACE_COLLECT_PAYMENT_METHOD_CONFIGURATION,
  MARKETPLACE_COLLECT_PAYMENT_METHOD_PREVIEW,
} from '#marketplacecomponents/@Payment/MarketplaceCollectPaymentMethod/custom_css_variant';
import {
  MARKETPLACE_CALENDAR_FILTER_CONFIGURATION,
  MARKETPLACE_CALENDAR_FILTER_PREVIEW,
} from '#marketplacecomponents/@RessourceFilter/MarketplaceFilterCSSOnly/custom_css_variant';
import {
  MARKETPLACE_OFFER_LIST_ITEM_CONFIGURATION,
  MARKETPLACE_OFFER_LIST_ITEM_PREVIEW,
} from '#marketplacecomponents/@Offer/MarketplaceOfferListItemCSSOnly/custom_css_variant';
import {
  MARKETPLACE_WEEK_TIME_TABLE_CONFIGURATION,
  MARKETPLACE_WEEK_TIME_TABLE_PREVIEW,
} from '#marketplacecomponents/@Calendar/MarketplaceWeekTimeTableCSSOnly/custom_css_variant';
import {
  MARKETPLACE_SEARCH_CONFIGURATION,
  MARKETPLACE_SEARCH_PREVIEW,
} from '#components/css-only/Search/custom_css_variant';
import {
  MARKETPLACE_FILTER_CONFIGURATION,
  MARKETPLACE_FILTER_PREVIEW,
} from '#marketplacecomponents/@RessourceFilter/MarketplaceFilter/custom_css_variant';
import {
  MARKETPLACE_DATE_PICKER_CONFIGURATION,
  MARKETPLACE_DATE_PICKER_PREVIEW,
} from '#marketplacecomponents/@Date/MarketplaceDatePicker/custom_css_variant';
import {
  MARKETPLACE_SELECT_CONFIGURATION,
  MARKETPLACE_SELECT_PREVIEW,
} from '#components/css-only/Select/custom_css_variant';

import {
  MARKETPLACE_ACTIVITY_CONFIGURATION,
  MARKETPLACE_ACTIVITY_PREVIEW,
} from '#marketplacecomponents/@Activity/MarketplaceActivityCSSOnly';

import {
  MARKETPLACE_ACTIVITY_DIALOG_CONFIGURATION,
  MARKETPLACE_ACTIVITY_DIALOG_PREVIEW,
} from '#marketplacecomponents/@Activity/MarketplaceActivityDialogCSSOnly';

import {
  MARKETPLACE_BOOKING_BUTTON_CONFIGURATION,
  MARKETPLACE_BOOKING_BUTTON_PREVIEW,
} from '#marketplacecomponents/@Booking/MarketplaceBookButton';

import {
  MARKETPLACE_BOOKING_BLOCKED_CONFIGURATION,
  MARKETPLACE_BOOKING_BLOCKED_PREVIEW,
} from '#marketplacecomponents/@Booking/MarketplaceBookingBlockedReason';

import {
  MARKETPLACE_ITEM_QUANTITY_CONFIGURATION,
  MARKETPLACE_ITEM_QUANTITY_PREVIEW,
} from '#marketplacecomponents/@Basket/MarketplaceBasketSummaryItemCssOnly/ItemQuantity';

import {
  MARKETPLACE_BASKET_SUMMARY_ITEM_CONFIGURATION,
  MARKETPLACE_BASKET_SUMMARY_ITEM_PREVIEW,
} from '#marketplacecomponents/@Basket/MarketplaceBasketSummaryItemCssOnly';

import {
  MARKETPLACE_BASKET_SUMMARY_LIST_ITEM_CONFIGURATION,
  MARKETPLACE_BASKET_SUMMARY_LIST_ITEM_PREVIEW,
} from '#marketplacecomponents/@Basket/MarketplaceBasketSummaryListCssOnly';

import {
  MARKETPLACE_BASKET_SUMMARY_CONFIGURATION,
  MARKETPLACE_BASKET_SUMMARY_PREVIEW,
} from '#marketplacecomponents/@Basket/BasketSummaryCssOnly';

import {
  MARKETPLACE_BASKET_SUMMARY_DIALOG_CONFIGURATION,
  MARKETPLACE_BASKET_SUMMARY_DIALOG_PREVIEW,
} from '#marketplacecomponents/@Basket/MarketplaceBasketSummaryDialogCssOnly';
import {
  MARKETPLACE_PREPAID_LINE_ITEM_CONFIGURATION,
  MARKETPLACE_PREPAID_LINE_ITEM_PREVIEW,
} from '#marketplacecomponents/@Basket/MarketplaceBasketSummaryPrepaidLineItem';
import {
  MARKETPLACE_PREPAID_LINE_LIST_CONFIGURATION,
  MARKETPLACE_PREPAID_LINE_LIST_PREVIEW,
} from '#marketplacecomponents/@Basket/MarketplaceBasketSummaryPrepaidLineList';
import {
  FABRIQUE_TYPOGRAPHY_CONFIGURATION,
  FABRIQUE_TYPOGRAPHY_PREVIEW,
} from '#components/css-only/Fabrique/Typography';
import {
  FABRIQUE_CARD_CONFIGURATION,
  FABRIQUE_CARD_PREVIEW,
} from '#components/css-only/Fabrique/Card';

import {
  CSSComponentPreviews,
  MarketplaceCSSComponentConfig,
  MarketplacePage,
} from '#libs/exportable-components/types';

import { CssComponentsVariantIdentifiers } from './constants';
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
  MARKETPLACE_ACTIVITY_CONFIGURATION,
  MARKETPLACE_ACTIVITY_DIALOG_CONFIGURATION,
  MARKETPLACE_BOOKING_BUTTON_CONFIGURATION,
  MARKETPLACE_BOOKING_BLOCKED_CONFIGURATION,
  MARKETPLACE_ITEM_QUANTITY_CONFIGURATION,
  MARKETPLACE_BASKET_SUMMARY_ITEM_CONFIGURATION,
  MARKETPLACE_BASKET_SUMMARY_LIST_ITEM_CONFIGURATION,
  MARKETPLACE_BASKET_SUMMARY_CONFIGURATION,
  MARKETPLACE_BASKET_SUMMARY_DIALOG_CONFIGURATION,
  MARKETPLACE_PREPAID_LINE_ITEM_CONFIGURATION,
  MARKETPLACE_PREPAID_LINE_LIST_CONFIGURATION,
  MARKETPLACE_BOOKER_MODULE_OFFER_SUMMARY_CONFIGURATION,
  FABRIQUE_TYPOGRAPHY_CONFIGURATION,
  FABRIQUE_CARD_CONFIGURATION,
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
    [CssComponentsVariantIdentifiers.MARKETPLACE_ACTIVITY_DIALOG]:
      MARKETPLACE_ACTIVITY_DIALOG_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_ACTIVITY]:
      MARKETPLACE_ACTIVITY_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_BOOKING_BLOCKED]:
      MARKETPLACE_BOOKING_BLOCKED_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_BOOKING_BUTTON]:
      MARKETPLACE_BOOKING_BUTTON_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_CALENDAR_FILTER]:
      MARKETPLACE_CALENDAR_FILTER_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_COLLECT_PAYMENT_METHOD]:
      MARKETPLACE_COLLECT_PAYMENT_METHOD_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_CONTRACT_CARD]:
      MARKETPLACE_CONTRACT_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_CONTRACT_CHECKOUT]:
      MARKETPLACE_CONTRACT_CHECKOUT_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_CONTRACT_COOLDOWN_MODAL]:
      MARKETPLACE_CONTRACT_COOLDOWN_MODAL_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_CONTRACT_COUPON_FORM_MODAL]:
      MARKETPLACE_CONTRACT_COUPON_FORM_MODAL_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_CONTRACT_DETAIL_MODAL]:
      MARKETPLACE_CONTRACT_DETAIL_MODAL_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_CONTRACT_DETAIL]:
      MARKETPLACE_CONTRACT_DETAIL_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_CONTRACT_NOT_FOUND]:
      MARKETPLACE_CONTRACT_NOT_FOUND_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_CONTRACT_PAYMENT]:
      MARKETPLACE_CONTRACT_PAYMENT_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_CONTRACT_TERMS_MODAL]:
      MARKETPLACE_CONTRACT_TERMS_MODAL_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_DATE_PICKER]:
      MARKETPLACE_DATE_PICKER_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_FILTER]:
      MARKETPLACE_FILTER_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_OFFER_CARD]:
      MARKETPLACE_OFFER_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_OFFER_LIST_ITEM]:
      MARKETPLACE_OFFER_LIST_ITEM_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_PAYMENT_COMBO_CARD]:
      MARKETPLACE_PAYMENT_COMBO_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_PAYMENT_PACK_CARD]:
      MARKETPLACE_PAYMENT_PACK_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_PAYMENT_PACK_COMPATIBILITY_MODAL]:
      MARKETPLACE_PAYMENT_PACK_COMPATIBILITY_MODAL_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_PAYMENT_PACK_OFFPEAK_RESTRICTION_MODAL]:
      MARKETPLACE_PAYMENT_PACK_OFFPEAK_RESTRICTION_MODAL_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_PAYMENT_PACK_RESTRICTION_MODAL]:
      MARKETPLACE_PAYMENT_PACK_RESTRICTION_MODAL_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_PRIVATE_PASS_CARD]:
      MARKETPLACE_PRIVATE_PASS_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_PRIVATE_PASS_COMPATIBILITY_MODAL]:
      MARKETPLACE_PRIVATE_PASS_COMPATIBILITY_MODAL_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_SEARCH]:
      MARKETPLACE_SEARCH_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_SELECT]:
      MARKETPLACE_SELECT_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_WEEK_TIME_TABLE]:
      MARKETPLACE_WEEK_TIME_TABLE_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_PREPAID_LINE_ITEM]:
      MARKETPLACE_PREPAID_LINE_ITEM_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_PREPAID_LINE_LIST]:
      MARKETPLACE_PREPAID_LINE_LIST_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_ITEM_QUANTITY]:
      MARKETPLACE_ITEM_QUANTITY_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_BASKET_SUMMARY_ITEM_PREVIEW]:
      MARKETPLACE_BASKET_SUMMARY_ITEM_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_BASKET_SUMMARY_LIST_ITEM_PREVIEW]:
      MARKETPLACE_BASKET_SUMMARY_LIST_ITEM_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_BASKET_SUMMARY_PREVIEW]:
      MARKETPLACE_BASKET_SUMMARY_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_BASKET_SUMMARY_DIALOG_PREVIEW]:
      MARKETPLACE_BASKET_SUMMARY_DIALOG_PREVIEW,
    [CssComponentsVariantIdentifiers.BOOKER_MODULE_OFFER_SUMMARY]:
      MARKETPLACE_BOOKER_MODULE_OFFER_SUMMARY_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_TYPOGRAPHY]:
      FABRIQUE_TYPOGRAPHY_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_CARD]: FABRIQUE_CARD_PREVIEW,
  });
export const CSS_COMPONENT_PAGES: Immutable.Immutable<MarketplacePage[]> =
  Immutable(Array.from(new Set(CSS_COMPONENTS.flatMap((c) => c.pages))));
