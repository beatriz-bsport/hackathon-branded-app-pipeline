import { useEffect, useMemo } from "react";

import { useFormController } from "@bsport/form";
import { dataAccessLayer } from "@bsport/sm-backbone";

import {
  UPSELL_IDENTIFIER_SUBTEACHER_TOOL,
  defaultTeacherViewSettingsFormValues,
} from "#src/constants";
import { useUpdateCompanyTheme } from "#src/hooks/api/use-update-company-theme";
import { useCompanyUpsell } from "#src/hooks/use-company-upsell";
import { type TeacherViewSettingsThemeFormValues } from "#src/types";
import {
  teacherViewSettingsSchema,
  toTeacherViewFormValues,
} from "#src/utils/form-utils";

export function useTeacherAccessSettingsForm() {
  const theme = dataAccessLayer.useCompanyTheme();
  const hasSubteacherUpsell = useCompanyUpsell(
    UPSELL_IDENTIFIER_SUBTEACHER_TOOL,
  );
  const companyId = theme?.company;
  const defaultValues = useMemo(
    () =>
      theme
        ? toTeacherViewFormValues(theme)
        : defaultTeacherViewSettingsFormValues,
    [theme],
  );
  const methods = useFormController({
    schema: teacherViewSettingsSchema,
    defaultValues,
    mode: "onChange",
    shouldFocusError: true,
  });
  const hasCompensation = methods.watch("has_coach_access_to_compensation");

  useEffect(() => {
    methods.reset(defaultValues);
  }, [defaultValues, methods]);

  useEffect(() => {
    if (
      !hasCompensation &&
      methods.getValues("has_coach_access_to_compensation_downloading")
    ) {
      methods.setValue("has_coach_access_to_compensation_downloading", false, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [hasCompensation, methods]);

  const { isPending, mutate } = useUpdateCompanyTheme();

  const handleSubmit = (values: TeacherViewSettingsThemeFormValues) => {
    if (!companyId) return;

    const normalizedValues = {
      ...values,
      has_coach_access_to_compensation_downloading:
        values.has_coach_access_to_compensation
          ? values.has_coach_access_to_compensation_downloading
          : false,
    };

    mutate(
      {
        companyId,
        data: normalizedValues,
      },
      {
        onSuccess: () => {
          methods.reset(normalizedValues);
        },
      },
    );
  };

  return {
    methods,
    handleSubmit,
    isLoading: isPending,
    hasSubteacherUpsell,
    companyId,
  };
}
