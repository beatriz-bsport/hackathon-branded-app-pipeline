import { useEffect, useId } from "react";

import {
  Body,
  Card,
  Checkbox,
  Icon,
  Title,
} from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

import type { StripeReader } from "../../hooks/use-fetch-stripe-readers";

type TerminalPaymentMethodProps = {
  stripeReaders: StripeReader[];
  isLoading?: boolean;
  selectedReaderId: string | null;
  savePaymentMethod: boolean;
  onSelectedReaderIdChange: (readerId: string | null) => void;
  onSavePaymentMethodChange: (checked: boolean) => void;
};

export const TerminalPaymentMethod: React.FC<TerminalPaymentMethodProps> = ({
  stripeReaders,
  isLoading = false,
  selectedReaderId,
  savePaymentMethod,
  onSelectedReaderIdChange,
  onSavePaymentMethodChange,
}: TerminalPaymentMethodProps) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });
  const savePaymentMethodId = useId();

  useEffect(() => {
    if (stripeReaders.length === 0) {
      onSelectedReaderIdChange(null);
      return;
    }

    const hasSelectedReader = stripeReaders.some(
      (reader) => reader.id === selectedReaderId,
    );

    if (!hasSelectedReader) {
      onSelectedReaderIdChange(stripeReaders[0]?.id ?? null);
    }
  }, [onSelectedReaderIdChange, selectedReaderId, stripeReaders]);

  if (isLoading) {
    return (
      <Body htmlVariant="p" size="md" color="weaker">
        {t("paymentFlowModal.terminal.loading")}
      </Body>
    );
  }

  if (stripeReaders.length === 0) {
    return (
      <Body htmlVariant="p" size="md" color="weaker">
        {t("paymentFlowModal.terminal.empty")}
      </Body>
    );
  }

  const readersGridClassName =
    stripeReaders.length === 1 ? "grid-cols-1" : "grid-cols-2";

  return (
    <div className="flex flex-col items-start gap-sm self-stretch">
      <Title htmlVariant="h4" color="default" weight="strong">
        {t("paymentFlowModal.terminal.title")}
      </Title>

      <div className={`grid ${readersGridClassName} gap-xs self-stretch`}>
        {stripeReaders.map((reader) => (
          <Card
            key={reader.id}
            actionable
            elevated
            selected={selectedReaderId === reader.id}
            onClick={() => onSelectedReaderIdChange(reader.id)}
          >
            <div className="flex min-w-0 flex-1 flex-row items-center gap-sm">
              <Icon icon="payment-terminal" size="md" />
              <div className="flex min-w-0 flex-1 flex-col gap-2xs">
                <Title htmlVariant="h5" color="default" weight="strong">
                  {reader.label}
                </Title>
                <Body htmlVariant="p" size="lg" color="default">
                  {reader.serial_number ||
                    t("paymentFlowModal.terminal.unknownSerial")}
                </Body>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Checkbox
        id={`payment-flow-modal-terminal-save-checkbox-${savePaymentMethodId}`}
        label={t("paymentFlowModal.terminal.saveLabel")}
        value={savePaymentMethod ? "checked" : "unchecked"}
        onChange={onSavePaymentMethodChange}
      />
    </div>
  );
};
