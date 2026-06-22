import { type FC, useId, useState } from "react";

import {
  type DateTime,
  fromIsoString,
  getIsoDate,
} from "@bsport/datetime-manipulation";
import { Body, DatePicker, Modal } from "@bsport/kaizen-primitive-core";

import { useUpdateInvoiceBillingDateMutation } from "#src/hooks/api/use-update-invoice-billing-date";
import { useTranslation } from "#src/utils/i18n";

import type { MembershipPlanInvoiceRowData } from "./types";

type EditBillingDateModalProps = {
  invoice: MembershipPlanInvoiceRowData | null;
  billingPlanId: number;
  onClose: () => void;
};

export const EditBillingDateModal: FC<EditBillingDateModalProps> = ({
  invoice,
  billingPlanId,
  onClose,
}) => {
  const { t } = useTranslation("membership-plan");
  const datePickerId = useId();
  const [selectedDate, setSelectedDate] = useState<DateTime | null>(
    invoice ? fromIsoString(invoice.rawDate) : null,
  );
  const [hasMutationError, setHasMutationError] = useState(false);

  const { mutateAsync, isPending } = useUpdateInvoiceBillingDateMutation({
    onError: () => setHasMutationError(true),
  });

  const handleSave = async () => {
    if (!invoice || invoice.isDateEditDisabled || !selectedDate) {
      return;
    }

    setHasMutationError(false);

    try {
      await mutateAsync({
        invoiceId: invoice.id,
        billingPlanId,
        billingDate: getIsoDate(selectedDate),
      });

      onClose();
    } catch {
      // The mutation onError callback surfaces the inline error state.
    }
  };

  return (
    <Modal
      open={invoice !== null}
      confirmButton={{
        label: t("invoiceList.editBillingDateModal.buttons.save"),
        color: "main",
        onClick: handleSave,
        disabled: !selectedDate || isPending,
      }}
      cancelButton={{
        label: t("invoiceList.editBillingDateModal.buttons.close"),
        onClick: onClose,
      }}
      onCloseButtonClick={onClose}
      title={t("invoiceList.editBillingDateModal.title")}
      size="md"
      onClickOutside={onClose}
    >
      <div className="flex flex-col gap-xs">
        <DatePicker
          id={`${datePickerId}-billing-date`}
          displayAs="popover"
          mode="single"
          isInputField
          required
          fullWidth
          label={t("invoiceList.editBillingDateModal.dateLabel")}
          status={hasMutationError ? "error" : undefined}
          statusText={t("invoiceList.editBillingDateModal.helpText")}
          dateValue={selectedDate}
          onSelect={(date) => {
            if (!Array.isArray(date)) {
              setSelectedDate(date);
              setHasMutationError(false);
            }
          }}
        />

        {hasMutationError && (
          <Body size="sm" color="critical">
            {t("invoiceList.editBillingDateModal.error")}
          </Body>
        )}
      </div>
    </Modal>
  );
};
