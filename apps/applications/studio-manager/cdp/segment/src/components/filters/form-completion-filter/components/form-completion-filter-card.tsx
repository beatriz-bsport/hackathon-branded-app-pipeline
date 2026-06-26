import { useEffect, useId, useRef } from "react";

import { useFormController } from "@bsport/form";
import {
  Alert,
  Body,
  Button,
  Card,
  toast,
} from "@bsport/kaizen-primitive-core";

import { useDeleteFormCompletionFilterMutation } from "#src/api/use-delete-form-completion-filter-mutation";
import { useUpsertFormCompletionFilterMutation } from "#src/api/use-upsert-form-completion-filter-mutation";
import { FilterCardSaveButton } from "#src/components/filters/shared/filter-card-save-button";
import { useTranslation } from "#src/utils/i18n";

import {
  completionConditionToSelectValue,
  selectValueToCompletionCondition,
} from "../constants";
import { buildFormCompletionFilterDirtyPatch } from "../mappers/build-dirty-patch";
import { toCreatePayload } from "../mappers/form-value-to-create-payload";
import { formCompletionFilterSchema } from "../schema";
import type { FormCompletionFilterCardProps } from "../types";
import { buildDeactivateDeprecatedSubFiltersPatch } from "../utils/deprecated-sub-filters";
import { CompletionConditionSelect } from "./completion-condition-select";
import { CustomFormsSelectionField } from "./custom-forms-selection-field";

/**
 * Custom form completion filter card (filter identifier 102).
 */
export const FormCompletionFilterCard = ({
  smartlistId,
  filterValue,
  customFormOptions,
  cleanDraftComponent,
}: FormCompletionFilterCardProps) => {
  const { t } = useTranslation("filters");
  const baseId = useId();
  const hasTriggeredDeprecatedSubFiltersDeactivation = useRef(false);
  const fieldIds = {
    completionCondition: `${baseId}-completion-condition`,
    customForms: `${baseId}-custom-forms`,
  };

  const methods = useFormController({
    mode: "onBlur",
    schema: formCompletionFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { errors, dirtyFields, isDirty } = methods.formState;
  const isSavedFilter = Boolean(watchedFilterValue.id);
  const showLegacyConfigurationAlert = Boolean(
    watchedFilterValue.hadLegacyConfigurationAtFetch,
  );

  const { upsertFormCompletionFilterMutate, isLoading: isSaving } =
    useUpsertFormCompletionFilterMutation(smartlistId, {
      onSuccess: () => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.102.toasts.saveSuccess"),
          buttonIcon: "x-close",
        });
        const newValues = methods.getValues();
        methods.reset(newValues);
        cleanDraftComponent?.();
      },
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.102.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteFormCompletionFilterMutate, isLoading: isDeleting } =
    useDeleteFormCompletionFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.102.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  /**
   * If the filter was fetched with sub filters configuration that are deprecated in the new version, deactivate the deprecated sub-filters.
   */
  useEffect(() => {
    if (
      !watchedFilterValue.id ||
      !watchedFilterValue.hadDeprecatedSubFiltersAtFetch ||
      hasTriggeredDeprecatedSubFiltersDeactivation.current
    ) {
      return;
    }

    hasTriggeredDeprecatedSubFiltersDeactivation.current = true;
    upsertFormCompletionFilterMutate({
      filterId: watchedFilterValue.id,
      updatePayload: buildDeactivateDeprecatedSubFiltersPatch(),
    });
  }, [
    upsertFormCompletionFilterMutate,
    watchedFilterValue.hadDeprecatedSubFiltersAtFetch,
    watchedFilterValue.id,
  ]);

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertFormCompletionFilterMutate({
          createPayload: toCreatePayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildFormCompletionFilterDirtyPatch(
        dirtyFields,
        value,
      );
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertFormCompletionFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.102.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      cleanDraftComponent?.();
      return;
    }

    deleteFormCompletionFilterMutate(watchedFilterValue.id);
  };

  const completionConditionSelectValue = completionConditionToSelectValue(
    watchedFilterValue.all_selected_must_fulfill_condition_v2,
  );

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.102.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.102.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>

        {showLegacyConfigurationAlert ? (
          <Alert status="warning" type="weak">
            {t("filters.102.alerts.legacyConfigurationNormalized")}
          </Alert>
        ) : null}

        <CompletionConditionSelect
          id={fieldIds.completionCondition}
          value={completionConditionSelectValue}
          disabled={isSaving || isDeleting}
          errorText={
            errors.all_selected_must_fulfill_condition_v2?.message
              ? String(errors.all_selected_must_fulfill_condition_v2.message)
              : undefined
          }
          onChange={(nextValue) => {
            const nextCondition = selectValueToCompletionCondition(nextValue);
            if (
              nextCondition !==
              watchedFilterValue.all_selected_must_fulfill_condition_v2
            ) {
              methods.setValue(
                "all_selected_must_fulfill_condition_v2",
                nextCondition,
                {
                  shouldDirty: true,
                  shouldValidate: true,
                },
              );
            }
          }}
        />

        <CustomFormsSelectionField
          id={fieldIds.customForms}
          value={watchedFilterValue.custom_forms}
          customFormOptions={customFormOptions}
          disabled={isSaving || isDeleting}
          errorText={
            errors.custom_forms?.message
              ? String(errors.custom_forms.message)
              : undefined
          }
          onChange={(nextValue) => {
            if (nextValue !== watchedFilterValue.custom_forms) {
              methods.setValue("custom_forms", nextValue, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }
          }}
        />

        <FilterCardSaveButton
          isSavedFilter={isSavedFilter}
          isDirty={isDirty}
          isSaving={isSaving}
          isDeleting={isDeleting}
          onSave={handleSave}
        />
      </div>
    </Card>
  );
};
