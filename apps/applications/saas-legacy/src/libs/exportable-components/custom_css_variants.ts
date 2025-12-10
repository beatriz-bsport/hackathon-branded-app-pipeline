import Immutable from 'seamless-immutable';

import {
  MARKETPLACE_OFFER_CARD_CONFIGURATION,
  MARKETPLACE_OFFER_CARD_PREVIEW,
} from '#src/libs/marketplace/components/@Offer/MarketplaceCardOfferCSSOnly/custom_css_variant';

import {
  MARKETPLACE_BOOKER_MODULE_OFFER_SUMMARY_CONFIGURATION,
  MARKETPLACE_BOOKER_MODULE_OFFER_SUMMARY_PREVIEW,
} from '#src/libs/marketplace/components/@Offer/BookerModuleOfferSummary/custom_css_variant';

import {
  MARKETPLACE_PAYMENT_COMBO_CARD_CONFIGURATION,
  MARKETPLACE_PAYMENT_COMBO_CARD_PREVIEW,
} from '#src/libs/marketplace/components/@PaymentCombo/MarketplacePaymentComboCard/custom_css_variant';
import {
  MARKETPLACE_PAYMENT_PACK_CARD_CONFIGURATION,
  MARKETPLACE_PAYMENT_PACK_CARD_PREVIEW,
} from '#src/libs/marketplace/components/@PaymentPack/MarketplacePaymentPackCard/custom_css_variant';
import {
  MARKETPLACE_PAYMENT_PACK_COMPATIBILITY_MODAL_CONFIGURATION,
  MARKETPLACE_PAYMENT_PACK_COMPATIBILITY_MODAL_PREVIEW,
} from '#src/libs/marketplace/components/@PaymentPack/MarketplacePaymentPackCompatibilityModal/custom_css_variant';
import {
  MARKETPLACE_PAYMENT_PACK_RESTRICTION_MODAL_CONFIGURATION,
  MARKETPLACE_PAYMENT_PACK_RESTRICTION_MODAL_PREVIEW,
} from '#src/libs/marketplace/components/@PaymentPack/MarketplacePaymentPackRestrictionModal/custom_css_variant';
import {
  MARKETPLACE_PRIVATE_PASS_CARD_CONFIGURATION,
  MARKETPLACE_PRIVATE_PASS_CARD_PREVIEW,
} from '#src/libs/marketplace/components/@PrivatePass/MarketplacePrivatePassCard/custom_css_variant';
import {
  MARKETPLACE_PRIVATE_PASS_COMPATIBILITY_MODAL_CONFIGURATION,
  MARKETPLACE_PRIVATE_PASS_COMPATIBILITY_MODAL_PREVIEW,
} from '#src/libs/marketplace/components/@PrivatePass/MarketplacePrivatePassCompatibilityModal/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_CARD_CONFIGURATION,
  MARKETPLACE_CONTRACT_CARD_PREVIEW,
} from '#src/libs/marketplace/components/@Subscription/MarketplaceContractCard/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_CHECKOUT_CONFIGURATION,
  MARKETPLACE_CONTRACT_CHECKOUT_PREVIEW,
} from '#src/libs/marketplace/components/@Subscription/MarketplaceContractCheckout/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_DETAIL_CONFIGURATION,
  MARKETPLACE_CONTRACT_DETAIL_PREVIEW,
} from '#src/libs/marketplace/components/@Subscription/MarketplaceContractDetail/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_DETAIL_MODAL_CONFIGURATION,
  MARKETPLACE_CONTRACT_DETAIL_MODAL_PREVIEW,
} from '#src/libs/marketplace/components/@Subscription/MarketplaceContractDetailModal/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_TERMS_MODAL_CONFIGURATION,
  MARKETPLACE_CONTRACT_TERMS_MODAL_PREVIEW,
} from '#src/libs/marketplace/components/@Subscription/MarketplaceContractTermsModal/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_COOLDOWN_MODAL_CONFIGURATION,
  MARKETPLACE_CONTRACT_COOLDOWN_MODAL_PREVIEW,
} from '#src/libs/marketplace/components/@Subscription/MarketplaceContractCooldownModal/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_COUPON_FORM_MODAL_CONFIGURATION,
  MARKETPLACE_CONTRACT_COUPON_FORM_MODAL_PREVIEW,
} from '#src/libs/marketplace/components/@Coupon/MarketplaceCouponFormModal/custom_css_variant';
import {
  MARKETPLACE_PAYMENT_PACK_OFFPEAK_RESTRICTION_MODAL_CONFIGURATION,
  MARKETPLACE_PAYMENT_PACK_OFFPEAK_RESTRICTION_MODAL_PREVIEW,
} from '#src/libs/marketplace/components/@PaymentPack/MarketplacePaymentPackOffPeakRestrictionModal/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_NOT_FOUND_CONFIGURATION,
  MARKETPLACE_CONTRACT_NOT_FOUND_PREVIEW,
} from '#src/libs/marketplace/components/@Subscription/MarketplaceContractNotFound/custom_css_variant';
import {
  MARKETPLACE_CONTRACT_PAYMENT_CONFIGURATION,
  MARKETPLACE_CONTRACT_PAYMENT_PREVIEW,
} from '#src/libs/marketplace/components/@Payment/MarketplaceContractPayment/custom_css_variant';
import {
  MARKETPLACE_COLLECT_PAYMENT_METHOD_CONFIGURATION,
  MARKETPLACE_COLLECT_PAYMENT_METHOD_PREVIEW,
} from '#src/libs/marketplace/components/@Payment/MarketplaceCollectPaymentMethod/custom_css_variant';
import {
  MARKETPLACE_CALENDAR_FILTER_CONFIGURATION,
  MARKETPLACE_CALENDAR_FILTER_PREVIEW,
} from '#src/libs/marketplace/components/@RessourceFilter/MarketplaceFilterCSSOnly/custom_css_variant';
import {
  MARKETPLACE_OFFER_LIST_ITEM_CONFIGURATION,
  MARKETPLACE_OFFER_LIST_ITEM_PREVIEW,
} from '#src/libs/marketplace/components/@Offer/MarketplaceOfferListItemCSSOnly/custom_css_variant';
import {
  MARKETPLACE_WEEK_TIME_TABLE_CONFIGURATION,
  MARKETPLACE_WEEK_TIME_TABLE_PREVIEW,
} from '#src/libs/marketplace/components/@Calendar/MarketplaceWeekTimeTableCSSOnly/custom_css_variant';
import {
  MARKETPLACE_SEARCH_CONFIGURATION,
  MARKETPLACE_SEARCH_PREVIEW,
} from '#src/components/css-only/Search/custom_css_variant';
import {
  MARKETPLACE_FILTER_CONFIGURATION,
  MARKETPLACE_FILTER_PREVIEW,
} from '#src/libs/marketplace/components/@RessourceFilter/MarketplaceFilter/custom_css_variant';
import {
  MARKETPLACE_DATE_PICKER_CONFIGURATION,
  MARKETPLACE_DATE_PICKER_PREVIEW,
} from '#src/libs/marketplace/components/@Date/MarketplaceDatePicker/custom_css_variant';
import {
  MARKETPLACE_SELECT_CONFIGURATION,
  MARKETPLACE_SELECT_PREVIEW,
} from '#src/components/css-only/Select/custom_css_variant';

