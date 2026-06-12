import { useId } from "react";

import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeletePrivatePassFilterMutation } from "#src/api/use-delete-private-pass-filter-mutation";
import { useUpsertPrivatePassFilterMutation } from "#src/api/use-upsert-private-pass-filter-mutation";
import { PassesFilterSubFiltersArea } from "#src/components/filters/passes-filter/components/passes-filter-sub-filters-area";
import { useTranslation } from "#src/utils/i18n";

import { mapPrivatePassFilterToFormValue } from "../mappers/api-to-form-value";
import { buildAppointmentPassDirtyPatchPayload } from "../mappers/build-dirty-patch";
import { createAppointmentPassPayload } from "../mappers/form-value-to-create-payload";
import { appointmentPassFilterSchema } from "../schema";
import type { AppointmentPassFilterCardProps } from "../types";
import { AppointmentPassOwnershipField } from "./appointment-pass-ownership-field";
import { AppointmentPassSelectionField } from "./appointment-pass-selection-field";

/**
 * Appointment pass filter card (identifier 25). Reuses pass sub-filter UI and
 * modules; mappers target the `private_pass` smartlist API.
 */
export const AppointmentPassFilterCard = ({
  smartlistId,
  filterValue,
  passOptions,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: AppointmentPassFilterCardProps) => {
  const baseId = useId();
  const fieldIds = {
    ownership: `${baseId}-ownership`,
    selectedPaymentPackIds: `${baseId}-selected-appointment-pass-ids`,
    purchaseDate: `${baseId}-purchase-date`,
    expirationDate: `${baseId}-expiration-date`,
    creditLeft: `${baseId}-credit-left`,
  };

  const { t } = useTranslation("filters");
  const methods = useFormController({
    mode: "onBlur",
    schema: appointmentPassFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { errors, dirtyFields, isDirty } = methods.formState;

  const { upsertPrivatePassFilterMutate, isLoading: isSaving } =
    useUpsertPrivatePassFilterMutation(smartlistId, {
      onSuccess: (savedFilter) => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.25.toasts.saveSuccess"),
          buttonIcon: "x-close",
        });
        methods.reset(mapPrivatePassFilterToFormValue(savedFilter));
        onSaveSuccess?.();
      },
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.25.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deletePrivatePassFilterMutate, isLoading: isDeleting } =
    useDeletePrivatePassFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.25.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const selectedPassesInvalid =
    !watchedFilterValue.selectAllPaymentPacks &&
    watchedFilterValue.selectedPaymentPackIds.length === 0;

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertPrivatePassFilterMutate({
          createPayload: createAppointmentPassPayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildAppointmentPassDirtyPatchPayload(
        dirtyFields,
        value,
      );
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertPrivatePassFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.25.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      onDeleteUnsavedFilter?.();
      return;
    }

    deletePrivatePassFilterMutate(watchedFilterValue.id);
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.25.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.25.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>

        <AppointmentPassOwnershipField
          id={fieldIds.ownership}
          value={watchedFilterValue.ownership}
          onChange={(nextValue) =>
            methods.setValue("ownership", nextValue, { shouldDirty: true })
          }
        />

        <AppointmentPassSelectionField
          id={fieldIds.selectedPaymentPackIds}
          value={watchedFilterValue.selectedPaymentPackIds}
          passOptions={passOptions}
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
            label={t("filters.25.actions.save")}
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
