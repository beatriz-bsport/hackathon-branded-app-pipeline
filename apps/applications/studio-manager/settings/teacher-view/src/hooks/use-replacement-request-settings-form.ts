import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

import {
  type ReplacementRequestConfiguration,
  teacherKeys,
  updateReplacementRequestConfigurationMutationOptions,
} from "@bsport/api-core";
import { useFormController } from "@bsport/form";
import { toast } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import {
  defaultReplacementRequestConfigurationFormValues,
  defaultReplacementRequestSettingsFormValues,
} from "#src/constants";
import { type ReplacementRequestSettingsFormValues } from "#src/types";
import { fetch } from "#src/utils/fetch";
import {
  replacementRequestSettingsSchema,
  toReplacementRequestFormValues,
} from "#src/utils/form-utils";
import { useTranslation } from "#src/utils/i18n";

import { useUpdateCompanyTheme } from "./api/use-update-company-theme";

export function useReplacementRequestSettingsForm({
  companyId,
  hasSubteacherUpsell,
  replacementRequestConfiguration,
}: {
  companyId: number | undefined;
  hasSubteacherUpsell: boolean;
  replacementRequestConfiguration?: ReplacementRequestConfiguration;
}) {
  const { t } = useTranslation("common");
  const queryClient = useQueryClient();
  const theme = dataAccessLayer.useCompanyTheme();
  const defaultValues = useMemo(
    () =>
      theme
        ? {
            has_coach_access_to_replacement_request:
              theme.has_coach_access_to_replacement_request,
            ...(replacementRequestConfiguration
              ? toReplacementRequestFormValues(replacementRequestConfiguration)
              : defaultReplacementRequestConfigurationFormValues),
          }
        : defaultReplacementRequestSettingsFormValues,
    [replacementRequestConfiguration, theme],
  );
  const methods = useFormController({
    schema: replacementRequestSettingsSchema,
    defaultValues,
    mode: "onChange",
    shouldFocusError: true,
  });

  const updateThemeMutation = useUpdateCompanyTheme();
  const updateReplacementRequestConfigurationMutation = useMutation({
    ...updateReplacementRequestConfigurationMutationOptions(fetch),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: teacherKeys.replacementRequestConfiguration(),
      });
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("teacherViewSettings.replacementRequest.toasts.error"),
        buttonIcon: "x-close",
      });
    },
  });
  const isSavingReplacementRequest =
    updateReplacementRequestConfigurationMutation.isPending;

  useEffect(() => {
    if (isSavingReplacementRequest) return;

    methods.reset(defaultValues);
  }, [defaultValues, isSavingReplacementRequest, methods]);

  const handleSubmit = async (values: ReplacementRequestSettingsFormValues) => {
    if (!companyId || !theme) return;

    const {
      has_coach_access_to_replacement_request: hasReplacementRequest,
      ...replacementConfiguration
    } = values;
    const dirtyFields = methods.formState.dirtyFields;
    const hasReplacementConfigurationChanges =
      dirtyFields.days_before_offer_replacement_request_is_late ||
      dirtyFields.days_before_offer_replacement_request_closing_date ||
      dirtyFields.is_late_replacement_request_limited ||
      dirtyFields.late_request_limitation_period_type ||
      dirtyFields.late_request_limitation_period_nb ||
      dirtyFields.max_late_requests_per_limitation_period;

    try {
      if (
        theme.has_coach_access_to_replacement_request !== hasReplacementRequest
      ) {
        await updateThemeMutation.mutateAsync({
          companyId,
          data: {
            has_coach_access_to_replacement_request: hasReplacementRequest,
          },
        });
      }

      if (
        hasSubteacherUpsell &&
        hasReplacementRequest &&
        hasReplacementConfigurationChanges
      ) {
        await updateReplacementRequestConfigurationMutation.mutateAsync({
          companyId,
          data: replacementConfiguration,
        });
      }

      methods.reset(values);
      toast({
        status: "positive",
        title: t("teacherViewSettings.replacementRequest.toasts.success"),
        buttonIcon: "x-close",
      });
    } catch {
      // Individual mutations handle their own error toasts
    }
  };

  return {
    methods,
    handleSubmit,
    isSaving: updateThemeMutation.isPending || isSavingReplacementRequest,
  };
}
