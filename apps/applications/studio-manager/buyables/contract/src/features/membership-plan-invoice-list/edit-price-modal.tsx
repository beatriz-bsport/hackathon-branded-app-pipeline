import { type FC, useId } from "react";
import { z } from "zod";

import { getCurrencyDisplay } from "@bsport/currency";
import { ControlledForm, useFormController } from "@bsport/form";
import { FormPriceField } from "@bsport/kaizen-business-components/form/price-field";
import { FormToggle } from "@bsport/kaizen-business-components/form/toggle";
import { Alert, Modal, TextField } from "@bsport/kaizen-primitive-core";

import { useUpdateInvoicePriceMutation } from "#src/hooks/api/use-update-invoice-price";
import { useTranslation } from "#src/utils/i18n";

import type { MembershipPlanInvoiceRowData } from "./types";

const editPriceFormSchema = z.object({
  newPrice: z.number().min(0),
  applyBeforeRenewal: z.boolean(),
  applyAfterRenewal: z.boolean(),
});

type EditPriceFormSchema = typeof editPriceFormSchema;
type EditPriceFormData = z.infer<EditPriceFormSchema>;

const toFormCents = (euros: number) => Math.round(euros * 100);
const fromFormCents = (cents: number) => cents / 100;

type EditPriceModalProps = {
  invoice: MembershipPlanInvoiceRowData | null;
  billingPlanId: number;
  onClose: () => void;
};

export const EditPriceModal: FC<EditPriceModalProps> = ({
  invoice,
  billingPlanId,
  onClose,
}) => {
  const { t } = useTranslation("membership-plan");
  const formId = useId();
  const fieldId = useId();
  const currencyDisplay = getCurrencyDisplay();

  const methods = useFormController<EditPriceFormSchema>({
    mode: "all",
    schema: editPriceFormSchema,
    defaultValues: {
      newPrice: invoice ? toFormCents(invoice.rawAmount) : 0,
      applyBeforeRenewal: false,
      applyAfterRenewal: false,
    },
  });

  const { mutateAsync, isPending } = useUpdateInvoicePriceMutation({
    onError: () =>
      methods.setError("newPrice", {
        message: t("invoiceList.editPriceModal.error"),
      }),
  });

  const { isValid, isSubmitting } = methods.formState;
  const isLoading = isPending || isSubmitting;

  const handleSubmit = async (formData: EditPriceFormData) => {
    if (!invoice || invoice.isPast) return;
    await mutateAsync({
      invoiceId: invoice.id,
      billingPlanId,
      newPrice: fromFormCents(formData.newPrice),
      applyBeforeRenewal: formData.applyBeforeRenewal,
      applyAfterRenewal: formData.applyAfterRenewal,
    });
    onClose();
  };

  return (
    <Modal
      open={invoice !== null}
      confirmButton={{
        label: t("invoiceList.editPriceModal.buttons.confirm"),
        color: "main",
        type: "submit",
        form: formId,
        disabled: !isValid || isLoading,
        loading: isLoading,
      }}
      cancelButton={{
        label: t("invoiceList.editPriceModal.buttons.cancel"),
        onClick: onClose,
      }}
      onCloseButtonClick={onClose}
      title={t("invoiceList.editPriceModal.title")}
      size="md"
      onClickOutside={onClose}
    >
      <div onSubmit={(e) => e.stopPropagation()}>
        <ControlledForm
          id={formId}
          {...methods}
          onSubmit={handleSubmit}
          className="flex flex-col gap-xs"
        >
          <TextField
            id={`${fieldId}-current-price`}
            label={t("invoiceList.editPriceModal.currentPriceLabel")}
            value={invoice ? invoice.rawAmount.toFixed(2) : ""}
            disabled
            fullWidth
            type="number"
            suffix={{ type: "text", value: currencyDisplay }}
          />

          <FormPriceField<EditPriceFormData, "newPrice">
            id={`${fieldId}-new-price`}
            fieldName="newPrice"
            label={t("invoiceList.editPriceModal.newPriceLabel")}
            fullWidth
            required
            helperText={t("invoiceList.editPriceModal.joinFeeHelpText")}
          />

          <div className="flex flex-col gap-sm">
            <FormToggle<EditPriceFormData, "applyBeforeRenewal">
              id={`${fieldId}-apply-before-renewal`}
              fieldName="applyBeforeRenewal"
              label={t("invoiceList.editPriceModal.toggles.beforeRenewal")}
              disabled={isLoading}
            />
            <FormToggle<EditPriceFormData, "applyAfterRenewal">
              id={`${fieldId}-apply-after-renewal`}
              fieldName="applyAfterRenewal"
              label={t("invoiceList.editPriceModal.toggles.afterRenewal")}
              disabled={isLoading}
            />
          </div>

          {invoice?.isFirstInvoice && (
            <Alert status="warning">
              {t("invoiceList.editPriceModal.firstInvoiceWarning")}
            </Alert>
          )}
        </ControlledForm>
      </div>
    </Modal>
  );
};
