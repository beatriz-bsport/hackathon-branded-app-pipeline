import {
  UPSELL_IDENTIFIER_QUICKSALE,
  UPSELL_IDENTIFIER_CADENCE,
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
];
