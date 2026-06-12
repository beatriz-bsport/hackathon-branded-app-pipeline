import { useId } from "react";

import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeleteBookingMilestoneFilterMutation } from "#src/api/use-delete-booking-milestone-filter-mutation";
import { useUpsertBookingMilestoneFilterMutation } from "#src/api/use-upsert-booking-milestone-filter-mutation";
import { BookingMilestoneValueField } from "#src/components/filters/booking-milestone/components/booking-milestone-value-field";
import { mapBookingMilestoneFilterToFormValue } from "#src/components/filters/booking-milestone/mappers/api-to-form-value";
import { buildDirtyPatchPayload } from "#src/components/filters/booking-milestone/mappers/build-dirty-patch";
import { createBookingMilestonePayload } from "#src/components/filters/booking-milestone/mappers/form-value-to-create-payload";
import { bookingMilestoneFilterSchema } from "#src/components/filters/booking-milestone/schema";
import type { BookingMilestoneFilterCardProps } from "#src/components/filters/booking-milestone/types";
import { TotalBookingSubFiltersArea } from "#src/components/filters/total-booking/components/total-booking-sub-filters-area";
import { useTranslation } from "#src/utils/i18n";

export const BookingMilestoneFilterCard = ({
  smartlistId,
  companyId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: BookingMilestoneFilterCardProps) => {
  const { t } = useTranslation("filters");
  const baseId = useId();
  const fieldIds = {
    milestoneValue: `${baseId}-milestone-value`,
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
    schema: bookingMilestoneFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { errors, dirtyFields, isDirty } = methods.formState;

  const { upsertBookingMilestoneFilterMutate, isLoading: isSaving } =
    useUpsertBookingMilestoneFilterMutation(smartlistId, {
      onSuccess: (savedFilter) => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.21.toasts.saveSuccess"),
          buttonIcon: "x-close",
        });
        methods.reset(mapBookingMilestoneFilterToFormValue(savedFilter));
        onSaveSuccess?.();
      },
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.21.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteBookingMilestoneFilterMutate, isLoading: isDeleting } =
    useDeleteBookingMilestoneFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.21.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertBookingMilestoneFilterMutate({
          createPayload: createBookingMilestonePayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildDirtyPatchPayload(dirtyFields, value);
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertBookingMilestoneFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.21.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      onDeleteUnsavedFilter?.();
      return;
    }

    deleteBookingMilestoneFilterMutate(watchedFilterValue.id);
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.21.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.21.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>

        <BookingMilestoneValueField
          id={fieldIds.milestoneValue}
          value={watchedFilterValue.value}
          errorText={
            errors.value?.message ? String(errors.value.message) : undefined
          }
          onChange={(nextValue) =>
            methods.setValue("value", nextValue, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          disabled={isSaving || isDeleting}
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

        <div className="flex justify-end">
          <Button
            label={t("filters.21.actions.save")}
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
