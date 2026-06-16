import { useId } from "react";

import { getCurrencyCode } from "@bsport/currency";
import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeletePurchaseHistoryFilterMutation } from "#src/api/use-delete-purchase-history-filter-mutation";
import { useUpsertPurchaseHistoryFilterMutation } from "#src/api/use-upsert-purchase-history-filter-mutation";
import { NumericComparatorFilter } from "#src/components/primitive-filters/numeric-comparator-filter/numeric-comparator-filter";
import { useRegisterSavedFilterDraft } from "#src/hooks/use-register-saved-filter-draft";
import { useTranslation } from "#src/utils/i18n";

import { mapPurchaseHistoryFilterToFormValue } from "../mappers/api-to-form-value";
import { buildDirtyPatchPayload } from "../mappers/build-dirty-patch";
import { createPurchaseHistoryFilterPayload } from "../mappers/form-value-to-create-payload";
import { purchaseHistoryFilterSchema } from "../schema";
import type { PurchaseHistoryFilterCardProps } from "../types";
import { PurchaseHistorySubFiltersArea } from "./purchase-history-sub-filters-area";
import { SpentOnField } from "./spent-on-field";

/**
 * Single purchase history filter card. Owns form lifecycle (create / patch / delete).
 */
export const PurchaseHistoryFilterCard = ({
  smartlistId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: PurchaseHistoryFilterCardProps) => {
  const baseId = useId();
  const fieldIds = {
    totalSpent: `${baseId}-total-spent`,
    spentOn: `${baseId}-spent-on`,
    purchaseDate: `${baseId}-purchase-date`,
  };
  const { t } = useTranslation("filters");

  const methods = useFormController({
    mode: "onBlur",
    schema: purchaseHistoryFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { errors, dirtyFields, isDirty } = methods.formState;
  useRegisterSavedFilterDraft(watchedFilterValue.id, isDirty);

  const { upsertPurchaseHistoryFilterMutate, isLoading: isSaving } =
    useUpsertPurchaseHistoryFilterMutation(smartlistId, {
      onSuccess: (savedFilter) => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.24.toasts.saveSuccess"),
          buttonIcon: "x-close",
        });
        methods.reset(mapPurchaseHistoryFilterToFormValue(savedFilter));
        onSaveSuccess?.();
      },
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.24.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deletePurchaseHistoryFilterMutate, isLoading: isDeleting } =
    useDeletePurchaseHistoryFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.24.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const isSavedFilter = Boolean(watchedFilterValue.id);

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertPurchaseHistoryFilterMutate({
          createPayload: createPurchaseHistoryFilterPayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildDirtyPatchPayload(dirtyFields, value);
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertPurchaseHistoryFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.24.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      onDeleteUnsavedFilter?.();
      return;
    }

    deletePurchaseHistoryFilterMutate(watchedFilterValue.id);
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.24.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.24.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>

        <NumericComparatorFilter
          id={fieldIds.totalSpent}
          value={watchedFilterValue.totalSpent}
          suffix={getCurrencyCode().toUpperCase()}
          disabled={isSaving || isDeleting}
          errors={{
            operator: errors.totalSpent?.operator?.message
              ? String(errors.totalSpent.operator.message)
              : undefined,
            firstValue: errors.totalSpent?.firstValue?.message
              ? String(errors.totalSpent.firstValue.message)
              : undefined,
            secondValue: errors.totalSpent?.secondValue?.message
              ? String(errors.totalSpent.secondValue.message)
              : undefined,
          }}
          onChange={(nextValue) => {
            methods.setValue("totalSpent", nextValue, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        />

        <SpentOnField
          id={fieldIds.spentOn}
          value={watchedFilterValue.spentOn}
          disabled={isSaving || isDeleting}
          errorText={
            errors.spentOn?.message ? String(errors.spentOn.message) : undefined
          }
          onChange={(nextValue) => {
            methods.setValue("spentOn", nextValue, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        />

        <PurchaseHistorySubFiltersArea
          fieldIds={fieldIds}
          watchedFilterValue={watchedFilterValue}
          errors={errors}
          setValue={methods.setValue}
        />

        <div className="flex justify-end">
          <Button
            label={t("filters.24.actions.save")}
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
