import {
  UPSELL_IDENTIFIER_ACCESS_MONITORING,
  UPSELL_IDENTIFIER_CADENCE,
  UPSELL_IDENTIFIER_QUICKBOOKS,
  UPSELL_IDENTIFIER_QUICKSALE,
  UPSELL_IDENTIFIER_VOD,
  UPSELL_IDENTIFIER_WHEREBY,
} from '#libs/platform-billing/upsell-identifiers';

export const BLOCK_BACKOFFICE = 3;
export const WARN = 2;
export const DO_NOTHING = 1;

export const FAILED_PAYMENT = 0;
export const DISPUTED_PAYMENT = 1;

/**
 * @description These identifiers represent beta upsells, which may include features or services
 * that are in the beta testing phase and should not be visible in the 'available add-ons' section.
 */
export const BETA_UPSELL_IDS = [
  UPSELL_IDENTIFIER_QUICKSALE,
  UPSELL_IDENTIFIER_CADENCE,
  UPSELL_IDENTIFIER_ACCESS_MONITORING,
];

/**
 * @description These identifiers represent upsells that have been available to customers in the past,
 * but should no longer be available for purchase anymore.
 */
export const UNSUBSCRIBABLE_UPSELL_IDS = [
  UPSELL_IDENTIFIER_VOD,
  UPSELL_IDENTIFIER_WHEREBY,
  UPSELL_IDENTIFIER_QUICKBOOKS,
];

export const BLOCKER_FRAME_ID = 'blocker-frame';
