import { useId } from "react";

import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeletePaymentMethodFilterMutation } from "#src/api/use-delete-payment-method-filter-mutation";
import { useUpsertPaymentMethodFilterMutation } from "#src/api/use-upsert-payment-method-filter-mutation";
import { useTranslation } from "#src/utils/i18n";

import { ownsPaymentMethodToApi } from "../constants";
import { buildDirtyPatchPayload } from "../mappers/build-dirty-patch";
import { createPaymentMethodFilterPayload } from "../mappers/form-value-to-create-payload";
import { paymentMethodFilterSchema } from "../schema";
import type { PaymentMethodFilterCardProps } from "../types";
import { OwnsPaymentMethodRadioGroup } from "./owns-payment-method-radio-group";
import { PaymentMethodSubFiltersArea } from "./payment-method-sub-filters-area";

/**
 * Single saved payment method filter card. Owns form lifecycle (create / patch / delete).
 */
export const PaymentMethodFilterCard = ({
  smartlistId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: PaymentMethodFilterCardProps) => {
  const baseId = useId();
  const fieldIds = {
    ownsPaymentMethod: `${baseId}-owns-payment-method`,
    expirationDate: `${baseId}-expiration-date`,
  };
  const { t } = useTranslation("filters");

  const methods = useFormController({
    mode: "onBlur",
    schema: paymentMethodFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { errors, dirtyFields, isDirty } = methods.formState;

  const { upsertPaymentMethodFilterMutate, isLoading: isSaving } =
    useUpsertPaymentMethodFilterMutation(smartlistId, {
      onSuccess: () => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.600.toasts.saveSuccess"),
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
          title: error.message || t("filters.600.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deletePaymentMethodFilterMutate, isLoading: isDeleting } =
    useDeletePaymentMethodFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.600.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const isSavedFilter = Boolean(watchedFilterValue.id);
  const ownsPaymentMethod = ownsPaymentMethodToApi(
    watchedFilterValue.ownsPaymentMethod,
  );
  const showAnySavedPaymentMethodCopy =
    ownsPaymentMethod && watchedFilterValue.subFilters.length === 0;

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertPaymentMethodFilterMutate({
          createPayload: createPaymentMethodFilterPayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildDirtyPatchPayload(dirtyFields, value);
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertPaymentMethodFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.600.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      onDeleteUnsavedFilter?.();
      return;
    }

    deletePaymentMethodFilterMutate(watchedFilterValue.id);
  };

  const handleOwnsPaymentMethodChange = (
    nextOption: typeof watchedFilterValue.ownsPaymentMethod,
  ) => {
    methods.setValue("ownsPaymentMethod", nextOption, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (!ownsPaymentMethodToApi(nextOption)) {
      methods.setValue("subFilters", [], { shouldDirty: true });
    }
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.600.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.600.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>

        <OwnsPaymentMethodRadioGroup
          id={fieldIds.ownsPaymentMethod}
          value={watchedFilterValue.ownsPaymentMethod}
          disabled={isSaving || isDeleting}
          onChange={handleOwnsPaymentMethodChange}
        />

        {showAnySavedPaymentMethodCopy ? (
          <Body size="sm" color="weak">
            {t("filters.600.fields.anySavedPaymentMethod")}
          </Body>
        ) : null}

        {ownsPaymentMethod ? (
          <PaymentMethodSubFiltersArea
            fieldIds={fieldIds}
            watchedFilterValue={watchedFilterValue}
            errors={errors}
            setValue={methods.setValue}
          />
        ) : null}

        <div className="flex justify-end">
          <Button
            label={t("filters.600.actions.save")}
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
