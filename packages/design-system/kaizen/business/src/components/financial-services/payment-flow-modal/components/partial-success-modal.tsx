import {
  Body,
  Button,
  Illustration,
  Modal,
  Title,
} from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

type PartialSuccessModalProps = {
  isOpen: boolean;
  remainingAmountLabel: string;
  onClose: () => void;
  onPayRemainingAmount: () => Promise<void>;
};

export const PartialSuccessModal = ({
  isOpen,
  remainingAmountLabel,
  onClose,
  onPayRemainingAmount,
}: PartialSuccessModalProps) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });

  return (
    <Modal
      open={isOpen}
      title={t("paymentFlowModal.partialSuccess.title")}
      size="md"
      onClose={onClose}
      onCloseButtonClick={onClose}
    >
      <div className="flex flex-col gap-sm p-2xl items-center justify-center">
        <Illustration name="success" size="xl" />

        <Title htmlVariant="h3" weight="strong" color="weak">
          {t("paymentFlowModal.partialSuccess.successful")}
        </Title>
        <Body size="lg" weight="weak" color="weak">
          {t("paymentFlowModal.partialSuccess.remaining", {
            amount: remainingAmountLabel,
          })}
        </Body>

        <Button
          className="mt-sm"
          intent="default"
          color="main"
          size="md"
          label={t("paymentFlowModal.buttons.pay", {
            amount: remainingAmountLabel,
          })}
          onClick={onPayRemainingAmount}
        />
      </div>
    </Modal>
  );
};
