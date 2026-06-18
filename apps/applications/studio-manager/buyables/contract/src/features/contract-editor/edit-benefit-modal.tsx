import type { FC } from "react";

import { FormProvider } from "@bsport/form";
import { Modal } from "@bsport/kaizen-primitive-core";

import { ContractFormBenefitConfiguration } from "#src/features/contract-form/benefit-components/contract-form-benefit-configuration";
import type { ContractFormMethods } from "#src/features/contract-form/types";
import {
  type BenefitKind,
  useBenefitKindName,
} from "#src/utils/contract-benefit";
import { useTranslation } from "#src/utils/i18n";

type ContractEditBenefitModalProps = {
  benefitKind: BenefitKind;
  formId: string;
  methods: ContractFormMethods;
  isOpen: boolean;
  onClose: () => void;
  readonly?: boolean;
};

/**
 * Wraps the benefit configuration in a modal. The controls bind to the main
 * contract form, so they update the form data directly — "Save" only closes
 * the modal (the changes are already applied).
 * @todo Make isolation on the form edition
 */
export const ContractEditBenefitModal: FC<ContractEditBenefitModalProps> = ({
  benefitKind,
  formId,
  methods,
  isOpen,
  onClose,
  readonly,
}) => {
  const { t } = useTranslation("contract-features");

  const kindTranslation = useBenefitKindName(benefitKind);

  return (
    <Modal
      open={isOpen}
      title={kindTranslation}
      size="md"
      onClose={onClose}
      onCloseButtonClick={onClose}
      onClickOutside={onClose}
      confirmButton={{
        label: t("editBenefitModal.save"),
        color: "main",
        // The benefit controls already mutate the form data, so saving just
        // closes the modal for now.
        onClick: onClose,
      }}
    >
      <FormProvider {...methods}>
        <ContractFormBenefitConfiguration
          benefitKind={benefitKind}
          formId={formId}
          methods={methods}
          readonly={readonly}
        />
      </FormProvider>
    </Modal>
  );
};
