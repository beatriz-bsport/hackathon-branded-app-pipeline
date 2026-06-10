import { useId } from "react";

import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeleteAgeFilterMutation } from "#src/api/use-delete-age-filter-mutation";
import { useUpsertAgeFilterMutation } from "#src/api/use-upsert-age-filter-mutation";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import { NumericComparatorFilter } from "#src/components/primitive-filters/numeric-comparator-filter/numeric-comparator-filter";
import type { NumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/types";
import { TimedInfoPopover } from "#src/components/timed-info-popover";
import { useTranslation } from "#src/utils/i18n";

import { isAgeFilterNumberType } from "../constants";
import { buildAgeFilterDirtyPatch } from "../mappers/build-dirty-patch";
import { toCreatePayload } from "../mappers/form-value-to-create-payload";
import { ageFilterSchema } from "../schema";
import type { AgeFilterCardProps } from "../types";
import { getAgeYearSuffix } from "../utils";

export const AgeFilterCard = ({
  smartlistId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: AgeFilterCardProps) => {
  const { t } = useTranslation("filters");
  const baseId = useId();
  const fieldIds = {
    comparator: `${baseId}-comparator`,
  };

  const methods = useFormController({
    mode: "onBlur",
    schema: ageFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { errors, dirtyFields, isDirty } = methods.formState;

  const { upsertAgeFilterMutate, isLoading: isSaving } =
    useUpsertAgeFilterMutation(smartlistId, {
      onSuccess: () => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.101.toasts.saveSuccess"),
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
          title: error.message || t("filters.101.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteAgeFilterMutate, isLoading: isDeleting } =
    useDeleteAgeFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.101.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertAgeFilterMutate({
          createPayload: toCreatePayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildAgeFilterDirtyPatch(dirtyFields, value);
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertAgeFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.101.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      onDeleteUnsavedFilter?.();
      return;
    }

    deleteAgeFilterMutate(watchedFilterValue.id);
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
          <div className="flex items-center gap-xxs">
            <Body size="lg" weight="stronger">
              {t("filters.101.title")}
            </Body>
            <TimedInfoPopover
              label={t("filters.101.help.infoLabel")}
              placement="bottom-left"
            >
              <Body size="sm">{t("filters.101.help.content")}</Body>
            </TimedInfoPopover>
          </div>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.101.actions.deleteFilter")}
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
          getSuffixForValue={(count) => getAgeYearSuffix(t, count)}
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
            if (!isAgeFilterNumberType(nextValue.operator)) {
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

        <div className="flex justify-end">
          <Button
            label={t("filters.101.actions.save")}
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
