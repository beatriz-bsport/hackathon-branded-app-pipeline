import { useId } from "react";

import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeleteTotalAppointmentsFilterMutation } from "#src/api/use-delete-total-appointments-filter-mutation";
import { useUpsertTotalAppointmentsFilterMutation } from "#src/api/use-upsert-total-appointments-filter-mutation";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import { NumericComparatorFilter } from "#src/components/primitive-filters/numeric-comparator-filter/numeric-comparator-filter";
import type { NumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/types";
import { useTranslation } from "#src/utils/i18n";

import { isTotalAppointmentsNumberType } from "../constants";
import { mapTotalAppointmentsFilterToFormValue } from "../mappers/api-to-form-value";
import { buildDirtyPatchPayload } from "../mappers/build-dirty-patch";
import { createTotalAppointmentsPayload } from "../mappers/form-value-to-create-payload";
import { totalAppointmentsNumberFilterSchema } from "../schema";
import type { TotalAppointmentsNumberFilterCardProps } from "../types";
import { TotalAppointmentsSubFiltersArea } from "./total-appointments-sub-filters-area";

/**
 * Total appointments filter card (filter identifier 26).
 */
export const TotalAppointmentsNumberFilterCard = ({
  smartlistId,
  companyId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: TotalAppointmentsNumberFilterCardProps) => {
  const { t } = useTranslation("filters");
  const baseId = useId();
  const fieldIds = {
    comparator: `${baseId}-comparator`,
    bookingDate: `${baseId}-booking-date`,
    bookingHourRange: `${baseId}-booking-hour-range`,
    coach: `${baseId}-coach`,
    establishment: `${baseId}-establishment`,
    appointmentPass: `${baseId}-appointment-pass`,
    appointment: `${baseId}-appointment`,
  };

  const methods = useFormController({
    mode: "onBlur",
    schema: totalAppointmentsNumberFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { errors, isDirty, dirtyFields } = methods.formState;

  const { upsertTotalAppointmentsFilterMutate, isLoading: isSaving } =
    useUpsertTotalAppointmentsFilterMutation(smartlistId, {
      onSuccess: (savedFilter) => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.26.toasts.saveSuccess"),
          buttonIcon: "x-close",
        });
        methods.reset(mapTotalAppointmentsFilterToFormValue(savedFilter));
        onSaveSuccess?.();
      },
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.26.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteTotalAppointmentsFilterMutate, isLoading: isDeleting } =
    useDeleteTotalAppointmentsFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.26.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertTotalAppointmentsFilterMutate({
          createPayload: createTotalAppointmentsPayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildDirtyPatchPayload(dirtyFields, value);
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertTotalAppointmentsFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.26.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      onDeleteUnsavedFilter?.();
      return;
    }

    deleteTotalAppointmentsFilterMutate(watchedFilterValue.id);
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
            {t("filters.26.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.26.actions.deleteFilter")}
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
          suffix={t("filters.26.fields.totalAppointmentSuffix")}
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
            if (!isTotalAppointmentsNumberType(nextValue.operator)) {
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

        <TotalAppointmentsSubFiltersArea
          fieldIds={{
            bookingDate: fieldIds.bookingDate,
            bookingHourRange: fieldIds.bookingHourRange,
            coach: fieldIds.coach,
            establishment: fieldIds.establishment,
            appointmentPass: fieldIds.appointmentPass,
            appointment: fieldIds.appointment,
          }}
          companyId={companyId}
          watchedFilterValue={watchedFilterValue}
          errors={errors}
          setValue={methods.setValue}
        />

        <div className="flex justify-end">
          <Button
            label={t("filters.26.actions.save")}
            size="sm"
            color="main"
            intent="default"
            loading={isSaving}
            disabled={isSaving || isDeleting || !isDirty}
            onClick={() => void handleSave()}
          />
        </div>
      </div>
    </Card>
  );
};
