import { useId } from "react";

import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeleteInternalNotesFilterMutation } from "#src/api/use-delete-internal-notes-filter-mutation";
import { useUpsertInternalNotesFilterMutation } from "#src/api/use-upsert-internal-notes-filter-mutation";
import { useTranslation } from "#src/utils/i18n";

import { buildInternalNotesFilterDirtyPatch } from "../mappers/build-dirty-patch";
import { createInternalNotesFilterPayload } from "../mappers/form-value-to-create-payload";
import { internalNotesFilterSchema } from "../schema";
import type { InternalNotesFilterCardProps } from "../types";
import { InternalNotesSubFiltersArea } from "./internal-notes-sub-filters-area";
import { NoteTypeRadioGroup } from "./note-type-radio-group";

/**
 * Single internal notes filter card. Owns form lifecycle (create / patch / delete).
 */
export const InternalNotesFilterCard = ({
  smartlistId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: InternalNotesFilterCardProps) => {
  const baseId = useId();
  const fieldIds = {
    noteType: `${baseId}-note-type`,
    noteCreationDate: `${baseId}-note-creation-date`,
  };
  const { t } = useTranslation("filters");

  const methods = useFormController({
    mode: "onBlur",
    schema: internalNotesFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { errors, dirtyFields, isDirty } = methods.formState;

  const { upsertInternalNotesFilterMutate, isLoading: isSaving } =
    useUpsertInternalNotesFilterMutation(smartlistId, {
      onSuccess: () => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.104.toasts.saveSuccess"),
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
          title: error.message || t("filters.104.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteInternalNotesFilterMutate, isLoading: isDeleting } =
    useDeleteInternalNotesFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.104.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const isSavedFilter = Boolean(watchedFilterValue.id);

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertInternalNotesFilterMutate({
          createPayload: createInternalNotesFilterPayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildInternalNotesFilterDirtyPatch(
        dirtyFields,
        value,
      );
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertInternalNotesFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.104.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      onDeleteUnsavedFilter?.();
      return;
    }

    deleteInternalNotesFilterMutate(watchedFilterValue.id);
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.104.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.104.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>

        <NoteTypeRadioGroup
          id={fieldIds.noteType}
          value={watchedFilterValue.noteType}
          disabled={isSaving || isDeleting}
          onChange={(nextValue) =>
            methods.setValue("noteType", nextValue, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />

        <InternalNotesSubFiltersArea
          fieldIds={fieldIds}
          watchedFilterValue={watchedFilterValue}
          errors={errors}
          setValue={methods.setValue}
        />

        <div className="flex justify-end">
          <Button
            label={t("filters.104.actions.save")}
            size="sm"
            color="main"
            intent="default"
            iconLeft="check"
            loading={isSaving}
            disabled={isSaving || isDeleting || (isSavedFilter && !isDirty)}
            onClick={handleSave}
          />
        </div>
      </div>
    </Card>
  );
};
