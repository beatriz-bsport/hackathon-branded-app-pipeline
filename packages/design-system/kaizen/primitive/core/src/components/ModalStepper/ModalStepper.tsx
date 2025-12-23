import React, { useCallback, useState } from "react";

import Body from "#src/components/Body";
import Button from "#src/components/Button";
import Icon from "#src/components/Icon";
import Title from "#src/components/Title";
import Dialog, { type DialogSize } from "#src/components/private/Dialog";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import Footer from "./Footer";
import type { FooterDirection, StepConfig } from "./types";
import type { CancelButtonProps, ConfirmButtonProps } from "./types";

export type ModalStepperProps = React.HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  size: DialogSize;
  title: string;
  description?: React.ReactNode;
  footerDirection?: FooterDirection;
  steps: StepConfig[];
  initialStep?: number;
  onClose?: () => void;
  onCloseButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClickOutside?: (event: React.MouseEvent<HTMLDivElement>) => void;
  confirmButton: ConfirmButtonProps;
  cancelButton?: CancelButtonProps;
};

/**
 * A stepper dialog that guides users through a multi-step process.
 * @param props.className Classname to add to the modal container.
 * @param props.open Whether the modal is open or not.
 * @param props.size Size of the modal. Can be one of "sm", "md", or "lg".
 * @param props.title Title of the modal.
 * @param props.description Description below the title. Can be a string or a ReactNode.
 * @param props.footerDirection Direction of the footer.
 * @param props.steps Array of step config objects to render a modal step form.
 * @param props.initialStep Index of the initial step. Defaults to 0.
 * @param props.onClose Function to call when the modal is closed.
 * @param props.onCloseButtonClick Function to call when the close (X) button is clicked.
 * @param props.onClickOutside Function to call when the modal is clicked outside.
 * @param props.confirmButton Button props for the confirm button, including label and onClick handler.
 * @param props.cancelButton Button props for the cancel button, including label and onClick handler.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-modalstepper--docs
 */
const ModalStepper: React.FC<ModalStepperProps> = ({
  className,
  open,
  size,
  title,
  description,
  footerDirection = "row",
  steps,
  initialStep = 0,
  onClose,
  onCloseButtonClick,
  onClickOutside,
  confirmButton,
  cancelButton,
  ...props
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  // Handle stepper logic
  const [currentStep, setCurrentStep] = useState(initialStep);
  const currentStepConfig = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleClose = useCallback(() => {
    setCurrentStep(0);
    onClose?.();
  }, [onClose]);

  const handleCrossButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onCloseButtonClick?.(event);
      handleClose();
    },
    [onCloseButtonClick, handleClose],
  );

  const handleCancelClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      cancelButton?.onClick?.(event);

      if (currentStep === 0) {
        handleClose();
      } else {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
      }
    },
    [currentStep, handleClose, cancelButton],
  );

  const handleNextStep = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      // The validate function is optional, if it's not passed we assume the step is valid
      if (currentStepConfig?.validate?.() ?? true) {
        confirmButton.onClick?.(event);

        if (isLastStep) {
          return;
        } else {
          setCurrentStep((prev) => prev + 1);
        }
      }
    },
    [currentStepConfig, isLastStep, confirmButton],
  );

  return (
    <Dialog
      data-component="Kaizen-ModalStepper"
      open={open}
      size={size}
      onClose={onClose}
      onClickOutside={onClickOutside}
      className={className}
      aria-labelledby="modal-stepper-title"
      {...props}
    >
      <div
        data-component="Kaizen-ModalStepper-Header"
        className="flex justify-between p-md gap-xs border-b-stroke-divider border-b-stroke-thin border-opacity-md"
      >
        <div className="flex flex-col gap-2xs text-onsurface-default">
          <Title htmlVariant="h4" weight="stronger" id="modal-stepper-title">
            {title}
          </Title>
          {description &&
            (typeof description === "string" ? (
              <Body htmlVariant="p" size="md" weight="weak">
                {description}
              </Body>
            ) : (
              <>{description}</>
            ))}
        </div>
        <Button
          kind="icon-button"
          label={t("modal.close")}
          icon="x"
          size="sm"
          intent="flat"
          color="default"
          className="h-fit"
          onClick={handleCrossButtonClick}
        />
      </div>

      <div
        data-component="Kaizen-ModalStepper-Body"
        className="flex items-start gap-md p-md min-h-full overflow-y-auto"
      >
        <div
          data-component="Kaizen-ModalStepper-Steps"
          className="flex flex-col items-start gap-md p-md border-r-stroke-thin border-r-stroke-weak h-full"
        >
          {steps.map((step, index) => {
            return (
              <div
                key={step.label}
                className="inline-flex items-center gap-2xs"
              >
                {step.icon && <Icon icon={step.icon} size="sm" />}
                <Body
                  htmlVariant="span"
                  weight={index === currentStep ? "strong" : "weak"}
                  color={index === currentStep ? "default" : "weak"}
                >
                  {step.label}
                </Body>
              </div>
            );
          })}
        </div>
        <div
          data-component="Kaizen-ModalStepper-Body-Content"
          className="flex flex-1 p-lg overflow-auto"
        >
          {steps[currentStep].content}
        </div>
      </div>

      <Footer
        confirmButton={confirmButton}
        cancelButton={cancelButton}
        currentStep={currentStep}
        steps={steps}
        t={t}
        handleCancelClick={handleCancelClick}
        handleNextStep={handleNextStep}
        currentStepConfig={currentStepConfig}
        footerDirection={footerDirection}
      />
    </Dialog>
  );
};

ModalStepper.displayName = "KaizenModalStepper";

export default ModalStepper;
