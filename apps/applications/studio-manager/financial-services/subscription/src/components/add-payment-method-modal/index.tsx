import type { FC } from "react";

import { Alert, Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import AddPaymentMethodElement from "./add-payment-method-element";
import { useAddPaymentMethod } from "./use-add-payment-method";

export type AddPaymentMethodModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddPaymentMethodModal: FC<AddPaymentMethodModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation("subscription");
  const {
    stripePromise,
    setupIntentData,
    isSetupIntentPending,
    isSetupIntentError,
    onPaymentElementReady,
    isSubmitting,
    errorMessage,
    registerSubmitHandler,
    handleConfirm,
    isConfirmDisabled,
  } = useAddPaymentMethod({ isOpen, onClose });

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t("billing.update-payment-method.add-new")}
      size="md"
      confirmButton={{
        color: "main",
        label: t("billing.update-payment-method.save"),
        onClick: () => void handleConfirm(),
        disabled: isConfirmDisabled,
        loading: isSubmitting,
      }}
      cancelButton={{
        label: t("billing.update-payment-method.cancel"),
        onClick: onClose,
        disabled: isSubmitting,
      }}
    >
      <div className="flex flex-col gap-sm">
        <AddPaymentMethodElement
          setupIntentData={setupIntentData}
          isLoading={isSetupIntentPending}
          isError={isSetupIntentError}
          stripePromise={stripePromise}
          registerSubmitHandler={registerSubmitHandler}
          onPaymentElementReady={onPaymentElementReady}
        />
        {errorMessage && <Alert status="critical">{errorMessage}</Alert>}
      </div>
    </Modal>
  );
};

export default AddPaymentMethodModal;
