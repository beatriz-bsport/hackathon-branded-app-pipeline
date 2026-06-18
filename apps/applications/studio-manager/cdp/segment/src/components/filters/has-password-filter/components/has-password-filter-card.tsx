import { useId } from "react";

import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeleteHasPasswordFilterMutation } from "#src/api/use-delete-has-password-filter-mutation";
import { useUpsertHasPasswordFilterMutation } from "#src/api/use-upsert-has-password-filter-mutation";
import { FilterCardSaveButton } from "#src/components/filters/shared/filter-card-save-button";
import { useRegisterSavedFilterDraft } from "#src/hooks/use-register-saved-filter-draft";
import { useTranslation } from "#src/utils/i18n";

import { mapHasPasswordFilterToFormValue } from "../mappers/api-to-form-value";
import { buildHasPasswordFilterDirtyPatch } from "../mappers/build-dirty-patch";
import { createHasPasswordFilterPayload } from "../mappers/form-value-to-create-payload";
import { hasPasswordFilterSchema } from "../schema";
import type { HasPasswordFilterCardProps } from "../types";
import { HasPasswordRadioGroup } from "./has-password-radio-group";

/**
 * Single has password filter card. Owns its form lifecycle (create / dirty patch /
 * delete) and delegates password selection to `HasPasswordRadioGroup`.
 */
export const HasPasswordFilterCard = ({
  smartlistId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: HasPasswordFilterCardProps) => {
  const baseId = useId();
  const hasPasswordFieldId = `${baseId}-has-password-value`;
  const { t } = useTranslation("filters");

  const methods = useFormController({
    mode: "onBlur",
    schema: hasPasswordFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { dirtyFields, isDirty } = methods.formState;
  useRegisterSavedFilterDraft(watchedFilterValue.id, isDirty);

  const { upsertHasPasswordFilterMutate, isLoading: isSaving } =
    useUpsertHasPasswordFilterMutation(smartlistId, {
      onSuccess: (savedFilter) => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.400.toasts.saveSuccess"),
          buttonIcon: "x-close",
        });
        methods.reset(mapHasPasswordFilterToFormValue(savedFilter));
        onSaveSuccess?.();
      },
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.400.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteHasPasswordFilterMutate, isLoading: isDeleting } =
    useDeleteHasPasswordFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.400.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const isSavedFilter = Boolean(watchedFilterValue.id);

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertHasPasswordFilterMutate({
          createPayload: createHasPasswordFilterPayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildHasPasswordFilterDirtyPatch(
        dirtyFields,
        value,
      );
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertHasPasswordFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.400.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      onDeleteUnsavedFilter?.();
      return;
    }

    deleteHasPasswordFilterMutate(watchedFilterValue.id);
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.400.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.400.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>

        <HasPasswordRadioGroup
          id={hasPasswordFieldId}
          value={watchedFilterValue.value}
          disabled={isSaving || isDeleting}
          onChange={(nextValue) =>
            methods.setValue("value", nextValue, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
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
