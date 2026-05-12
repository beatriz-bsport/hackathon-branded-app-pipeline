import { useId } from "react";

import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeletePaymentPackFilterMutation } from "#src/api/use-delete-payment-pack-filter-mutation";
import { useUpsertPaymentPackFilterMutation } from "#src/api/use-upsert-payment-pack-filter-mutation";
import { useTranslation } from "#src/utils/i18n";

import { buildDirtyPatchPayload } from "../mappers/build-dirty-patch";
import { toCreatePayload } from "../mappers/form-value-to-create-payload";
import { passesFilterSchema } from "../schema";
import type { PassesFilterCardProps } from "../types";
import { PassOwnershipField } from "./pass-ownership-field";
import { PassSelectionField } from "./pass-selection-field";
import { PassesFilterSubFiltersArea } from "./passes-filter-sub-filters-area";

/**
 * Single pass filter card. Owns its form lifecycle (create / dirty patch /
 * delete) and delegates rendering of base fields to dedicated components.
 *
 * Sub-filter UI is driven by `REGISTERED_PASS_SUB_FILTERS` and the
 * `PassesFilterSubFiltersArea` shell.
 */
export const PassesFilterCard = ({
  smartlistId,
  filterValue,
  passOptions,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: PassesFilterCardProps) => {
  const baseId = useId();
  const fieldIds = {
    ownership: `${baseId}-ownership`,
    selectedPaymentPackIds: `${baseId}-selected-payment-pack-ids`,
    purchaseDate: `${baseId}-purchase-date`,
    expirationDate: `${baseId}-expiration-date`,
  };

  const { t } = useTranslation("campaign-filters");

  const { upsertPaymentPackFilterMutate, isLoading: isSaving } =
    useUpsertPaymentPackFilterMutation(smartlistId, {
      onSuccess: () => {
        onSaveSuccess?.();
      },
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.19.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });
  const { deletePaymentPackFilterMutate, isLoading: isDeleting } =
    useDeletePaymentPackFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.19.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const methods = useFormController({
    mode: "onBlur",
    schema: passesFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { errors, dirtyFields } = methods.formState;

  const selectedPassesInvalid =
    !watchedFilterValue.selectAllPaymentPacks &&
    watchedFilterValue.selectedPaymentPackIds.length === 0;

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertPaymentPackFilterMutate({
          createPayload: toCreatePayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildDirtyPatchPayload(dirtyFields, value);
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertPaymentPackFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.19.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      onDeleteUnsavedFilter?.();
      return;
    }

    deletePaymentPackFilterMutate(watchedFilterValue.id);
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.19.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.19.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>

        <PassOwnershipField
          id={fieldIds.ownership}
          value={watchedFilterValue.ownership}
          onChange={(nextValue) =>
            methods.setValue("ownership", nextValue, { shouldDirty: true })
          }
        />

        <PassSelectionField
          id={fieldIds.selectedPaymentPackIds}
          value={watchedFilterValue.selectedPaymentPackIds}
          passOptions={passOptions}
          disabled={watchedFilterValue.selectAllPaymentPacks}
          errorText={
            errors.selectedPaymentPackIds?.message
              ? String(errors.selectedPaymentPackIds.message)
              : undefined
          }
          onChange={(nextSelectedIds) =>
            methods.setValue("selectedPaymentPackIds", nextSelectedIds, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />

        <PassesFilterSubFiltersArea
          fieldIds={fieldIds}
          watchedFilterValue={watchedFilterValue}
          errors={errors}
          setValue={methods.setValue}
          selectedPassesInvalid={selectedPassesInvalid}
        />

        <div className="flex justify-end">
          <Button
            label={t("filters.19.actions.save")}
            size="sm"
            color="main"
            intent="default"
            loading={isSaving}
            disabled={isSaving || isDeleting}
            onClick={() => void handleSave()}
          />
        </div>
      </div>
    </Card>
  );
};
