import { useId } from "react";

import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeleteLiabilityWaiverFilterMutation } from "#src/api/use-delete-liability-waiver-filter-mutation";
import { useUpsertLiabilityWaiverFilterMutation } from "#src/api/use-upsert-liability-waiver-filter-mutation";
import { useTranslation } from "#src/utils/i18n";

import { buildLiabilityWaiverFilterDirtyPatch } from "../mappers/build-dirty-patch";
import { createLiabilityWaiverFilterPayload } from "../mappers/form-value-to-create-payload";
import { liabilityWaiverFilterSchema } from "../schema";
import type { LiabilityWaiverFilterCardProps } from "../types";
import { LiabilityWaiverRadioGroup } from "./liability-waiver-radio-group";

/**
 * Single liability waiver filter card. Owns its form lifecycle (create / dirty patch /
 * delete) and delegates waiver selection to `LiabilityWaiverRadioGroup`.
 */
export const LiabilityWaiverFilterCard = ({
  smartlistId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: LiabilityWaiverFilterCardProps) => {
  const baseId = useId();
  const waiverFieldId = `${baseId}-liability-waiver-value`;
  const { t } = useTranslation("filters");

  const methods = useFormController({
    mode: "onBlur",
    schema: liabilityWaiverFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { dirtyFields } = methods.formState;

  const { upsertLiabilityWaiverFilterMutate, isLoading: isSaving } =
    useUpsertLiabilityWaiverFilterMutation(smartlistId, {
      onSuccess: () => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.410.toasts.saveSuccess"),
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
          title: error.message || t("filters.410.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteLiabilityWaiverFilterMutate, isLoading: isDeleting } =
    useDeleteLiabilityWaiverFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.410.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const isDirty = Object.keys(dirtyFields).length > 0;
  const isSavedFilter = Boolean(watchedFilterValue.id);

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertLiabilityWaiverFilterMutate({
          createPayload: createLiabilityWaiverFilterPayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildLiabilityWaiverFilterDirtyPatch(
        dirtyFields,
        value,
      );
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertLiabilityWaiverFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.410.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      onDeleteUnsavedFilter?.();
      return;
    }

    deleteLiabilityWaiverFilterMutate(watchedFilterValue.id);
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.410.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.410.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>

        <LiabilityWaiverRadioGroup
          id={waiverFieldId}
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
                ? t("filters.410.actions.update")
                : t("filters.410.actions.save")
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