import {
  MARKETPLACE_ACTIVITY_CONFIGURATION,
  MARKETPLACE_ACTIVITY_PREVIEW,
} from '#src/libs/marketplace/components/@Activity/MarketplaceActivityCSSOnly/custom_css_variant';

import {
  MARKETPLACE_ACTIVITY_DIALOG_CONFIGURATION,
  MARKETPLACE_ACTIVITY_DIALOG_PREVIEW,
} from '#src/libs/marketplace/components/@Activity/MarketplaceActivityDialogCSSOnly/custom_css_variant';

import {
  MARKETPLACE_BOOKING_BUTTON_CONFIGURATION,
  MARKETPLACE_BOOKING_BUTTON_PREVIEW,
} from '#src/libs/marketplace/components/@Booking/MarketplaceBookButton/custom_css_variant';

import {
  MARKETPLACE_BOOKING_BLOCKED_CONFIGURATION,
  MARKETPLACE_BOOKING_BLOCKED_PREVIEW,
} from '#src/libs/marketplace/components/@Booking/MarketplaceBookingBlockedReason/custom_css_variant';

import {
  MARKETPLACE_ITEM_QUANTITY_CONFIGURATION,
  MARKETPLACE_ITEM_QUANTITY_PREVIEW,
} from '#src/libs/marketplace/components/@Basket/MarketplaceBasketSummaryItemCssOnly/ItemQuantity/custom_css_variant';

import {
  MARKETPLACE_BASKET_SUMMARY_ITEM_CONFIGURATION,
  MARKETPLACE_BASKET_SUMMARY_ITEM_PREVIEW,
} from '#src/libs/marketplace/components/@Basket/MarketplaceBasketSummaryItemCssOnly/custom_css_variant';

import {
  MARKETPLACE_BASKET_SUMMARY_LIST_ITEM_CONFIGURATION,
  MARKETPLACE_BASKET_SUMMARY_LIST_ITEM_PREVIEW,
} from '#src/libs/marketplace/components/@Basket/MarketplaceBasketSummaryListCssOnly/custom_css_variant';

import {
  MARKETPLACE_BASKET_SUMMARY_CONFIGURATION,
  MARKETPLACE_BASKET_SUMMARY_PREVIEW,
} from '#src/libs/marketplace/components/@Basket/BasketSummaryCssOnly/custom_css_variant';

import {
  MARKETPLACE_BASKET_SUMMARY_DIALOG_CONFIGURATION,
  MARKETPLACE_BASKET_SUMMARY_DIALOG_PREVIEW,
} from '#src/libs/marketplace/components/@Basket/MarketplaceBasketSummaryDialogCssOnly/custom_css_variant';
import {
  MARKETPLACE_PREPAID_LINE_ITEM_CONFIGURATION,
  MARKETPLACE_PREPAID_LINE_ITEM_PREVIEW,
} from '#src/libs/marketplace/components/@Basket/MarketplaceBasketSummaryPrepaidLineItem/custom_css_variant';
import {
  MARKETPLACE_PREPAID_LINE_LIST_CONFIGURATION,
  MARKETPLACE_PREPAID_LINE_LIST_PREVIEW,
} from '#src/libs/marketplace/components/@Basket/MarketplaceBasketSummaryPrepaidLineList/custom_css_variant';
import {
  MARKETPLACE_MINIMAL_APPBAR_CONFIGURATION,
  MARKETPLACE_MINIMAL_APPBAR_PREVIEW,
} from '#src/libs/marketplace/components/@AppBar/MarketplaceAppBar/MinimalMarketplaceAppBarCSSOnly/custom_css_variant';

