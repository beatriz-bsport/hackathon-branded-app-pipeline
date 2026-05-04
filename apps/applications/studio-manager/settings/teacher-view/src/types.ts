import { type UpdateReplacementRequestConfigurationPayload } from "@bsport/api-core";

export type TeacherViewSettingsThemeFormValues = {
  is_coach_access_enabled_by_default: boolean;
  has_coach_access_to_calendar: boolean;
  has_coach_access_to_compensation: boolean;
  has_coach_access_to_compensation_downloading: boolean;
};

export type ReplacementRequestConfigurationFormValues =
  UpdateReplacementRequestConfigurationPayload;

export type ReplacementRequestSettingsFormValues =
  ReplacementRequestConfigurationFormValues & {
    has_coach_access_to_replacement_request: boolean;
  };
