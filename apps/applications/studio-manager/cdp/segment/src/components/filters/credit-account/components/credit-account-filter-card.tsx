import { useId } from "react";

import { getCurrencyCode } from "@bsport/currency";
import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeleteCreditAccountFilterMutation } from "#src/api/use-delete-credit-account-filter-mutation";
import { useUpsertCreditAccountFilterMutation } from "#src/api/use-upsert-credit-account-filter-mutation";
import { FilterCardSaveButton } from "#src/components/filters/shared/filter-card-save-button";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import { NumericComparatorFilter } from "#src/components/primitive-filters/numeric-comparator-filter/numeric-comparator-filter";
import type { NumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/types";
import { useRegisterSavedFilterDraft } from "#src/hooks/use-register-saved-filter-draft";
import { useTranslation } from "#src/utils/i18n";

import { isCreditAccountNumberType } from "../constants";
import { mapCreditAccountFilterToFormValue } from "../mappers/api-to-form-value";
import { buildCreditAccountFilterDirtyPatch } from "../mappers/build-dirty-patch";
import { toCreatePayload } from "../mappers/form-value-to-create-payload";
import { creditAccountFilterSchema } from "../schema";
import type { CreditAccountFilterCardProps } from "../types";

export const CreditAccountFilterCard = ({
  smartlistId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: CreditAccountFilterCardProps) => {
  const { t } = useTranslation("filters");
  const baseId = useId();
  const fieldIds = {
    comparator: `${baseId}-comparator`,
  };

  const methods = useFormController({
    mode: "onBlur",
    schema: creditAccountFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { errors, dirtyFields, isDirty } = methods.formState;
  useRegisterSavedFilterDraft(watchedFilterValue.id, isDirty);
  const isSavedFilter = Boolean(watchedFilterValue.id);

  const { upsertCreditAccountFilterMutate, isLoading: isSaving } =
    useUpsertCreditAccountFilterMutation(smartlistId, {
      onSuccess: (savedFilter) => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.1.toasts.saveSuccess"),
          buttonIcon: "x-close",
        });
        methods.reset(mapCreditAccountFilterToFormValue(savedFilter));
        onSaveSuccess?.();
      },
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.1.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteCreditAccountFilterMutate, isLoading: isDeleting } =
    useDeleteCreditAccountFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.1.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertCreditAccountFilterMutate({
          createPayload: toCreatePayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildCreditAccountFilterDirtyPatch(
        dirtyFields,
        value,
      );
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertCreditAccountFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.1.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      onDeleteUnsavedFilter?.();
      return;
    }

    deleteCreditAccountFilterMutate(watchedFilterValue.id);
  };

  const comparatorValue: NumericComparatorFilterValue = {
    operator: watchedFilterValue.type,
    firstValue: watchedFilterValue.value,
    secondValue: watchedFilterValue.secondValue,
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.1.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.1.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>
        <NumericComparatorFilter
          id={fieldIds.comparator}
          value={comparatorValue}
          suffix={getCurrencyCode().toUpperCase()}
          errors={{
            operator: errors.type?.message
              ? String(errors.type.message)
              : undefined,
            firstValue: errors.value?.message
              ? String(errors.value.message)
              : undefined,
            secondValue: errors.secondValue?.message
              ? String(errors.secondValue.message)
              : undefined,
          }}
          onChange={(nextValue) => {
            if (!isCreditAccountNumberType(nextValue.operator)) {
              return;
            }
            methods.setValue("type", nextValue.operator, {
              shouldDirty: true,
            });
            methods.setValue("value", nextValue.firstValue ?? 0, {
              shouldDirty: true,
              shouldValidate: true,
            });
            methods.setValue(
              "secondValue",
              nextValue.operator === NUMERIC_COMPARATOR_OPERATORS.between
                ? nextValue.secondValue
                : null,
              {
                shouldDirty: true,
                shouldValidate: true,
              },
            );
          }}
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