import {
  FABRIQUE_TYPOGRAPHY_CONFIGURATION,
  FABRIQUE_TYPOGRAPHY_PREVIEW,
} from '#src/components/css-only/Fabrique/Typography/custom_css_variant';
import {
  FABRIQUE_TITLE_CONFIGURATION,
  FABRIQUE_TITLE_PREVIEW,
} from '#src/components/css-only/Fabrique/Title/custom_css_variant';
import {
  FABRIQUE_CARD_CONFIGURATION,
  FABRIQUE_CARD_PREVIEW,
} from '#src/components/css-only/Fabrique/Card/custom_css_variant';
import {
  AUTHENTICATION_RESET_PASSWORD_FORM_CONFIGURATION,
  AUTHENTICATION_RESET_PASSWORD_FORM_PREVIEW,
} from '#src/components/css-only/ResetPasswordForm/custom_css_variant';
import {
  AUTHENTICATION_CHANGE_PASSWORD_FORM_CONFIGURATION,
  AUTHENTICATION_CHANGE_PASSWORD_FORM_PREVIEW,
} from '#src/components/css-only/ChangePasswordForm/custom_css_variant';
import {
  AUTHENTICATION_LOGIN_FORM_CONFIGURATION,
  AUTHENTICATION_LOGIN_FORM_PREVIEW,
} from '#src/components/css-only/LoginForm/custom_css_variant';
import {
  AUTHENTICATION_LOGIN_CONFIGURATION,
  AUTHENTICATION_LOGIN_PREVIEW,
} from '#src/components/css-only/Login/custom_css_variant';
import {
  FABRIQUE_TEXTFIELD_CONFIGURATION,
  FABRIQUE_TEXTFIELD_PREVIEW,
} from '#src/components/css-only/Fabrique/TextFieldV2/custom_css_variant';
import {
  FABRIQUE_LIST_ITEM_CONFIGURATION,
  FABRIQUE_LIST_ITEM_PREVIEW,
} from '#src/components/css-only/Fabrique/ListItem/custom_css_variants';
import {
  FABRIQUE_LIST_CONFIGURATION,
  FABRIQUE_LIST_PREVIEW,
} from '#src/components/css-only/Fabrique/List/custom_css_variants';
import {
  FABRIQUE_BUTTON_CONFIGURATION,
  FABRIQUE_BUTTON_PREVIEW,
} from '#src/components/css-only/Fabrique/ButtonV2/custom_css_variant';
import {
  FABRIQUE_ICON_BUTTON_CONFIGURATION,
  FABRIQUE_ICON_BUTTON_PREVIEW,
} from '#src/components/css-only/Fabrique/IconButton/custom_css_variant';
import {
  FABRIQUE_ACTION_TAB_PREVIEW,
  FABRIQUE_ACTION_TAB_CONFIGURATION,
} from '#src/components/css-only/Fabrique/ActionTab/custom_css_variant';
import {
  FABRIQUE_BLANKET_CONFIGURATION,
  FABRIQUE_BLANKET_PREVIEW,
} from '#src/components/css-only/Fabrique/Blanket/custom_css_variant';
import {
  FABRIQUE_TAB_CONFIGURATION,
  FABRIQUE_TAB_PREVIEW,
} from '#src/components/css-only/Fabrique/Tab/custom_css_variant';
import {
  FABRIQUE_CHIP_CONFIGURATION,
  FABRIQUE_CHIP_PREVIEW,
} from '#src/components/css-only/Fabrique/Chip/custom_css_variant';
import {
  FABRIQUE_ALERT_CONFIGURATION,
  FABRIQUE_ALERT_PREVIEW,
} from '#src/components/css-only/Fabrique/Alert/custom_css_variant';
import {
  FABRIQUE_MODAL_DIALOG_CONFIGURATION,
  FABRIQUE_MODAL_DIALOG_PREVIEW,
} from '#src/components/css-only/Fabrique/ModalDialog/custom_css_variant';

import {
  CSSComponentPreviews,
  MarketplaceCSSComponentConfig,
  MarketplacePage,
} from '#src/libs/exportable-components/types';

import {
  FABRIQUE_BADGE_PREVIEW,
  FABRIQUE_BADGE_CONFIGURATION,
} from '#src/components/css-only/Fabrique/Badge/custom_css_variant';

import {
  MARKETPLACE_SPOT_SELECTOR_CONFIGURATION,
  MARKETPLACE_SPOT_SELECTOR_PREVIEW,
} from '#src/libs/marketplace/components/@SpotScheduling/MarketplaceSpotSelector/custom_css_variant';

import {
  FABRIQUE_RADIOBUTTON_CONFIGURATION,
  FABRIQUE_RADIOBUTTON_PREVIEW,
} from '#src/components/css-only/Fabrique/RadioButtonV2/custom_css_variants';

import {
  BOOKER_MODULE_BUYABLE_ITEMS_LIST_CONFIGURATION,
  BOOKER_MODULE_BUYABLE_ITEMS_LIST_PREVIEW,
} from '#src/libs/marketplace/components/@BuyableItem/MarketplaceBookerModuleBuyableItems/custom_css_variant';

