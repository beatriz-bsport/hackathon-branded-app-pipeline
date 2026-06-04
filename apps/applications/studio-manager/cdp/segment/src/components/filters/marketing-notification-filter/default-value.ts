import { COMBINE_MODE_OPTIONS, CONSENT_OPTIONS } from "./constants";
import type { MarketingNotificationFilterFormValue } from "./types";

/**
 * Returns the default UI state for a brand-new marketing notification filter card.
 *
 * @param smartlistId - Identifier of the smartlist this filter belongs to.
 */
export const createDefaultMarketingNotificationFilter = (
  smartlistId: number,
): MarketingNotificationFilterFormValue => ({
  smartlist: smartlistId,
  smsFilterActive: false,
  smsConsent: CONSENT_OPTIONS.rejected,
  emailFilterActive: false,
  emailConsent: CONSENT_OPTIONS.rejected,
  combineMode: COMBINE_MODE_OPTIONS.and,
  isV2: true,
});
