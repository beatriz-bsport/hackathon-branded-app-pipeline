import type { FieldNamesMarkedBoolean } from "react-hook-form";

import { isDirtyFieldEntry } from "#src/components/filters/shared/dirty-fields";

import {
  combineModeOptionToBooleanMap,
  consentOptionToBooleanMap,
} from "../constants";
import type {
  MarketingNotificationFilterDirtyPatchPayload,
  MarketingNotificationFilterFormValue,
} from "../types";

type MarketingNotificationFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<MarketingNotificationFilterFormValue>>
>;

/**
 * Builds a `PATCH /marketing_notifications/{id}/` payload from React Hook Form's
 * `dirtyFields` snapshot. Legacy rows always include `is_v2: true` on save.
 */
export const buildMarketingNotificationFilterDirtyPatch = (
  dirtyFields: MarketingNotificationFilterDirtyFields,
  value: MarketingNotificationFilterFormValue,
): MarketingNotificationFilterDirtyPatchPayload => {
  const payload: MarketingNotificationFilterDirtyPatchPayload = {};

  if (isDirtyFieldEntry(dirtyFields.smsFilterActive)) {
    payload.sms_filter_active = value.smsFilterActive;
  }

  if (
    isDirtyFieldEntry(dirtyFields.smsConsent) ||
    isDirtyFieldEntry(dirtyFields.smsFilterActive)
  ) {
    payload.sms_value = consentOptionToBooleanMap[value.smsConsent];
  }

  if (isDirtyFieldEntry(dirtyFields.emailFilterActive)) {
    payload.email_filter_active = value.emailFilterActive;
  }

  if (
    isDirtyFieldEntry(dirtyFields.emailConsent) ||
    isDirtyFieldEntry(dirtyFields.emailFilterActive)
  ) {
    payload.email_value = consentOptionToBooleanMap[value.emailConsent];
  }

  if (isDirtyFieldEntry(dirtyFields.combineMode)) {
    payload.is_condition_and = combineModeOptionToBooleanMap[value.combineMode];
  }

  if (!value.isV2) {
    payload.is_v2 = true;
  }

  return payload;
};
