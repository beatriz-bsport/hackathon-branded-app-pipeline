import type { FC } from "react";

import { useFormContext } from "@bsport/form";
import { Title } from "@bsport/kaizen-primitive-core";

import { type TeacherViewSettingsThemeFormValues } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

import { ToggleFormField } from "../toggle-form-field";

export const AccessSection: FC = () => {
  const { t } = useTranslation("common");
  const { watch } = useFormContext<TeacherViewSettingsThemeFormValues>();
  const isChecked = watch("is_coach_access_enabled_by_default");

  return (
    <div className="flex flex-col gap-sm">
      <Title htmlVariant="h2">{t("teacherViewSettings.access.title")}</Title>
      <ToggleFormField<TeacherViewSettingsThemeFormValues>
        name="is_coach_access_enabled_by_default"
        id="teacher-view-access-default"
        label={t("teacherViewSettings.access.enable")}
        checked={isChecked}
        helperText={t("teacherViewSettings.access.helper")}
      />
    </div>
  );
};