import {
  BOOKER_MODULE_BUYABLE_ITEM_PAYMENT_COMBO_CONFIGURATION,
  BOOKER_MODULE_BUYABLE_ITEM_PAYMENT_COMBO_PREVIEW,
} from '#src/libs/marketplace/components/@BuyableItem/MarketplacePaymentComboBuyableItem/custom_css_variant';

import {
  BOOKER_MODULE_BUYABLE_ITEM_PAYMENT_PACK_CONFIGURATION,
  BOOKER_MODULE_BUYABLE_ITEM_PAYMENT_PACK_PREVIEW,
} from '#src/libs/marketplace/components/@BuyableItem/MarketplacePaymentPackBuyableItem/custom_css_variant';

import {
  BOOKER_MODULE_BUYABLE_ITEM_CONTRACT_CONFIGURATION,
  BOOKER_MODULE_BUYABLE_ITEM_CONTRACT_PREVIEW,
} from '#src/libs/marketplace/components/@Subscription/MarketplaceContractBuyableItem/custom_css_variant';

import {
  CONFIRMATION_CHECKOUT_MESSAGE_CONFIGURATION,
  CONFIRMATION_CHECKOUT_MESSAGE_PREVIEW,
} from '#src/libs/checkout/components/ConfirmationMessage/custom_css_variant';
import {
  ALERT_CONFIGURATION,
  ALERT_PREVIEW,
} from '#src/components/css-only/Alert/custom_css_variant';

import {
  MESSAGE_WITH_ICON_CONFIGURATION,
  MESSAGE_WITH_ICON_PREVIEW,
} from '#src/components/css-only/StatusMessageWithIcon/custom_css_variant';

import {
  FABRIQUE_CHECKBOX_PREVIEW,
  FABRIQUE_CHECKBOX_CONFIGURATION,
} from '#src/components/css-only/Fabrique/Checkbox/custom_css_variant';
import {
  FABRIQUE_TEXTFORM_PREVIEW,
  FABRIQUE_TEXTFORM_CONFIGURATION,
} from '#Fabrique/TextForm/custom_css_variant';
import {
  MINIMAL_SUBSCRIPTION_CARD_PREVIEW,
  MINIMAL_SUBSCRIPTION_CARD_CONFIGURATION,
} from '#src/libs/marketplace/components/@Subscription/MinimalSubscriptionCard/custom_css_variant';

import {
  MARKETPLACE_PRODUCT_ITEM_CONFIGURATION,
  MARKETPLACE_PRODUCT_ITEM_PREVIEW,
} from '#src/libs/marketplace/components/@CheckoutItem/MarketplaceProductItem/custom_css_variant';

import {
  MARKETPLACE_PRODUCT_ITEM_LIST_CONFIGURATION,
  MARKETPLACE_PRODUCT_ITEM_LIST_PREVIEW,
} from '#src/libs/marketplace/components/@CheckoutItem/MarketplaceProductItemList/custom_css_variant';

import {
  MINIMAL_PRIVATE_PASS_CARD_CONFIGURATION,
  MINIMAL_PRIVATE_PASS_CARD_PREVIEW,
} from '#src/libs/marketplace/components/@PrivatePass/MinimalPrivatePassCard/custom_css_variant';

import {
  MARKETPLACE_CHECKOUT_ITEMS_PRIVATE_PASS_LIST_CONFIGURATION,
  MARKETPLACE_CHECKOUT_ITEMS_PRIVATE_PASS_LIST_PREVIEW,
} from '#src/libs/marketplace/components/@CheckoutItem/MarketplaceCheckoutItemsWithPrivatePassList/custom_css_variant';

import {
  MINIMAL_PAYMENT_COMBO_CARD_CONFIGURATION,
  MINIMAL_PAYMENT_COMBO_CARD_CARD_PREVIEW,
} from '#src/libs/marketplace/components/@PaymentCombo/MinimalPaymentComboCard/custom_css_variant';

import {
  MARKETPLACE_CHECKOUT_ITEMS_PAYMENT_COMBO_LIST_CONFIGURATION,
  MARKETPLACE_CHECKOUT_ITEMS_PAYMENT_COMBO_LIST_PREVIEW,
} from '#src/libs/marketplace/components/@CheckoutItem/MarketplaceCheckoutItemsWithPaymentComboList/custom_css_variant';

import {
  MARKETPLACE_CHECKOUT_ITEMS_PAYMENT_PACK_LIST_CONFIGURATION,
  MARKETPLACE_CHECKOUT_ITEMS_PAYMENT_PACK_LIST_LIST_PREVIEW,
} from '#src/libs/marketplace/components/@CheckoutItem/MarketplaceCheckoutItemsWithPaymentPackList/custom_css_variant';

import {
  MINIMAL_PAYMENT_PACK_CARD_CONFIGURATION,
  MINIMAL_PAYMENT_PACK_CARD_PREVIEW,
} from '#src/libs/marketplace/components/@PaymentPack/MinimalPaymentPackCard/custom_css_variant';

import {
  MARKETPLACE_BOOKING_ITEM_CONFIGURATION,
  MARKETPLACE_BOOKING_ITEM_PREVIEW,
} from '#src/libs/marketplace/components/@Booking/MarketplaceBookingItem/custom_css_variant';

import {
  MARKETPLACE_OFFER_BOOKING_LIST_CONFIGURATION,
  MARKETPLACE_OFFER_BOOKING_LIST_PREVIEW,
} from '#src/libs/marketplace/components/@Booking/MarketplaceOfferBookingList/custom_css_variant';

