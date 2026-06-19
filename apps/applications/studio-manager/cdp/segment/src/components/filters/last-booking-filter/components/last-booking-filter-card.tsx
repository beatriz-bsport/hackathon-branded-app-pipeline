import { useId } from "react";

import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeleteLastBookingFilterMutation } from "#src/api/use-delete-last-booking-filter-mutation";
import { useUpsertLastBookingFilterMutation } from "#src/api/use-upsert-last-booking-filter-mutation";
import { FilterCardSaveButton } from "#src/components/filters/shared/filter-card-save-button";
import { useRegisterSavedFilterDraft } from "#src/hooks/use-register-saved-filter-draft";
import { useTranslation } from "#src/utils/i18n";

import { mapLastBookingFilterToFormValue } from "../mappers/api-to-form-value";
import { buildLastBookingFilterDirtyPatch } from "../mappers/build-dirty-patch";
import { createLastBookingFilterPayload } from "../mappers/form-value-to-create-payload";
import { lastBookingFilterSchema } from "../schema";
import type { LastBookingFilterCardProps } from "../types";
import { LastBookingDaysField } from "./last-booking-days-field";

/**
 * Single last booking filter card. Owns its form lifecycle (create / dirty patch /
 * delete) and delegates the days input to `LastBookingDaysField`.
 */
export const LastBookingFilterCard = ({
  smartlistId,
  filterValue,
  cleanDraftComponent,
}: LastBookingFilterCardProps) => {
  const baseId = useId();
  const daysFieldId = `${baseId}-last-booking-days`;
  const { t } = useTranslation("filters");

  const methods = useFormController({
    mode: "onBlur",
    schema: lastBookingFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { errors, dirtyFields, isDirty } = methods.formState;
  useRegisterSavedFilterDraft(watchedFilterValue.id, isDirty);

  const { upsertLastBookingFilterMutate, isLoading: isSaving } =
    useUpsertLastBookingFilterMutation(smartlistId, {
      onSuccess: (savedFilter) => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.501.toasts.saveSuccess"),
          buttonIcon: "x-close",
        });
        methods.reset(mapLastBookingFilterToFormValue(savedFilter));
        cleanDraftComponent?.();
      },
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.501.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteLastBookingFilterMutate, isLoading: isDeleting } =
    useDeleteLastBookingFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.501.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const isSavedFilter = Boolean(watchedFilterValue.id);

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertLastBookingFilterMutate({
          createPayload: createLastBookingFilterPayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildLastBookingFilterDirtyPatch(
        dirtyFields,
        value,
      );
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertLastBookingFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.501.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      cleanDraftComponent?.();
      return;
    }

    deleteLastBookingFilterMutate(watchedFilterValue.id);
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.501.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.501.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>

        <LastBookingDaysField
          id={daysFieldId}
          value={watchedFilterValue.value}
          errorText={
            errors.value?.message ? String(errors.value.message) : undefined
          }
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
