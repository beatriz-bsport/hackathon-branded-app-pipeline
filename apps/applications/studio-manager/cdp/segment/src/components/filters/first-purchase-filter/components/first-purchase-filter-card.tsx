import { useId } from "react";

import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeleteFirstPurchaseFilterMutation } from "#src/api/use-delete-first-purchase-filter-mutation";
import { useUpsertFirstPurchaseFilterMutation } from "#src/api/use-upsert-first-purchase-filter-mutation";
import { useTranslation } from "#src/utils/i18n";

import { firstPurchaseStatusToApi } from "../constants";
import { buildDirtyPatchPayload } from "../mappers/build-dirty-patch";
import { createFirstPurchaseFilterPayload } from "../mappers/form-value-to-create-payload";
import { firstPurchaseFilterSchema } from "../schema";
import type { FirstPurchaseFilterCardProps } from "../types";
import { FirstPurchaseStatusField } from "./first-purchase-status-field";

/**
 * Single first purchase filter card. Owns form lifecycle (create / patch / delete).
 */
export const FirstPurchaseFilterCard = ({
  smartlistId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: FirstPurchaseFilterCardProps) => {
  const statusFieldId = `${useId()}-first-purchase-status`;
  const { t } = useTranslation("filters");

  const methods = useFormController({
    mode: "onBlur",
    schema: firstPurchaseFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { dirtyFields } = methods.formState;

  const { upsertFirstPurchaseFilterMutate, isLoading: isSaving } =
    useUpsertFirstPurchaseFilterMutation(smartlistId, {
      onSuccess: () => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.28.toasts.saveSuccess"),
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
          title: error.message || t("filters.28.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteFirstPurchaseFilterMutate, isLoading: isDeleting } =
    useDeleteFirstPurchaseFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.28.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const isDirty = Object.keys(dirtyFields).length > 0;
  const isSavedFilter = Boolean(watchedFilterValue.id);
  const showAnyFirstPurchaseCopy = firstPurchaseStatusToApi(
    watchedFilterValue.firstPurchaseStatus,
  );

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertFirstPurchaseFilterMutate({
          createPayload: createFirstPurchaseFilterPayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildDirtyPatchPayload(dirtyFields, value);
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertFirstPurchaseFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.28.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      onDeleteUnsavedFilter?.();
      return;
    }

    deleteFirstPurchaseFilterMutate(watchedFilterValue.id);
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.28.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.28.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>

        <FirstPurchaseStatusField
          id={statusFieldId}
          value={watchedFilterValue.firstPurchaseStatus}
          disabled={isSaving || isDeleting}
          onChange={(nextStatus) =>
            methods.setValue("firstPurchaseStatus", nextStatus, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />

        {showAnyFirstPurchaseCopy ? (
          <Body size="sm" color="weak">
            {t("filters.28.fields.anyFirstPurchase")}
          </Body>
        ) : null}

        <div className="flex justify-end">
          <Button
            label={t("filters.28.actions.save")}
            size="sm"
            color="main"
            intent="default"
            iconLeft="check"
            loading={isSaving}
            disabled={isSaving || isDeleting || (isSavedFilter && !isDirty)}
            onClick={() => void handleSave()}
          />
        </div>
      </div>
    </Card>
  );
};
