import { useState } from "react";

import type { Fetch } from "@bsport/fetch";
import { Button, TextField } from "@bsport/kaizen-primitive-core";

import { useApplyGiftCardCode } from "#src/components/financial-services/payment-flow-modal/hooks/use-apply-gift-card-code";
import { i18nInstance, useTranslation } from "#src/i18n";

type AddGiftCardCodeProps = {
  fetch: Fetch;
  memberId: number;
  onApplied: () => void;
};

export const AddGiftCardCode: React.FC<AddGiftCardCodeProps> = ({
  fetch,
  memberId,
  onApplied,
}: AddGiftCardCodeProps) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });

  const [isAddingGiftCard, setIsAddingGiftCard] = useState(false);
  const [giftCardCode, setGiftCardCode] = useState("");
  const [giftCardCodeError, setGiftCardCodeError] = useState<string | null>(
    null,
  );

  const { applyGiftCardCode, isApplyingGiftCardCode } = useApplyGiftCardCode({
    fetch,
    memberId,
    onSuccess: () => {
      setGiftCardCodeError(null);
      setGiftCardCode("");
      setIsAddingGiftCard(false);
      onApplied();
    },
    onError: (errorType) => {
      setGiftCardCodeError(
        errorType === "invalid"
          ? t("paymentFlowModal.giftCards.errors.invalidCode")
          : t("paymentFlowModal.giftCards.errors.generic"),
      );
    },
  });
  const handleApplyGiftCardCode = async () => {
    if (giftCardCode.trim().length === 0) {
      setGiftCardCodeError(t("paymentFlowModal.giftCards.errors.emptyCode"));
      return;
    }
    setGiftCardCodeError(null);
    applyGiftCardCode(giftCardCode.trim());
  };

  if (!isAddingGiftCard) {
    return (
      <Button
        intent="default"
        size="md"
        color="main"
        iconLeft="plus"
        label={t("paymentFlowModal.giftCards.addGiftCard")}
        onClick={() => {
          onApplied();
          setIsAddingGiftCard(true);
        }}
      />
    );
  }

  return (
    <div className="flex w-full items-start gap-xs">
      <TextField
        id="payment-flow-modal-gift-card-code"
        fullWidth
        containerProps={{ className: "w-full" }}
        placeholder={t("paymentFlowModal.giftCards.giftCardCodePlaceholder")}
        status={giftCardCodeError ? "error" : "default"}
        statusText={giftCardCodeError ?? undefined}
        value={giftCardCode}
        onChange={(event) => {
          setGiftCardCode(event.target.value);
          if (giftCardCodeError) setGiftCardCodeError(null);
        }}
        onClear={() => {
          setGiftCardCode("");
          setGiftCardCodeError(null);
        }}
      />
      <Button
        kind="icon-button"
        intent="call-to-action"
        size="md"
        color="main"
        icon="check"
        label={t("paymentFlowModal.giftCards.applyGiftCardCode")}
        loading={isApplyingGiftCardCode}
        disabled={isApplyingGiftCardCode}
        onClick={handleApplyGiftCardCode}
      />
    </div>
  );
};
