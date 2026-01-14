import { useId } from "react";

import { useFormController } from "@bsport/form";
import { Modal } from "@bsport/kaizen-primitive-core";

import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { DEFAULT_FORM_DATA, billingFlowFormDataSchema } from "./schema";
import type { BillingFlowModalProps } from "./types";

const BillingFlowModal: React.FC<BillingFlowModalProps> = ({
  isOpen,
  onClose,
  memberId,
}: BillingFlowModalProps) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const formId = `billing-flow-modal-${useId()}`;

  const methods = useFormController({
    mode: "onBlur",
    schema: billingFlowFormDataSchema,
    defaultValues: {
      ...DEFAULT_FORM_DATA,
      memberId: memberId ?? undefined,
    },
  });

  const { isDirty, isSubmitting, isValid } = methods.formState;

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      size="lg"
      title={t("billingFlowModal.title")}
      onClose={() => {}}
      onCloseButtonClick={handleClose}
      onClickOutside={() => {}}
      confirmButton={{
        color: "main",
        label: t("billingFlowModal.title"),
        type: "submit",
        form: formId,
        disabled: !isDirty || isSubmitting || !isValid,
      }}
      cancelButton={{
        label: t("billingFlowModal.cancel"),
        onClick: handleClose,
      }}
    >
      {/* TODO: Add form content */}
      <div className="flex flex-col gap-md">
        <p>Billing Flow Modal - Content to be implemented</p>
      </div>
    </Modal>
  );
};

export default BillingFlowModal;
