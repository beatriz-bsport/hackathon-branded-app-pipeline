import type { FC } from "react";

import { useFormContext } from "@bsport/form";
import { Body, Title } from "@bsport/kaizen-primitive-core";

import { type TeacherViewSettingsThemeFormValues } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

import { CheckboxFormField } from "../checkbox-form-field";
import { ToggleFormField } from "../toggle-form-field";

export const RestrictionsSection: FC = () => {
  const { t } = useTranslation("common");
  const {
    watch,
    formState: { errors },
  } = useFormContext<TeacherViewSettingsThemeFormValues>();
  const hasCalendar = watch("has_coach_access_to_calendar");
  const hasCompensation = watch("has_coach_access_to_compensation");
  const hasCompensationDownloading = watch(
    "has_coach_access_to_compensation_downloading",
  );
  const atLeastOneError = errors.has_coach_access_to_calendar?.message;

  return (
    <div className="flex flex-col gap-md items-start">
      <div className="flex flex-col">
        <Title htmlVariant="h2">
          {t("teacherViewSettings.restrictions.title")}
        </Title>
        <Body htmlVariant="p" color="weak" size="sm">
          {t("teacherViewSettings.restrictions.helper")}
        </Body>
      </div>
      <ToggleFormField<TeacherViewSettingsThemeFormValues>
        name="has_coach_access_to_calendar"
        id="teacher-view-restriction-calendar"
        label={t("teacherViewSettings.restrictions.schedule")}
        checked={hasCalendar}
        errorText={atLeastOneError}
      />

      <div className="flex flex-col gap-sm items-start">
        <ToggleFormField<TeacherViewSettingsThemeFormValues>
          name="has_coach_access_to_compensation"
          id="teacher-view-restriction-compensation"
          label={t("teacherViewSettings.restrictions.payroll")}
          checked={hasCompensation}
          errorText={atLeastOneError}
        />
        <div className="ml-sm pl-lg">
          <CheckboxFormField<TeacherViewSettingsThemeFormValues>
            name="has_coach_access_to_compensation_downloading"
            id="teacher-view-restriction-compensation-download"
            label={t("teacherViewSettings.restrictions.payrollDownload")}
            checked={hasCompensationDownloading}
            disabled={!hasCompensation}
          />
        </div>
      </div>
    </div>
  );
};
