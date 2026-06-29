import { useId } from "react";

import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeleteTotalBookingFilterMutation } from "#src/api/use-delete-total-booking-filter-mutation";
import { useUpsertTotalBookingFilterMutation } from "#src/api/use-upsert-total-booking-filter-mutation";
import { FilterCardSaveButton } from "#src/components/filters/shared/filter-card-save-button";
import { DEFAULT_BOOKING_NUMBER_FIRST_VALUE } from "#src/components/filters/total-booking/default-value";
import { NumericComparatorFilter } from "#src/components/primitive-filters/numeric-comparator-filter/numeric-comparator-filter";
import type { NumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/types";
import { useRegisterSavedFilterDraft } from "#src/hooks/use-register-saved-filter-draft";
import { useTranslation } from "#src/utils/i18n";

import { isTotalBookingNumberType } from "../constants";
import { mapTotalBookingFilterToFormValue } from "../mappers/api-to-form-value";
import { buildDirtyPatchPayload } from "../mappers/build-dirty-patch";
import { createTotalBookingPayload } from "../mappers/form-value-to-create-payload";
import { totalBookingNumberFilterSchema } from "../schema";
import type { TotalBookingNumberFilterCardProps } from "../types";
import { TotalBookingSubFiltersArea } from "./total-booking-sub-filters-area";

export const TotalBookingNumberFilterCard = ({
  smartlistId,
  companyId,
  filterValue,
  cleanDraftComponent,
}: TotalBookingNumberFilterCardProps) => {
  const { t } = useTranslation("filters");
  const baseId = useId();
  const fieldIds = {
    comparator: `${baseId}-comparator`,
    activity: `${baseId}-activity`,
    establishment: `${baseId}-establishment`,
    coach: `${baseId}-coach`,
    paymentPack: `${baseId}-payment-pack`,
    bookingDate: `${baseId}-booking-date`,
    bookingHourRange: `${baseId}-booking-hour-range`,
    level: `${baseId}-level`,
    attendanceMode: `${baseId}-attendance-mode`,
  };

  const methods = useFormController({
    mode: "onBlur",
    schema: totalBookingNumberFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { errors, dirtyFields, isDirty } = methods.formState;
  useRegisterSavedFilterDraft(watchedFilterValue.id, isDirty);
  const isSavedFilter = Boolean(watchedFilterValue.id);

  const { upsertTotalBookingFilterMutate, isLoading: isSaving } =
    useUpsertTotalBookingFilterMutation(smartlistId, {
      onSuccess: (savedFilter) => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.22.toasts.saveSuccess"),
          buttonIcon: "x-close",
        });
        methods.reset(mapTotalBookingFilterToFormValue(savedFilter));
        cleanDraftComponent?.();
      },
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.22.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteTotalBookingFilterMutate, isLoading: isDeleting } =
    useDeleteTotalBookingFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.22.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertTotalBookingFilterMutate({
          createPayload: createTotalBookingPayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildDirtyPatchPayload(dirtyFields, value);
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertTotalBookingFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.22.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      cleanDraftComponent?.();
      return;
    }

    deleteTotalBookingFilterMutate(watchedFilterValue.id);
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
            {t("filters.22.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.22.actions.deleteFilter")}
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
          suffix={t("filters.22.fields.totalSessionSuffix")}
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
            if (!isTotalBookingNumberType(nextValue.operator)) {
              return;
            }
            methods.setValue("type", nextValue.operator, {
              shouldDirty: true,
            });
            methods.setValue(
              "value",
              nextValue.firstValue ?? DEFAULT_BOOKING_NUMBER_FIRST_VALUE,
              {
                shouldDirty: true,
                shouldValidate: true,
              },
            );
            methods.setValue("secondValue", nextValue.secondValue, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        />

        <TotalBookingSubFiltersArea
          fieldIds={{
            activity: fieldIds.activity,
            establishment: fieldIds.establishment,
            coach: fieldIds.coach,
            paymentPack: fieldIds.paymentPack,
            bookingDate: fieldIds.bookingDate,
            bookingHourRange: fieldIds.bookingHourRange,
            level: fieldIds.level,
            attendanceMode: fieldIds.attendanceMode,
          }}
          companyId={companyId}
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
