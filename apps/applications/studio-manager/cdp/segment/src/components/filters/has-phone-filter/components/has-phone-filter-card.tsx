import { useId } from "react";

import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeleteHasPhoneFilterMutation } from "#src/api/use-delete-has-phone-filter-mutation";
import { useUpsertHasPhoneFilterMutation } from "#src/api/use-upsert-has-phone-filter-mutation";
import { useRegisterSavedFilterDraft } from "#src/hooks/use-register-saved-filter-draft";
import { useTranslation } from "#src/utils/i18n";

import { mapHasPhoneFilterToFormValue } from "../mappers/api-to-form-value";
import { buildHasPhoneFilterDirtyPatch } from "../mappers/build-dirty-patch";
import { createHasPhoneFilterPayload } from "../mappers/form-value-to-create-payload";
import { hasPhoneFilterSchema } from "../schema";
import type { HasPhoneFilterCardProps } from "../types";
import { HasPhoneRadioGroup } from "./has-phone-radio-group";

/**
 * Single has phone filter card. Owns its form lifecycle (create / dirty patch /
 * delete) and delegates phone selection to `HasPhoneRadioGroup`.
 */
export const HasPhoneFilterCard = ({
  smartlistId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: HasPhoneFilterCardProps) => {
  const baseId = useId();
  const hasPhoneFieldId = `${baseId}-has-phone-value`;
  const { t } = useTranslation("filters");

  const methods = useFormController({
    mode: "onBlur",
    schema: hasPhoneFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { dirtyFields, isDirty } = methods.formState;
  useRegisterSavedFilterDraft(watchedFilterValue.id, isDirty);

  const { upsertHasPhoneFilterMutate, isLoading: isSaving } =
    useUpsertHasPhoneFilterMutation(smartlistId, {
      onSuccess: (savedFilter) => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.106.toasts.saveSuccess"),
          buttonIcon: "x-close",
        });
        methods.reset(mapHasPhoneFilterToFormValue(savedFilter));
        onSaveSuccess?.();
      },
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.106.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteHasPhoneFilterMutate, isLoading: isDeleting } =
    useDeleteHasPhoneFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.106.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const isSavedFilter = Boolean(watchedFilterValue.id);

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertHasPhoneFilterMutate({
          createPayload: createHasPhoneFilterPayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildHasPhoneFilterDirtyPatch(
        dirtyFields,
        value,
      );
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertHasPhoneFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.106.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      onDeleteUnsavedFilter?.();
      return;
    }

    deleteHasPhoneFilterMutate(watchedFilterValue.id);
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.106.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.106.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>

        <HasPhoneRadioGroup
          id={hasPhoneFieldId}
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
                ? t("filters.106.actions.update")
                : t("filters.106.actions.save")
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
