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
export enum CssComponentsVariantIdentifiers {
  AUTHENTICATION_RESET_PASSWORD_FORM = 'authentication_reset_password_form',
  AUTHENTICATION_LOGIN_FORM = 'authentication_login_form',
  AUTHENTICATION_LOGIN = 'authentication_login',
  MARKETPLACE_ACTIVITY = 'marketplace_activity_summary',
  MARKETPLACE_ACTIVITY_DIALOG = 'marketplace_activity_summary_dialog',
  MARKETPLACE_BOOKING_BLOCKED = 'marketplace_booking_blocked_reason',
  MARKETPLACE_BOOKING_BUTTON = 'marketplace_booking_button',
  MARKETPLACE_CALENDAR_FILTER = 'marketplace_calendar_filter',
  MARKETPLACE_COLLECT_PAYMENT_METHOD = 'marketplace_collect_payment_method',
  MARKETPLACE_CONTRACT_CARD = 'marketplace_contract_card',
  MARKETPLACE_CONTRACT_CHECKOUT = 'marketplace_contract_checkout',
  MARKETPLACE_CONTRACT_COOLDOWN_MODAL = 'marketplace_contract_cooldown_modal',
  MARKETPLACE_CONTRACT_COUPON_FORM_MODAL = 'marketplace_coupon_form_modal',
  MARKETPLACE_CONTRACT_DETAIL = 'marketplace_contract_detail',
  MARKETPLACE_CONTRACT_DETAIL_MODAL = 'marketplace_contract_detail_modal',
  MARKETPLACE_CONTRACT_NOT_FOUND = 'marketplace_contract_not_found_modal',
  MARKETPLACE_CONTRACT_PAYMENT = 'marketplace_contract_payment',
  MARKETPLACE_CONTRACT_TERMS_MODAL = 'marketplace_contract_terms_modal',
  MARKETPLACE_DATE_PICKER = 'marketplace_date_picker',
  MARKETPLACE_FILTER = 'marketplace_filter',
  MARKETPLACE_OFFER_CARD = 'marketplace_offer_card',
  MARKETPLACE_OFFER_LIST_ITEM = 'marketplace_offer_list_item',
  MARKETPLACE_PAYMENT_COMBO_CARD = 'marketplace_payment_combo_card',
  MARKETPLACE_PAYMENT_PACK_CARD = 'marketplace_payment_pack_card',
  MARKETPLACE_PAYMENT_PACK_COMPATIBILITY_MODAL = 'marketplace_payment_pack_compatibility_modal',
  MARKETPLACE_PAYMENT_PACK_OFFPEAK_RESTRICTION_MODAL = 'marketplace_payment_pack_offpeack_restriction_modal',
  MARKETPLACE_PAYMENT_PACK_RESTRICTION_MODAL = 'marketplace_payment_pack_restriction_modal',
  MARKETPLACE_PRIVATE_PASS_CARD = 'marketplace_private_pass_card',
  MARKETPLACE_PRIVATE_PASS_COMPATIBILITY_MODAL = 'marketplace_private_pass_compatibility_modal',
  MARKETPLACE_SEARCH = 'marketplace_search',
  MARKETPLACE_SELECT = 'marketplace_select',
  MARKETPLACE_WEEK_TIME_TABLE = 'marketplace_week_time_table',
  MARKETPLACE_ITEM_QUANTITY = 'marketplace_item_quantity',
  MARKETPLACE_BASKET_SUMMARY_ITEM_PREVIEW = 'marketplace_basket_summary_item',
  MARKETPLACE_BASKET_SUMMARY_LIST_ITEM_PREVIEW = 'marketplace_basket_summary_list_item',
  MARKETPLACE_BASKET_SUMMARY_PREVIEW = 'marketplace_basket_summary',
  MARKETPLACE_BASKET_SUMMARY_DIALOG_PREVIEW = 'marketplace_basket_summary_dialog',
  MARKETPLACE_PREPAID_LINE_ITEM = 'marketplace_prepaid_line_item',
  MARKETPLACE_PREPAID_LINE_LIST = 'marketplace_prepaid_line_list',
  BOOKER_MODULE_OFFER_SUMMARY = 'booker_module_offer_summary',
  MARKETPLACE_MINIMAL_APPBAR = 'marketplace_minimal_appbar',
  MARKETPLACE_SPOT_SELECTOR = 'marketplace_spot_selector',
  BOOKER_MODULE_BUYABLE_ITEMS_LIST = 'marketplace_booker_module_buyable_items_list',
  BOOKER_MODULE_BUYABLE_ITEM_PAYMENT_COMBO = 'marketplace_booker_module_buyable_item_payment_combo',
  BOOKER_MODULE_BUYABLE_ITEM_PAYMENT_PACK = 'marketplace_booker_module_buyable_item_payment_pack',
  BOOKER_MODULE_BUYABLE_ITEM_CONTRACT = 'marketplace_booker_module_buyable_item_contract',
  CONFIRMATION_CHECKOUT_MESSAGE = 'marketplace_confirmation_checkout_message',
  ALERT = 'alert',
  FABRIQUE_TYPOGRAPHY = 'fabrique_typography',
  FABRIQUE_CARD = 'fabrique_card',
  FABRIQUE_BADGE = 'fabrique_badge',
  FABRIQUE_TEXTFIELD = 'fabrique_textfield',
  FABRIQUE_BUTTON = 'fabrique_button',
  FABRIQUE_ICON_BUTTON = 'fabrique_icon_button',
  FABRIQUE_ACTION_TAB = 'fabrique_action_tab',
  FABRIQUE_BLANKET = 'fabrique_blanket',
  FABRIQUE_TAB = 'fabrique_tab',
  FABRIQUE_RADIOBUTTON = 'fabrique_radiobutton',
}
