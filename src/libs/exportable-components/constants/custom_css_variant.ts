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
}
