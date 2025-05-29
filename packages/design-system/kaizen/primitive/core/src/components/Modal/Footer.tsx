import React from "react";

import Button from "#src/components/Button";
import {
  type StepConfig,
  confirmColors,
  footerDirections,
} from "#src/components/Modal/constants";
import { useTranslation } from "#src/i18n";

export type FooterProps = {
  cancelLabel?: string;
  confirmLabel?: string;
  confirmColor: (typeof confirmColors)[number];
  onConfirmClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onCancelClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isStepper: boolean;
  currentStep: number;
  steps?: StepConfig[];
  t: ReturnType<typeof useTranslation>["t"];
  handleCancelClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleNextStep: (event: React.MouseEvent<HTMLButtonElement>) => void;
  currentStepConfig?: StepConfig;
  footerDirection: (typeof footerDirections)[number];
};

const Footer: React.FC<FooterProps> = ({
  cancelLabel,
  confirmLabel,
  confirmColor,
  onConfirmClick,
  isStepper,
  currentStep,
  steps,
  t,
  handleCancelClick,
  handleNextStep,
  currentStepConfig,
  footerDirection,
}) => {
  let secondaryButtonLabel: string | undefined;
  let ctaButtonLabel: string | undefined;
  let ctaButtonDisabled: boolean;
  let ctaButtonOnClick: (event: React.MouseEvent<HTMLButtonElement>) => void;

  if (isStepper && steps) {
    secondaryButtonLabel = currentStep > 0 ? t("modal.back") : cancelLabel;
    ctaButtonLabel =
      currentStep < steps.length - 1 ? t("modal.next") : confirmLabel;
    ctaButtonDisabled = currentStepConfig?.validate
      ? !currentStepConfig.validate()
      : false;
    ctaButtonOnClick = handleNextStep;
  } else {
    secondaryButtonLabel = cancelLabel;
    ctaButtonLabel = confirmLabel;
    ctaButtonDisabled = false;
    ctaButtonOnClick = onConfirmClick;
  }

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
          size="md"
          intent="flat"
          color="default"
          label={secondaryButtonLabel}
          onClick={handleCancelClick}
        />
      )}

      {showCtaButton && (
        <Button
          size="md"
          intent="call-to-action"
          color={confirmColor}
          label={ctaButtonLabel}
          onClick={ctaButtonOnClick}
          disabled={ctaButtonDisabled}
        />
      )}
    </div>
  );
};

export default Footer;
