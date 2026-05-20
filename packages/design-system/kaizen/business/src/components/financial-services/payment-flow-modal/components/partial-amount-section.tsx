import { Toggle, Tooltip } from "@bsport/kaizen-primitive-core";

import { FormPriceField } from "#src/components/form/price-field/form-price-field.component";
import { i18nInstance, useTranslation } from "#src/i18n";

type PartialAmountSectionProps = {
  isInvoiceAlreadyPaid: boolean;
  isPartialEnabled: boolean;
  isPartialSupportedForSelectedMethod: boolean;
  partialAmountError: string | null;
  remainingAmountText: string | null;
  onPartialEnabledChange: (enabled: boolean) => void;
  onPartialAmountFocus: () => void;
  onPartialAmountBlur: () => void;
};

export const PartialAmountSection = ({
  isInvoiceAlreadyPaid,
  isPartialEnabled,
  isPartialSupportedForSelectedMethod,
  partialAmountError,
  remainingAmountText,
  onPartialEnabledChange,
  onPartialAmountFocus,
  onPartialAmountBlur,
}: PartialAmountSectionProps) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });

  const isPartialToggleDisabled =
    isInvoiceAlreadyPaid || !isPartialSupportedForSelectedMethod;

  const partialToggle = (
    <Toggle
      id="payment-flow-modal-partial-toggle"
      className="w-fit"
      label={t("paymentFlowModal.partialToggleLabel")}
      checked={isPartialEnabled}
      onToggleChange={onPartialEnabledChange}
      disabled={isPartialToggleDisabled}
    />
  );

  return (
    <>
      {!isInvoiceAlreadyPaid && !isPartialSupportedForSelectedMethod ? (
        <Tooltip
          placement="bottom-left"
          label={t("paymentFlowModal.partialAmount.unsupportedMethod")}
        >
          <span className="w-fit">{partialToggle}</span>
        </Tooltip>
      ) : (
        partialToggle
      )}

      {isPartialEnabled && (
        <div className="flex flex-col gap-md w-fit">
          <FormPriceField
            id="payment-flow-modal-partial-amount"
            fieldName="partialAmountCts"
            label={t("paymentFlowModal.partialAmount.label")}
            statusText={partialAmountError ?? remainingAmountText ?? undefined}
            status={partialAmountError ? "error" : undefined}
            allowDecimals
            onFocus={onPartialAmountFocus}
            onBlur={onPartialAmountBlur}
          />
        </div>
      )}
    </>
  );
};