import {
  FABRIQUE_MENU_ITEM_PREVIEW,
  FABRIQUE_MENU_ITEM_CONFIGURATION,
} from '#src/components/css-only/Fabrique/MenuItem/custom_css_variant';

import {
  FABRIQUE_MENU_ITEM_LIST_CONFIGURATION,
  FABRIQUE_MENU_ITEM_LIST_PREVIEW,
} from '#src/components/css-only/Fabrique/MenuItemList/custom_css_variant';

import {
  FABRIQUE_MENU_CONFIGURATION,
  FABRIQUE_MENU_PREVIEW,
} from '#src/components/css-only/Fabrique/Menu/custom_css_variant';

import {
  FABRIQUE_BOTTOM_DRAWER_CONFIGURATION,
  FABRIQUE_BOTTOM_DRAWER_PREVIEW,
} from '#src/components/css-only/Fabrique/BottomDrawer/custom_css_variant';

import {
  FABRIQUE_SELECTOR_CONFIGURATION,
  FABRIQUE_SELECTOR_PREVIEW,
} from '#Fabrique/Selector/custom_css_variant';

import {
  FABRIQUE_SELECTOR_INPUT_CONFIGURATION,
  FABRIQUE_SELECTOR_INPUT_PREVIEW,
} from '#Fabrique/Selector/SelectorInput/custom_css_variant';

import {
  MARKETING_NEWSLETTER_FORM_V2_CONFIGURATION,
  MARKETING_NEWSLETTER_FORM_V2_PREVIEW,
} from '#src/components/css-only/NewsletterFormV2/custom_css_variant';

import {
  AUTHENTICATION_TEXTFIELD_CONFIGURATION,
  AUTHENTICATION_TEXTFIELD_PREVIEW,
} from '#src/components/css-only/Fabrique/TextField/custom_css_variant';

import {
  CONSUMER_BOOKING_CARD_PREVIEW,
  CONSUMER_BOOKING_CARD_CONFIGURATION,
} from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingCard/custom_css_variants';

import {
  CONSUMER_BOOKING_DETAILS_CARD_CONFIGURATION,
  CONSUMER_BOOKING_DETAILS_CARD_PREVIEW,
} from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingDetailsCard/custom_css_variant';

import {
  CONSUMER_PASS_CARD_PREVIEW,
  CONSUMER_PASS_CARD_CONFIGURATION,
} from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPassCard/custom_css_variants';
import {
  PRIVATE_CONSUMER_PASS_DETAILS_CARD_PREVIEW,
  PRIVATE_CONSUMER_PASS_DETAILS_CARD_CONFIGURATION,
} from '#src/libs/consumer-space/components/reworked/@MyPasses/PrivateConsumerPass/PrivateConsumerPassDetailsCard/custom_css_variants';
import {
  CONSUMER_PAYMENT_PACK_DETAILS_CARD_PREVIEW,
  CONSUMER_PAYMENT_PACK_DETAILS_CARD_CONFIGURATION,
} from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPaymentPack/ConsumerPaymentPackDetailsCard/custom_css_variants';
import {
  UNIVERSAL_PASS_DETAILS_CARD_PREVIEW,
  UNIVERSAL_PASS_DETAILS_CARD_CONFIGURATION,
} from '#src/libs/consumer-space/components/reworked/@MyPasses/UniversalPass/UniversalPassDetailsCard/custom_css_variants';

import {
  RESET_PASSWORD_CONFIRMATION_CONFIGURATION,
  RESET_PASSWORD_CONFIRMATION_PREVIEW,
} from '#src/libs/login/components/ResetPasswordConfirmation/custom_css_variant';
import {
  REFERRAL_DETAILS_CONFIGURATION,
  REFERRAL_DETAILS_PREVIEW,
} from '#src/libs/referral/components/ReferralLinkAndTerms/custom_css_variant';
import {
  FABRIQUE_BIGICON_CONFIGURATION,
  FABRIQUE_BIGICON_PREVIEW,
} from '#src/components/css-only/Fabrique/BigIcon/custom_css_variant';
import {
  CONSUMER_SUBSCRIPTION_CARD_CONFIGURATION,
  CONSUMER_SUBSCRIPTION_CARD_PREVIEW,
} from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionCard/custom_css_variant';
import {
  CONSUMER_SUBSCRIPTION_DETAILS_CARD_CONFIGURATION,
  CONSUMER_SUBSCRIPTION_DETAILS_CARD_PREVIEW,
} from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionDetailsCard/custom_css_variant';
import {
  CONSUMER_INVOICE_DETAILS_CARD_CONFIGURATION,
  CONSUMER_INVOICE_DETAILS_CARD_PREVIEW,
} from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceDetailsCard/custom_css_variants';
import {
  CONSUMER_INVOICE_CARD_CONFIGURATION,
  CONSUMER_INVOICE_CARD_PREVIEW,
} from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceCard/custom_css_variants';
import {
  CONSUMER_TERMS_AND_CONDITIONS_CARD_CONFIGURATION,
  CONSUMER_TERMS_AND_CONDITIONS_CARD_PREVIEW,
} from '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileCards/TermsAndConditionsCard/custom_css_variant';
import {
  CONSUMER_SAVED_PAYMENT_METHODS_CARD_CONFIGURATION,
  CONSUMER_SAVED_PAYMENT_METHODS_CARD_PREVIEW,
} from '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileCards/SavedPaymentMethodCard/custom_css_variant';

