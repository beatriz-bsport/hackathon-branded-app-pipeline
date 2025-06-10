import React from "react";

import Button from "#src/components/Button";
import { useTranslation } from "#src/i18n";

import type {
  CancelButtonProps,
  ConfirmButtonProps,
  FooterDirection,
  StepConfig,
} from "./types";

export type FooterProps = {
  confirmButton: ConfirmButtonProps;
  cancelButton?: CancelButtonProps;
  currentStep: number;
  steps: StepConfig[];
  t: ReturnType<typeof useTranslation>["t"];
  handleCancelClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleNextStep: (event: React.MouseEvent<HTMLButtonElement>) => void;
  currentStepConfig?: StepConfig;
  footerDirection: FooterDirection;
};

const Footer: React.FC<FooterProps> = ({
  confirmButton,
  cancelButton,
  currentStep,
  steps,
  t,
  handleCancelClick,
  handleNextStep,
  currentStepConfig,
  footerDirection,
}) => {
  const secondaryButtonLabel =
    currentStep > 0 ? t("modal.back") : cancelButton?.label;
  const ctaButtonLabel =
    currentStep < steps.length - 1 ? t("modal.next") : confirmButton.label;
  const ctaButtonDisabled = currentStepConfig?.validate
    ? !currentStepConfig.validate()
    : false;
  const ctaButtonOnClick = handleNextStep;

  const showSecondaryButton = !!secondaryButtonLabel;
  const showCtaButton = !!ctaButtonLabel;

  if (!showSecondaryButton && !showCtaButton) return null;

  return (
    <div
      className={`flex justify-end p-md gap-xs border-t-stroke-divider border-t-stroke-thin border-opacity-md ${
        footerDirection === "column" ? "flex-col-reverse" : "flex-row"
      }`}
    >
      {showSecondaryButton && (
        <Button
          {...cancelButton}
          label={secondaryButtonLabel}
          onClick={handleCancelClick}
          size="md"
          intent="flat"
          color="default"
        />
      )}

      {showCtaButton && (
        <Button
          {...confirmButton}
          label={ctaButtonLabel}
          onClick={ctaButtonOnClick}
          disabled={ctaButtonDisabled || (confirmButton?.disabled ?? false)}
          size="md"
          intent="call-to-action"
          color={confirmButton?.color ?? "main"}
        />
      )}
    </div>
  );
};

export default Footer;
