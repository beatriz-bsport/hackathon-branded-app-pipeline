import { useId } from "react";

import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeleteTermsAndConditionsFilterMutation } from "#src/api/use-delete-terms-and-conditions-filter-mutation";
import { useUpsertTermsAndConditionsFilterMutation } from "#src/api/use-upsert-terms-and-conditions-filter-mutation";
import { useTranslation } from "#src/utils/i18n";

import { mapTermsAndConditionsFilterToFormValue } from "../mappers/api-to-form-value";
import { buildTermsAndConditionsFilterDirtyPatch } from "../mappers/build-dirty-patch";
import { createTermsAndConditionsFilterPayload } from "../mappers/form-value-to-create-payload";
import { termsAndConditionsFilterSchema } from "../schema";
import type { TermsAndConditionsFilterCardProps } from "../types";
import { TermsAndConditionsRadioGroup } from "./terms-and-conditions-radio-group";

/**
 * Single terms and conditions filter card. Owns its form lifecycle (create /
 * dirty patch / delete) and delegates acceptance selection to
 * `TermsAndConditionsRadioGroup`.
 */
export const TermsAndConditionsFilterCard = ({
  smartlistId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: TermsAndConditionsFilterCardProps) => {
  const baseId = useId();
  const acceptanceFieldId = `${baseId}-terms-and-conditions-value`;
  const { t } = useTranslation("filters");

  const methods = useFormController({
    mode: "onBlur",
    schema: termsAndConditionsFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { dirtyFields, isDirty } = methods.formState;

  const { upsertTermsAndConditionsFilterMutate, isLoading: isSaving } =
    useUpsertTermsAndConditionsFilterMutation(smartlistId, {
      onSuccess: (savedFilter) => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.107.toasts.saveSuccess"),
          buttonIcon: "x-close",
        });
        methods.reset(mapTermsAndConditionsFilterToFormValue(savedFilter));
        onSaveSuccess?.();
      },
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.107.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteTermsAndConditionsFilterMutate, isLoading: isDeleting } =
    useDeleteTermsAndConditionsFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.107.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const isSavedFilter = Boolean(watchedFilterValue.id);

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertTermsAndConditionsFilterMutate({
          createPayload: createTermsAndConditionsFilterPayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildTermsAndConditionsFilterDirtyPatch(
        dirtyFields,
        value,
      );
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertTermsAndConditionsFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.107.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      onDeleteUnsavedFilter?.();
      return;
    }

    deleteTermsAndConditionsFilterMutate(watchedFilterValue.id);
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.107.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.107.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>

        <TermsAndConditionsRadioGroup
          id={acceptanceFieldId}
          value={watchedFilterValue.value}
          disabled={isSaving || isDeleting}
          onChange={(nextValue) =>
            methods.setValue("value", nextValue, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />

        <div className="flex justify-end">
          <Button
            label={
              isSavedFilter
                ? t("filters.107.actions.update")
                : t("filters.107.actions.save")
            }
            iconLeft="check"
            size="sm"
            color="main"
            intent="default"
            loading={isSaving}
            disabled={isSaving || isDeleting || (isSavedFilter && !isDirty)}
            onClick={() => void handleSave()}
          />
        </div>
      </div>
    </Card>
  );
};
