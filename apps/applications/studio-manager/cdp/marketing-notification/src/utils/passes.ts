import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import type { AppointmentPass } from "@bsport/store-buyables-appointment-pass";
import type { Pass } from "@bsport/store-buyables-pass";
import { MarketingNotification } from "@bsport/store-cdp-marketing-notification";

import type { PassListItemData } from "#src/utils/types";
import {
  isMarketingNotificationPaymentPackCreditsType,
  isMarketingNotificationPaymentPackTimeType,
  isMarketingNotificationPrivatePassCreditsType,
  isMarketingNotificationPrivatePassTimeType,
} from "#src/utils/typesGuards";

/**
 * Formats a pass price based on its type and currency
 *
 * @param price - The price value (number, string, or object with parsedValue)
 * @param companyCurrencyDisplay - The company's currency display format
 * @returns Formatted price string
 */
function getPassPrice(
  price: number | string | { parsedValue: number; source: string },
) {
  if (typeof price === "number") {
    return getCurrencyDisplayWithPrice(price);
  }
  if (typeof price === "string") {
    return getCurrencyDisplayWithPrice(parseFloat(price));
  }
  if (typeof price === "object" && price !== null && "parsedValue" in price) {
    return getCurrencyDisplayWithPrice(price.parsedValue);
  }
  return getCurrencyDisplayWithPrice(0);
}

/**
 * Extracts regular pass data for list display
 *
 * @param pass - The pass object
 * @param currency - The currency display format
 * @returns Formatted pass data
 */
function extractPassListData({
  pass,
}: {
  pass: Pass | AppointmentPass;
}): PassListItemData {
  return {
    id: pass.id,
    name: pass.name,
    credits: pass.credits,
    price: getPassPrice(pass.price),
  };
}

/**
 * Checks if the given marketing notification includes all relevant passes.
 *
 * This function evaluates the type of the notification and determines whether
 * it is configured to include all payment packs or all private passes, based on
 * the notification's event rules.
 *
 * @param notification - The marketing notification to check.
 * @returns `true` if the notification includes all payment packs or all private passes,
 *          depending on its type; otherwise, `false`.
 */
function checkIfNotificationIncludesAllPasses(
  notification: MarketingNotification,
): boolean {
  return (
    (isMarketingNotificationPaymentPackCreditsType(notification) &&
      notification.event_rules.contains_all_payment_packs) ||
    (isMarketingNotificationPaymentPackTimeType(notification) &&
      notification.event_rules.contains_all_payment_packs) ||
    (isMarketingNotificationPrivatePassCreditsType(notification) &&
      notification.event_rules.contains_all_private_passes) ||
    (isMarketingNotificationPrivatePassTimeType(notification) &&
      notification.event_rules.contains_all_private_passes)
  );
}

export {
  extractPassListData,
  getPassPrice,
  checkIfNotificationIncludesAllPasses,
};
