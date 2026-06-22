import { useId } from "react";

import { getCurrencyCode } from "@bsport/currency";
import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeleteBasketAbandonmentFilterMutation } from "#src/api/use-delete-basket-abandonment-filter-mutation";
import { useUpsertBasketAbandonmentFilterMutation } from "#src/api/use-upsert-basket-abandonment-filter-mutation";
import { FilterCardSaveButton } from "#src/components/filters/shared/filter-card-save-button";
import { NumericComparatorFilter } from "#src/components/primitive-filters/numeric-comparator-filter/numeric-comparator-filter";
import { useRegisterSavedFilterDraft } from "#src/hooks/use-register-saved-filter-draft";
import { useTranslation } from "#src/utils/i18n";

import { mapBasketAbandonmentFilterToFormValue } from "../mappers/api-to-form-value";
import { buildDirtyPatchPayload } from "../mappers/build-dirty-patch";
import { createBasketAbandonmentFilterPayload } from "../mappers/form-value-to-create-payload";
import { basketAbandonmentFilterSchema } from "../schema";
import type { BasketAbandonmentFilterCardProps } from "../types";
import { BasketAbandonmentSubFiltersArea } from "./basket-abandonment-sub-filters-area";

/**
 * Single abandoned basket filter card. Owns form lifecycle (create / patch / delete).
 */
export const BasketAbandonmentFilterCard = ({
  smartlistId,
  filterValue,
  cleanDraftComponent,
}: BasketAbandonmentFilterCardProps) => {
  const baseId = useId();
  const fieldIds = {
    basketValue: `${baseId}-basket-value`,
    abandonmentDate: `${baseId}-abandonment-date`,
  };
  const { t } = useTranslation("filters");

  const methods = useFormController({
    mode: "onBlur",
    schema: basketAbandonmentFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { errors, dirtyFields, isDirty } = methods.formState;
  useRegisterSavedFilterDraft(watchedFilterValue.id, isDirty);

  const { upsertBasketAbandonmentFilterMutate, isLoading: isSaving } =
    useUpsertBasketAbandonmentFilterMutation(smartlistId, {
      onSuccess: (savedFilter) => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.20.toasts.saveSuccess"),
          buttonIcon: "x-close",
        });
        methods.reset(mapBasketAbandonmentFilterToFormValue(savedFilter));
        cleanDraftComponent?.();
      },
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.20.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteBasketAbandonmentFilterMutate, isLoading: isDeleting } =
    useDeleteBasketAbandonmentFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.20.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const isSavedFilter = Boolean(watchedFilterValue.id);

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertBasketAbandonmentFilterMutate({
          createPayload: createBasketAbandonmentFilterPayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildDirtyPatchPayload(dirtyFields, value);
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertBasketAbandonmentFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.20.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      cleanDraftComponent?.();
      return;
    }

    deleteBasketAbandonmentFilterMutate(watchedFilterValue.id);
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.20.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.20.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>

        <NumericComparatorFilter
          id={fieldIds.basketValue}
          value={watchedFilterValue.basketValue}
          suffix={getCurrencyCode().toUpperCase()}
          disabled={isSaving || isDeleting}
          errors={{
            operator: errors.basketValue?.operator?.message
              ? String(errors.basketValue.operator.message)
              : undefined,
            firstValue: errors.basketValue?.firstValue?.message
              ? String(errors.basketValue.firstValue.message)
              : undefined,
            secondValue: errors.basketValue?.secondValue?.message
              ? String(errors.basketValue.secondValue.message)
              : undefined,
          }}
          onChange={(nextValue) => {
            methods.setValue("basketValue", nextValue, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        />

        <BasketAbandonmentSubFiltersArea
          fieldIds={fieldIds}
          watchedFilterValue={watchedFilterValue}
          errors={errors}
          setValue={methods.setValue}
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