import {
  CONSUMER_SUMMARY_CARD_CONFIGURATION,
  CONSUMER_SUMMARY_CARD_PREVIEW,
} from '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileCards/ConsumerSummaryCard/custom_css_variant';
import {
  FABRIQUE_TOOLTIP_PREVIEW,
  FABRIQUE_TOOLTIP_CONFIGURATION,
} from '#src/components/css-only/Fabrique/Tooltipv2/custom_css_variant';
import {
  AUTHENTICATION_DISCONNECTED_STATUS_CONFIGURATION,
  AUTHENTICATION_DISCONNECTED_STATUS_PREVIEW,
} from '#src/libs/login/components/DisconnectedStatus/custom_css_variant';
import {
  FABRIQUE_SUBMENU_PREVIEW,
  FABRIQUE_SUBMENU_CONFIGURATION,
} from '#src/components/css-only/Fabrique/Submenu/custom_css_variant';
import {
  FABRIQUE_PAGINATION_PREVIEW,
  FABRIQUE_PAGINATION_CONFIGURATION,
} from '#src/components/css-only/Fabrique/Pagination/custom_css_variant';

import {
  REFERRAL_CARD_CONFIGURATION,
  REFERRAL_CARD_PREVIEW,
} from '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileCards/ReferralCard/custom_css_variant';

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
  AUTHENTICATION_RESET_PASSWORD_FORM_CONFIGURATION,
  AUTHENTICATION_CHANGE_PASSWORD_FORM_CONFIGURATION,
  AUTHENTICATION_LOGIN_FORM_CONFIGURATION,
  AUTHENTICATION_LOGIN_CONFIGURATION,
  AUTHENTICATION_TEXTFIELD_CONFIGURATION,
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
  MARKETPLACE_MINIMAL_APPBAR_CONFIGURATION,
  MARKETPLACE_BOOKER_MODULE_OFFER_SUMMARY_CONFIGURATION,
  MARKETPLACE_SPOT_SELECTOR_CONFIGURATION,
  BOOKER_MODULE_BUYABLE_ITEMS_LIST_CONFIGURATION,
  BOOKER_MODULE_BUYABLE_ITEM_PAYMENT_COMBO_CONFIGURATION,
  BOOKER_MODULE_BUYABLE_ITEM_PAYMENT_PACK_CONFIGURATION,
  BOOKER_MODULE_BUYABLE_ITEM_CONTRACT_CONFIGURATION,
  CONFIRMATION_CHECKOUT_MESSAGE_CONFIGURATION,
  ALERT_CONFIGURATION,
  MESSAGE_WITH_ICON_CONFIGURATION,
  MINIMAL_SUBSCRIPTION_CARD_CONFIGURATION,
  MARKETPLACE_PRODUCT_ITEM_CONFIGURATION,
  MARKETPLACE_PRODUCT_ITEM_LIST_CONFIGURATION,
  MINIMAL_PRIVATE_PASS_CARD_CONFIGURATION,
  MARKETPLACE_CHECKOUT_ITEMS_PRIVATE_PASS_LIST_CONFIGURATION,
  MINIMAL_PAYMENT_COMBO_CARD_CONFIGURATION,
  MARKETPLACE_CHECKOUT_ITEMS_PAYMENT_COMBO_LIST_CONFIGURATION,
  MARKETPLACE_CHECKOUT_ITEMS_PAYMENT_PACK_LIST_CONFIGURATION,
  MINIMAL_PAYMENT_PACK_CARD_CONFIGURATION,
  MARKETPLACE_BOOKING_ITEM_CONFIGURATION,
  MARKETPLACE_OFFER_BOOKING_LIST_CONFIGURATION,
  MARKETING_NEWSLETTER_FORM_V2_CONFIGURATION,
  RESET_PASSWORD_CONFIRMATION_CONFIGURATION,
  AUTHENTICATION_DISCONNECTED_STATUS_CONFIGURATION,
  REFERRAL_DETAILS_CONFIGURATION,

  FABRIQUE_TYPOGRAPHY_CONFIGURATION,
  FABRIQUE_TITLE_CONFIGURATION,
  FABRIQUE_CARD_CONFIGURATION,
  FABRIQUE_BADGE_CONFIGURATION,
  FABRIQUE_BUTTON_CONFIGURATION,
  FABRIQUE_ICON_BUTTON_CONFIGURATION,
  FABRIQUE_ACTION_TAB_CONFIGURATION,
  FABRIQUE_BLANKET_CONFIGURATION,
  FABRIQUE_TAB_CONFIGURATION,
  FABRIQUE_TEXTFIELD_CONFIGURATION,
  FABRIQUE_LIST_ITEM_CONFIGURATION,
  FABRIQUE_LIST_CONFIGURATION,
  FABRIQUE_RADIOBUTTON_CONFIGURATION,
  FABRIQUE_CHECKBOX_CONFIGURATION,
  FABRIQUE_CHIP_CONFIGURATION,
  FABRIQUE_ALERT_CONFIGURATION,
  FABRIQUE_MENU_ITEM_CONFIGURATION,
  FABRIQUE_MENU_ITEM_LIST_CONFIGURATION,
  FABRIQUE_MENU_CONFIGURATION,
  FABRIQUE_MODAL_DIALOG_CONFIGURATION,
  FABRIQUE_BOTTOM_DRAWER_CONFIGURATION,
  FABRIQUE_TEXTFORM_CONFIGURATION,
  FABRIQUE_SELECTOR_CONFIGURATION,
  FABRIQUE_SELECTOR_INPUT_CONFIGURATION,
  FABRIQUE_BIGICON_CONFIGURATION,
  FABRIQUE_TOOLTIP_CONFIGURATION,
  FABRIQUE_SUBMENU_CONFIGURATION,
  FABRIQUE_PAGINATION_CONFIGURATION,
  CONSUMER_BOOKING_CARD_CONFIGURATION,
  CONSUMER_BOOKING_DETAILS_CARD_CONFIGURATION,
  CONSUMER_PASS_CARD_CONFIGURATION,
  PRIVATE_CONSUMER_PASS_DETAILS_CARD_CONFIGURATION,
  CONSUMER_PAYMENT_PACK_DETAILS_CARD_CONFIGURATION,
  UNIVERSAL_PASS_DETAILS_CARD_CONFIGURATION,
  CONSUMER_SUBSCRIPTION_CARD_CONFIGURATION,
  CONSUMER_SUBSCRIPTION_DETAILS_CARD_CONFIGURATION,
  CONSUMER_INVOICE_CARD_CONFIGURATION,
  CONSUMER_INVOICE_DETAILS_CARD_CONFIGURATION,
  CONSUMER_TERMS_AND_CONDITIONS_CARD_CONFIGURATION,
  CONSUMER_SAVED_PAYMENT_METHODS_CARD_CONFIGURATION,
  CONSUMER_SUMMARY_CARD_CONFIGURATION,
  REFERRAL_CARD_CONFIGURATION,
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
    [CssComponentsVariantIdentifiers.AUTHENTICATION_RESET_PASSWORD_FORM]:
      AUTHENTICATION_RESET_PASSWORD_FORM_PREVIEW,
    [CssComponentsVariantIdentifiers.AUTHENTICATION_CHANGE_PASSWORD_FORM]:
      AUTHENTICATION_CHANGE_PASSWORD_FORM_PREVIEW,
    [CssComponentsVariantIdentifiers.AUTHENTICATION_LOGIN_FORM]:
      AUTHENTICATION_LOGIN_FORM_PREVIEW,
    [CssComponentsVariantIdentifiers.AUTHENTICATION_LOGIN]:
      AUTHENTICATION_LOGIN_PREVIEW,
    [CssComponentsVariantIdentifiers.AUTHENTICATION_TEXTFIELD]:
      AUTHENTICATION_TEXTFIELD_PREVIEW,
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
    [CssComponentsVariantIdentifiers.MARKETPLACE_MINIMAL_APPBAR]:
      MARKETPLACE_MINIMAL_APPBAR_PREVIEW,
    [CssComponentsVariantIdentifiers.BOOKER_MODULE_OFFER_SUMMARY]:
      MARKETPLACE_BOOKER_MODULE_OFFER_SUMMARY_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_SPOT_SELECTOR]:
      MARKETPLACE_SPOT_SELECTOR_PREVIEW,
    [CssComponentsVariantIdentifiers.BOOKER_MODULE_BUYABLE_ITEMS_LIST]:
      BOOKER_MODULE_BUYABLE_ITEMS_LIST_PREVIEW,
    [CssComponentsVariantIdentifiers.BOOKER_MODULE_BUYABLE_ITEM_PAYMENT_COMBO]:
      BOOKER_MODULE_BUYABLE_ITEM_PAYMENT_COMBO_PREVIEW,
    [CssComponentsVariantIdentifiers.BOOKER_MODULE_BUYABLE_ITEM_PAYMENT_PACK]:
      BOOKER_MODULE_BUYABLE_ITEM_PAYMENT_PACK_PREVIEW,
    [CssComponentsVariantIdentifiers.BOOKER_MODULE_BUYABLE_ITEM_CONTRACT]:
      BOOKER_MODULE_BUYABLE_ITEM_CONTRACT_PREVIEW,
    [CssComponentsVariantIdentifiers.CONFIRMATION_CHECKOUT_MESSAGE]:
      CONFIRMATION_CHECKOUT_MESSAGE_PREVIEW,
    [CssComponentsVariantIdentifiers.ALERT]: ALERT_PREVIEW,
    [CssComponentsVariantIdentifiers.MESSAGE_WITHOUT_ICON]:
      MESSAGE_WITH_ICON_PREVIEW,
    [CssComponentsVariantIdentifiers.MINIMAL_SUBSCRIPTION_CARD]:
      MINIMAL_SUBSCRIPTION_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_PRODUCT_ITEM_LIST]:
      MARKETPLACE_PRODUCT_ITEM_LIST_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_PRODUCT_ITEM]:
      MARKETPLACE_PRODUCT_ITEM_PREVIEW,
    [CssComponentsVariantIdentifiers.MINIMAL_PRIVATE_PASS_CARD]:
      MINIMAL_PRIVATE_PASS_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_CHECKOUT_ITEMS_PRIVATE_PASS_LIST]:
      MARKETPLACE_CHECKOUT_ITEMS_PRIVATE_PASS_LIST_PREVIEW,
    [CssComponentsVariantIdentifiers.MINIMAL_PAYMENT_COMBO_CARD]:
      MINIMAL_PAYMENT_COMBO_CARD_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.MINIMAL_PAYMENT_PACK_CARD]:
      MINIMAL_PAYMENT_PACK_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_CHECKOUT_ITEMS_PAYMENT_COMBO_LIST]:
      MARKETPLACE_CHECKOUT_ITEMS_PAYMENT_COMBO_LIST_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_CHECKOUT_ITEMS_PAYMENT_PACK_LIST]:
      MARKETPLACE_CHECKOUT_ITEMS_PAYMENT_PACK_LIST_LIST_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_BOOKING_ITEM]:
      MARKETPLACE_BOOKING_ITEM_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETPLACE_OFFER_BOOKING_LIST]:
      MARKETPLACE_OFFER_BOOKING_LIST_PREVIEW,
    [CssComponentsVariantIdentifiers.MARKETING_NEWSLETTER_FORM_V2]:
      MARKETING_NEWSLETTER_FORM_V2_PREVIEW,
    [CssComponentsVariantIdentifiers.RESET_PASSWORD_CONFIRMATION]:
      RESET_PASSWORD_CONFIRMATION_PREVIEW,
    [CssComponentsVariantIdentifiers.AUTHENTICATION_DISCONNECTED_STATUS]:
      AUTHENTICATION_DISCONNECTED_STATUS_PREVIEW,
    [CssComponentsVariantIdentifiers.REFERRAL_DETAILS]:
      REFERRAL_DETAILS_PREVIEW,

    [CssComponentsVariantIdentifiers.FABRIQUE_TYPOGRAPHY]:
      FABRIQUE_TYPOGRAPHY_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_TITLE]: FABRIQUE_TITLE_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_CARD]: FABRIQUE_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_BADGE]: FABRIQUE_BADGE_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_TEXTFIELD]:
      FABRIQUE_TEXTFIELD_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_LIST_ITEM]:
      FABRIQUE_LIST_ITEM_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_LIST]: FABRIQUE_LIST_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_BUTTON]: FABRIQUE_BUTTON_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_ICON_BUTTON]:
      FABRIQUE_ICON_BUTTON_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_ACTION_TAB]:
      FABRIQUE_ACTION_TAB_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_BLANKET]:
      FABRIQUE_BLANKET_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_TAB]: FABRIQUE_TAB_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_RADIOBUTTON]:
      FABRIQUE_RADIOBUTTON_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_CHECKBOX]:
      FABRIQUE_CHECKBOX_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_CHIP]: FABRIQUE_CHIP_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_ALERT]: FABRIQUE_ALERT_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_MENU_ITEM]:
      FABRIQUE_MENU_ITEM_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_MENU_ITEM_LIST]:
      FABRIQUE_MENU_ITEM_LIST_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_MENU]: FABRIQUE_MENU_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_MODAL_DIALOG]:
      FABRIQUE_MODAL_DIALOG_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_BOTTOM_DRAWER]:
      FABRIQUE_BOTTOM_DRAWER_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_TEXTFORM]:
      FABRIQUE_TEXTFORM_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_TOOLTIP]:
      FABRIQUE_TOOLTIP_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_SUBMENU]:
      FABRIQUE_SUBMENU_PREVIEW,
    [CssComponentsVariantIdentifiers.SELECTOR]: FABRIQUE_SELECTOR_PREVIEW,
    [CssComponentsVariantIdentifiers.SELECTOR_INPUT]:
      FABRIQUE_SELECTOR_INPUT_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_BIGICON]:
      FABRIQUE_BIGICON_PREVIEW,
    [CssComponentsVariantIdentifiers.FABRIQUE_PAGINATION]:
      FABRIQUE_PAGINATION_PREVIEW,
    [CssComponentsVariantIdentifiers.CONSUMER_BOOKING_CARD]:
      CONSUMER_BOOKING_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.CONSUMER_BOOKING_DETAILS_CARD]:
      CONSUMER_BOOKING_DETAILS_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.CONSUMER_PASS_CARD]:
      CONSUMER_PASS_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.CONSUMER_PAYMENT_PACK_DETAILS_CARD]:
      CONSUMER_PAYMENT_PACK_DETAILS_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.PRIVATE_CONSUMER_PASS_DETAILS_CARD]:
      PRIVATE_CONSUMER_PASS_DETAILS_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.UNIVERSAL_PASS_DETAILS_CARD]:
      UNIVERSAL_PASS_DETAILS_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.CONSUMER_SUBSCRIPTION_CARD]:
      CONSUMER_SUBSCRIPTION_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.CONSUMER_SUBSCRIPTION_DETAILS_CARD]:
      CONSUMER_SUBSCRIPTION_DETAILS_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.CONSUMER_INVOICE_DETAILS_CARD]:
      CONSUMER_INVOICE_DETAILS_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.CONSUMER_INVOICE_CARD]:
      CONSUMER_INVOICE_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.CONSUMER_TERMS_AND_CONDITIONS]:
      CONSUMER_TERMS_AND_CONDITIONS_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.CONSUMER_SAVED_PAYMENT_METHODS_CARD]:
      CONSUMER_SAVED_PAYMENT_METHODS_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.CONSUMER_SUMMARY_CARD]:
      CONSUMER_SUMMARY_CARD_PREVIEW,
    [CssComponentsVariantIdentifiers.CONSUMER_REFERRAL_CARD]:
      REFERRAL_CARD_PREVIEW,
  });

export const CSS_COMPONENT_PAGES: Immutable.Immutable<MarketplacePage[]> =
  Immutable(Array.from(new Set(CSS_COMPONENTS.flatMap((c) => c.pages))));
