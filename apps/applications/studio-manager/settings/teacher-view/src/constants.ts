import type {
  ReplacementRequestConfigurationFormValues,
  ReplacementRequestSettingsFormValues,
  TeacherViewSettingsThemeFormValues,
} from "#src/types";

export const LATE_REQUEST_LIMITATION_PERIOD_TYPE_WEEK = 1;
export const LATE_REQUEST_LIMITATION_PERIOD_TYPE_MONTH = 2;
export const LATE_REQUEST_LIMITATION_PERIOD_TYPE_YEAR = 3;

export const UPSELL_IDENTIFIER_SUBTEACHER_TOOL = 26;

export type ReplacementRequestLimitationPeriodType =
  | typeof LATE_REQUEST_LIMITATION_PERIOD_TYPE_WEEK
  | typeof LATE_REQUEST_LIMITATION_PERIOD_TYPE_MONTH
  | typeof LATE_REQUEST_LIMITATION_PERIOD_TYPE_YEAR;

export const defaultTeacherViewSettingsFormValues: TeacherViewSettingsThemeFormValues =
  {
    is_coach_access_enabled_by_default: false,
    has_coach_access_to_calendar: true,
    has_coach_access_to_compensation: true,
    has_coach_access_to_compensation_downloading: false,
  };

export const defaultReplacementRequestConfigurationFormValues: ReplacementRequestConfigurationFormValues =
  {
    days_before_offer_replacement_request_is_late: 21,
    max_late_requests_per_limitation_period: 3,
    is_late_replacement_request_limited: true,
    late_request_limitation_period_type:
      LATE_REQUEST_LIMITATION_PERIOD_TYPE_MONTH,
    days_before_offer_replacement_request_closing_date: 14,
    late_request_limitation_period_nb: 1,
  };

export const defaultReplacementRequestSettingsFormValues: ReplacementRequestSettingsFormValues =
  {
    has_coach_access_to_replacement_request: false,
    ...defaultReplacementRequestConfigurationFormValues,
  };

export const replacementRequestLimitationPeriodItems = [
  { id: String(LATE_REQUEST_LIMITATION_PERIOD_TYPE_WEEK) },
  { id: String(LATE_REQUEST_LIMITATION_PERIOD_TYPE_MONTH) },
  { id: String(LATE_REQUEST_LIMITATION_PERIOD_TYPE_YEAR) },
] as const;
