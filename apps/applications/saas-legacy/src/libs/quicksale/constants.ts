import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items.js';

import { PAYMENT_STRIPE_TERMINAL_FAKE } from '#src/libs/payment/utils';

export enum QuicksaleItemColor {
  Gray = '#E4E4E4',
  Orange = '#F5CFBB',
  Pink = '#FBD3E4',
  Red = '#F19090',
  Purple = '#D4CAFD',
  Green = '#99D8B9',
  Blue = '#C1DCF4',
  Yellow = '#FAEDA9',
  LightGreen = '#C8E7B6',
  Black = '#666666',
}

export enum QuicksaleSectionColor {
  Gray = '#AEAEAE',
  Orange = '#FE7434',
  Pink = '#F071AE',
  Red = '#E11313',
  Purple = '#4C3DA8',
  Green = '#209D82',
  Blue = '#85C2DB',
  Yellow = '#F4D323',
  LightGreen = '#71B549',
  Black = '#202020',
}

export enum QuicksaleItemCardStyle {
  minWidth = '180px',
  minHeight = '100px',
  aspectRatio = '1.8',
}

export enum QuicksaleSectionCardStyle {
  minWidth = '180px',
  minHeight = '100px',
  aspectRatio = '1.8',
  darkHoverBackground = 'rgba(0, 0, 0, 0.15)',
  darkActiveBackground = 'rgba(0, 0, 0, 0.2)',
  lightHoverBackground = 'rgba(255, 255, 255, 0.15)',
  lightActiveBackground = 'rgba(255, 255, 255, 0.2)',
}

export enum EditableQuicksaleSectionKey {
  name = 'section_name',
  icon = 'section_icon',
  color = 'section_color',
}

export const DEFAULT_SECTION_ICON = 'Category';

export const NO_RESULT_ALERT_BACKGROUND_COLOR = 'rgba(8, 22, 45, 0.1)';

export enum QuicksaleInterfaceModalColors {
  Warning = '#FF9800',
  Error = '#F44336',
  Info = '#2196F3',
  Success = '#4CAF50',
}

export enum QuicksaleDeliveryType {
  OnSpot = 'on_spot',
  HomeDelivery = 'home_delivery',
}

// (Quicksale MVP): CreditCard and Sepa payment methods disabled
export enum QuicksalePaymentMethod {
  StripeTerminal = PAYMENT_STRIPE_TERMINAL_FAKE,
  Manual = -1,
  /*CreditCard = PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  Sepa = PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,*/
}

export const WARNING_FONT_COLOR = '#663D00';

/**
 * @description This list contains all the object types of the buyable items that need
 * a member authentication to be bought. The subscriptions are not included here since
 * this list is used in the checkout page and the subscriptions are handled before
 * reaching this page
 */
export const QUICKSALE_ITEMS_REQUIRING_AUTHENTICATION = [
  QuicksaleBasketItem.PaymentPackIdentifier,
  QuicksaleBasketItem.PrivatePassIdentifier,
  QuicksaleBasketItem.PaymentComboIdentifier,
];

// (Quicksale MVP): CreditCard and Sepa payment methods disabled
export const PAYMENT_METHODS_COMPATIBLE_WITH_INSTALMENT_PAYMENT: QuicksalePaymentMethod[] =
  [
    /*QuicksalePaymentMethod.CreditCard,
  QuicksalePaymentMethod.Sepa,*/
  ];
