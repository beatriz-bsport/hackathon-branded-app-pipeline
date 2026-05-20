import { updateIntentToSavePaymentMethodAPI } from "@bsport/api-financial-services/payment-group";
import {
  ReaderActionStatus,
  retrieveReaderActionSumupAPI,
} from "@bsport/api-financial-services/terminal";
import { getLocalNow } from "@bsport/datetime-manipulation";
import type { Fetch } from "@bsport/fetch";
import type { SelectedDate } from "@bsport/kaizen-primitive-core";

import type { ManualMethodType } from "#src/components/financial-services/payment-flow-modal/components/payment-methods/manual/types";

export const MANUAL_METHOD_IDENTIFIER_BY_TYPE: Record<
  ManualMethodType,
  number
> = {
  card_manual_machine: 15,
  cash: 0,
  check: 3,
  vacation_check: 4,
  transfer: 7,
  american_express: 5,
  other: 8,
  client_credit_balance: 14,
} as const;

export const parseIntentIdFromClientSecret = (clientSecret: string): string => {
  const separator = "_secret_";
  const separatorIndex = clientSecret.indexOf(separator);
  return separatorIndex >= 0
    ? clientSecret.slice(0, separatorIndex)
    : clientSecret;
};

/**
 * Normalizes the date value coming from the manual payment date picker.
 *
 * The picker can return either a DateTime value or an array (date range mode).
 * We always resolve a single ISO string and fallback to "now" when no valid
 * date can be extracted.
 */
export const resolveManualDate = (manualDate: SelectedDate): string => {
  const fallbackNowIso = getLocalNow({}).toISO();
  if (!fallbackNowIso) {
    throw new Error("Unable to resolve current date.");
  }

  if (Array.isArray(manualDate)) {
    const firstDate = manualDate[0];
    if (firstDate && typeof firstDate === "object" && "toISO" in firstDate) {
      return firstDate.toISO() ?? fallbackNowIso;
    }
    return fallbackNowIso;
  }

  if (manualDate && typeof manualDate === "object" && "toISO" in manualDate) {
    return manualDate.toISO() ?? fallbackNowIso;
  }
  return fallbackNowIso;
};

/**
 * Polls the terminal reader action status until it reaches a terminal state.
 *
 * - Succeeds when reader status is `SUCCEEDED`.
 * - Throws with backend message when reader status is `FAILED`.
 * - Retries up to 60 attempts with a 1s delay between attempts.
 */
export const pollReaderActionUntilCompleted = async (
  fetch: Fetch,
  readerId: string,
  attempt = 0,
): Promise<void> => {
  if (attempt >= 60) {
    throw new Error("Terminal payment timeout.");
  }

  const summary = await retrieveReaderActionSumupAPI(fetch, readerId);

  if (summary.status === ReaderActionStatus.SUCCEEDED) return;
  if (summary.status === ReaderActionStatus.FAILED) {
    throw new Error(summary.failure_message ?? "Terminal payment failed.");
  }

  await new Promise<void>((resolve) => {
    setTimeout(resolve, 1000);
  });

  return pollReaderActionUntilCompleted(fetch, readerId, attempt + 1);
};

/**
 * Returns the client secret to use for confirmation.
 *
 * When "save payment method" is enabled, we refresh the intent so backend can
 * apply the save-for-later flag and return the updated client secret.
 */
export const resolveClientSecret = async (
  fetch: Fetch,
  paymentGroupId: number,
  currentClientSecret: string,
  shouldSave: boolean,
): Promise<string> => {
  if (!shouldSave) return currentClientSecret;

  const response = await updateIntentToSavePaymentMethodAPI(fetch, {
    payment_group_id: paymentGroupId,
    save_for_later: true,
  });

  return response.client_secret;
};
