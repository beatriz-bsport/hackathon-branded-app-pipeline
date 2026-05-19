import { z } from "zod";

import { type ReplacementRequestConfiguration } from "@bsport/api-book";
import { dataAccessLayer } from "@bsport/sm-backbone";

import {
  LATE_REQUEST_LIMITATION_PERIOD_TYPE_MONTH,
  LATE_REQUEST_LIMITATION_PERIOD_TYPE_WEEK,
  LATE_REQUEST_LIMITATION_PERIOD_TYPE_YEAR,
} from "#src/constants";
import {
  type ReplacementRequestConfigurationFormValues,
  type TeacherViewSettingsThemeFormValues,
} from "#src/types";

export const teacherViewSettingsSchema = z
  .object({
    is_coach_access_enabled_by_default: z.boolean(),
    has_coach_access_to_calendar: z.boolean(),
    has_coach_access_to_compensation: z.boolean(),
    has_coach_access_to_compensation_downloading: z.boolean(),
  })
  .refine(
    (values) =>
      values.has_coach_access_to_calendar ||
      values.has_coach_access_to_compensation,
    {
      message: "At least one restriction must remain enabled",
      path: ["has_coach_access_to_calendar"],
    },
  );

export const replacementRequestConfigurationFields = {
  days_before_offer_replacement_request_is_late: z
    .number({ invalid_type_error: "required" })
    .min(1),
  days_before_offer_replacement_request_closing_date: z
    .number({ invalid_type_error: "required" })
    .min(1),
  is_late_replacement_request_limited: z.boolean(),
  late_request_limitation_period_type: z.union([
    z.literal(LATE_REQUEST_LIMITATION_PERIOD_TYPE_WEEK),
    z.literal(LATE_REQUEST_LIMITATION_PERIOD_TYPE_MONTH),
    z.literal(LATE_REQUEST_LIMITATION_PERIOD_TYPE_YEAR),
  ]),
  late_request_limitation_period_nb: z
    .number({ invalid_type_error: "required" })
    .min(1),
  max_late_requests_per_limitation_period: z
    .number({ invalid_type_error: "required" })
    .min(1),
} satisfies z.ZodRawShape;

export const replacementRequestSettingsSchema = z.object({
  has_coach_access_to_replacement_request: z.boolean(),
  ...replacementRequestConfigurationFields,
});

export function toTeacherViewFormValues(
  theme: NonNullable<ReturnType<typeof dataAccessLayer.useCompanyTheme>>,
): TeacherViewSettingsThemeFormValues {
  return {
    is_coach_access_enabled_by_default:
      theme.is_coach_access_enabled_by_default,
    has_coach_access_to_calendar: theme.has_coach_access_to_calendar,
    has_coach_access_to_compensation: theme.has_coach_access_to_compensation,
    has_coach_access_to_compensation_downloading:
      theme.has_coach_access_to_compensation_downloading,
  };
}

export function toReplacementRequestFormValues(
  c: ReplacementRequestConfiguration,
): ReplacementRequestConfigurationFormValues {
  const {
    days_before_offer_replacement_request_is_late,
    max_late_requests_per_limitation_period,
    is_late_replacement_request_limited,
    late_request_limitation_period_type,
    days_before_offer_replacement_request_closing_date,
    late_request_limitation_period_nb,
  } = c;
  return {
    days_before_offer_replacement_request_is_late,
    max_late_requests_per_limitation_period,
    is_late_replacement_request_limited,
    late_request_limitation_period_type,
    days_before_offer_replacement_request_closing_date,
    late_request_limitation_period_nb,
  };
}
