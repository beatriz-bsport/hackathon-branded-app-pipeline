import { useId } from "react";

import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeleteGenderFilterMutation } from "#src/api/use-delete-gender-filter-mutation";
import { useUpsertGenderFilterMutation } from "#src/api/use-upsert-gender-filter-mutation";
import { useTranslation } from "#src/utils/i18n";

import { buildDirtyPatchPayload } from "../mappers/build-dirty-patch";
import { createGenderFilterPayload } from "../mappers/form-value-to-create-payload";
import { genderFilterSchema } from "../schema";
import type { GenderFilterCardProps } from "../types";
import { GenderField } from "./gender-field";

/**
 * Single gender filter card. Owns its form lifecycle (create / dirty patch /
 * delete) and delegates gender selection to `GenderField`.
 */
export const GenderFilterCard = ({
  smartlistId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: GenderFilterCardProps) => {
  const baseId = useId();
  const genderFieldId = `${baseId}-gender-value`;
  const { t } = useTranslation("filters");

  const methods = useFormController({
    mode: "onBlur",
    schema: genderFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { dirtyFields } = methods.formState;

  const { upsertGenderFilterMutate, isLoading: isSaving } =
    useUpsertGenderFilterMutation(smartlistId, {
      onSuccess: () => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.5.toasts.saveSuccess"),
          buttonIcon: "x-close",
        });
        const newValues = methods.getValues();
        methods.reset(newValues);
        onSaveSuccess?.();
      },
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.5.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteGenderFilterMutate, isLoading: isDeleting } =
    useDeleteGenderFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.5.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const isDirty = Object.keys(dirtyFields).length > 0;
  const isSavedFilter = Boolean(watchedFilterValue.id);

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertGenderFilterMutate({
          createPayload: createGenderFilterPayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildDirtyPatchPayload(dirtyFields, value);
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertGenderFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.5.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      onDeleteUnsavedFilter?.();
      return;
    }

    deleteGenderFilterMutate(watchedFilterValue.id);
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.5.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.5.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>

        <GenderField
          id={genderFieldId}
          value={watchedFilterValue.value}
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
                ? t("filters.5.actions.update")
                : t("filters.5.actions.save")
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
