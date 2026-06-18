import { useId } from "react";

import { SMARTLIST_REFERRER_COMPARATOR } from "@bsport/api-cdp/smartlist";
import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeleteReferrerFilterMutation } from "#src/api/use-delete-referrer-filter-mutation";
import { useUpsertReferrerFilterMutation } from "#src/api/use-upsert-referrer-filter-mutation";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import { NumericComparatorFilter } from "#src/components/primitive-filters/numeric-comparator-filter/numeric-comparator-filter";
import type { NumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/types";
import { useTranslation } from "#src/utils/i18n";

import {
  isReferrerComparatorOperator,
  referrerComparatorToOperatorMap,
  referrerOperatorToComparatorMap,
} from "../constants";
import { buildReferrerFilterDirtyPatch } from "../mappers/build-dirty-patch";
import { toCreatePayload } from "../mappers/form-value-to-create-payload";
import { referrerFilterSchema } from "../schema";
import type { ReferrerFilterCardProps } from "../types";

/**
 * Referrer filter card (filter identifier 29).
 * Renders the primary referrals count comparator; sub-filters are preserved in form state only.
 */
export const ReferrerFilterCard = ({
  smartlistId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: ReferrerFilterCardProps) => {
  const { t } = useTranslation("filters");
  const baseId = useId();
  const fieldIds = {
    comparator: `${baseId}-comparator`,
  };

  const methods = useFormController({
    mode: "onBlur",
    schema: referrerFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { errors, dirtyFields, isDirty } = methods.formState;

  const { upsertReferrerFilterMutate, isLoading: isSaving } =
    useUpsertReferrerFilterMutation(smartlistId, {
      onSuccess: () => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.29.toasts.saveSuccess"),
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
          title: error.message || t("filters.29.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteReferrerFilterMutate, isLoading: isDeleting } =
    useDeleteReferrerFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.29.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertReferrerFilterMutate({
          createPayload: toCreatePayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildReferrerFilterDirtyPatch(
        dirtyFields,
        value,
      );
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertReferrerFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.29.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      onDeleteUnsavedFilter?.();
      return;
    }

    deleteReferrerFilterMutate(watchedFilterValue.id);
  };

  const comparatorOperator =
    referrerComparatorToOperatorMap[watchedFilterValue.comparator_referred] ??
    referrerComparatorToOperatorMap[SMARTLIST_REFERRER_COMPARATOR.GTE];

  const comparatorValue: NumericComparatorFilterValue = {
    operator: comparatorOperator,
    firstValue: watchedFilterValue.value_referred,
    secondValue: watchedFilterValue.value_second_referred,
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.29.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.29.actions.deleteFilter")}
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
          suffix={t("filters.29.fields.referralsSuffix", {
            count: watchedFilterValue.value_referred,
          })}
          errors={{
            operator: errors.comparator_referred?.message
              ? String(errors.comparator_referred.message)
              : undefined,
            firstValue: errors.value_referred?.message
              ? String(errors.value_referred.message)
              : undefined,
            secondValue: errors.value_second_referred?.message
              ? String(errors.value_second_referred.message)
              : undefined,
          }}
          onChange={(nextValue) => {
            if (!isReferrerComparatorOperator(nextValue.operator)) {
              return;
            }
            methods.setValue(
              "comparator_referred",
              referrerOperatorToComparatorMap[nextValue.operator],
              {
                shouldDirty: true,
              },
            );
            methods.setValue("value_referred", nextValue.firstValue ?? 0, {
              shouldDirty: true,
              shouldValidate: true,
            });
            methods.setValue(
              "value_second_referred",
              nextValue.operator === NUMERIC_COMPARATOR_OPERATORS.between
                ? (nextValue.secondValue ?? 0)
                : 0,
              {
                shouldDirty: true,
                shouldValidate: true,
              },
            );
          }}
        />

        <div className="flex justify-end">
          <Button
            label={t("filters.29.actions.save")}
            size="sm"
            color="main"
            intent="default"
            iconLeft="check"
            loading={isSaving}
            disabled={isSaving || isDeleting || !isDirty}
            onClick={() => void handleSave()}
          />
        </div>
      </div>
    </Card>
  );
};
