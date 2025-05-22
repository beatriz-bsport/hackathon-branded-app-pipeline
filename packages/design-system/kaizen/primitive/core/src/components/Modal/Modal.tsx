import { cva, cx } from "class-variance-authority";
import mapValues from "lodash/mapValues";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import Body from "#src/components/Body";
import Button from "#src/components/Button";
import Icon, { type IconName } from "#src/components/Icon";
import Title from "#src/components/Title";
import useEscapeKeydownListener from "#src/hooks/escape-keydown-listener.hook";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import Footer from "./Footer";

const defaultClasses = [
  "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  "rounded-lg shadow-xl",
  "bg-surface-default-elevated",
  "max-h-[70%]",
  "flex flex-col",
  "transition ease-out duration-default",
] as const;

const variants = {
  size: {
    sm: "w-component-modal-min-sm",
    md: "w-component-modal-min-md",
    lg: "w-component-modal-min-lg",
  },
  isVisible: {
    true: "opacity-100 pointer-events-auto scale-100",
    false: "opacity-0 pointer-events-none scale-95",
  },
} as const;

export const sizes = mapValues(variants.size, (_, key) => key) as {
  [key in keyof typeof variants.size]: key;
};
export const confirmColors = ["main", "critical"] as const;
export const footerDirections = ["row", "column"] as const;

const modal = cva(defaultClasses, { variants });

export type StepConfig = {
  label: string;
  content: React.ReactNode;
  validate?: () => boolean;
  icon?: IconName;
};

export type ModalProps = React.HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  size: "sm" | "md" | "lg";
  title: string;
  description?: React.ReactNode;
  footerDirection?: (typeof footerDirections)[number];
  steps?: StepConfig[];
  initialStep?: number;
  onClose?: () => void;
  onCrossButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClickOutside?: (event: React.MouseEvent<HTMLDivElement>) => void;
} & ({
    confirmLabel: string;
    confirmColor: (typeof confirmColors)[number];
    onConfirmClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  } | null) &
  ({
    cancelLabel?: string;
    onCancelClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  } | null);

/**
 * A dialog box that appears on top of the main content, requiring the user to
 * interact with it before returning to the main flow, and can be used to
 * display important information or confirm an action.
 * @param props.className Classname to add to the modal container.
 * @param props.open Whether the modal is open or not.
 * @param props.size Size of the modal. Can be one of "sm", "md", or "lg".
 * @param props.title Title of the modal.
 * @param props.description Description below the title. Can be a string or a ReactNode.
 * @param props.footerDirection Direction of the footer.
 * @param props.steps Array of step config objects to render a modal step form
 * @param props.initialStep Index of the initial step. Defaults to 0.
 * @param props.onClose Function to call when the modal is closed.
 * @param props.onCrossButtonClick Function to call when the cross button is clicked.
 * @param props.onClickOutside Function to call when the modal is clicked outside.
 * @param props.confirmLabel Text label of the confirm button.
 * @param props.confirmColor Color of the confirm button.
 * @param props.onConfirmClick Function to call when the confirm button is clicked.
 * @param props.cancelLabel Text label of the cancel button.
 * @param props.onCancelClick Function to call when the cancel button is clicked.
 * @param props.children Content in the middle of the modal.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-modal--docs
 */
const Modal: React.FC<ModalProps> = ({
  className,
  open,
  size,
  title,
  description,
  footerDirection = "row",
  steps,
  initialStep = 0,
  onClose,
  onCrossButtonClick,
  onClickOutside,
  confirmLabel,
  confirmColor = "main",
  onConfirmClick,
  cancelLabel,
  onCancelClick,
  children,
  ...props
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle stepper logic if steps are provided
  const [currentStep, setCurrentStep] = useState(initialStep);
  const isStepper = !!steps && steps.length > 0;
  const currentStepConfig = isStepper ? steps[currentStep] : undefined;
  const isLastStep = isStepper && currentStep === steps.length - 1;

  const handleClose = useCallback(() => {
    setTimeout(() => {
      setIsMounted(false);
      setCurrentStep(0);
      onClose?.();
      document.body.style.overflow = "";
    }, 200);
    setIsVisible(false);
  }, [setIsVisible, onClose]);

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClickOutside?.(event);
        handleClose();
      }
    },
    [onClickOutside, handleClose],
  );

  const handleCrossButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onCrossButtonClick?.(event);
      handleClose();
    },
    [onCrossButtonClick, handleClose],
  );

  const handleCancelClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onCancelClick?.(event);

      if (!isStepper || currentStep === 0) {
        handleClose();
      } else {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
      }
    },
    [currentStep, handleClose, onCancelClick],
  );

  const handleNextStep = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isStepper) {
        onConfirmClick?.(event);
        return;
      }

      // The validate function is optional, if it's not passed we assume the step is valid
      if (currentStepConfig?.validate?.() ?? true) {
        onConfirmClick?.(event);

        if (isLastStep) {
          handleClose();
        } else {
          setCurrentStep((prev) => prev + 1);
        }
      }
    },
    [isStepper, currentStepConfig, isLastStep, onConfirmClick, handleClose],
  );

  const handleModalClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation(),
    [],
  );

  // Manage focus by storing the previous focus and setting focus to the modal when open
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      setIsVisible(true);
      previousFocusRef.current = document.activeElement as HTMLElement;
      previousFocusRef.current?.blur();
      modalRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      handleClose();
      previousFocusRef.current?.focus();
    }
  }, [open]);

  useEscapeKeydownListener(handleClose ?? (() => {}), open);

  if (!open && !isMounted) return null;

  return createPortal(
    <div
      className={cx(
        "fixed inset-[0] z-[999] bg-surface-blanket transition ease-out duration-default",
        { "bg-surface-blanket/transparent": !isVisible },
      )}
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cx(modal({ className, size, isVisible }))}
        onClick={handleModalClick}
        ref={modalRef}
        {...props}
      >
        <div className="flex justify-between p-md gap-xs border-b-stroke-divider border-b-stroke-thin border-opacity-md">
          <div className="flex flex-col gap-2xs text-onsurface-default">
            <Title htmlVariant="h4" weight="stronger" id="modal-title">
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
            size="sm"
            intent="flat"
            color="default"
            iconRight="x"
            className="h-fit"
            onClick={handleCrossButtonClick}
          />
        </div>

        {isStepper ? (
          <div className="flex items-start gap-md p-md min-h-full">
            <div className="flex flex-col items-start gap-md p-md border-r-stroke-thin border-r-stroke-weak h-full">
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
            <div className="flex flex-1 p-lg overflow-auto">
              {steps[currentStep].content}
            </div>
          </div>
        ) : (
          children && (
            <div className="p-md flex-grow overflow-y-auto">{children}</div>
          )
        )}

        <Footer
          cancelLabel={cancelLabel}
          confirmLabel={confirmLabel}
          confirmColor={confirmColor}
          onConfirmClick={onConfirmClick}
          onCancelClick={onCancelClick}
          isStepper={isStepper}
          currentStep={currentStep}
          steps={steps}
          t={t}
          handleCancelClick={handleCancelClick}
          handleNextStep={handleNextStep}
          currentStepConfig={currentStepConfig}
          footerDirection={footerDirection}
        />
      </div>
    </div>,
    document.body,
  );
};

Modal.displayName = "KaizenModal";

export default Modal;
