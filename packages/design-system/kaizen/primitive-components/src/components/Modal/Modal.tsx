import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import type { SetRequired } from "type-fest";
import mapValues from "lodash/mapValues";
import classNames from "classnames";
import Title from "../Title";
import Body from "../Body";
import Button from "../Button";
import useEscapeKeydownListener from "./escape-keydown-listener.hook";

const defaultClasses = [
  "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  "rounded-lg shadow-xl",
  "bg-surface-default-elevated",
  "max-h-[70%]",
  "flex flex-col",
  "transition ease-out duration-200",
] as const;

const variants = {
  size: {
    sm: "w-component-modal-min-sm",
    md: "w-component-modal-min-md",
    lg: "w-component-modal-min-lg",
  },
} as const;

export const sizes = mapValues(variants.size, (_, key) => key) as {
  [key in keyof typeof variants.size]: key;
};
export const confirmColors = ["main", "critical"] as const;
export const footerDirections = ["row", "column"] as const;

const modal = cva(defaultClasses, { variants });

type ModalVariantsProps = SetRequired<VariantProps<typeof modal>, "size">;

export type ModalProps = React.HTMLAttributes<HTMLDivElement> &
  ModalVariantsProps & {
    open: boolean;
    size: string;
    title: string;
    description?: string;
    footerDirection?: (typeof footerDirections)[number];
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
 * @param props.description Description below the title.
 * @param props.footerDirection Direction of the footer.
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
  footerDirection,
  onClose,
  onCrossButtonClick,
  onClickOutside,
  confirmLabel,
  confirmColor,
  onConfirmClick,
  cancelLabel,
  onCancelClick,
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const handleClose = useCallback(() => {
    setTimeout(() => {
      setIsMounted(false);
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
    [onClickOutside, onClose],
  );

  const handleCrossButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onCrossButtonClick?.(event);
      handleClose();
    },
    [onCrossButtonClick, onClose],
  );

  const handleCancelClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onCancelClick?.(event);
      handleClose();
    },
    [onCancelClick, onClose],
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
  }, [open, handleClose]);

  useEscapeKeydownListener(handleClose ?? (() => {}), open);

  if (!open && !isMounted) return null;

  return createPortal(
    <div
      className={classNames(
        "fixed inset-[0] z-[999] bg-surface-blanket/md transition ease-out duration-200",
        { "bg-surface-blanket/transparent": !isVisible },
      )}
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={classNames(modal({ className, size }), {
          "opacity-transparent scale-95": !isVisible,
        })}
        onClick={handleModalClick}
        ref={modalRef}
        {...props}
      >
        <div className="flex justify-between p-md gap-xs border-b-stroke-divider border-b-stroke-thin border-opacity-md">
          <div className="flex flex-col gap-2xs text-onsurface-default">
            <Title
              htmlVariant="h2"
              weight="strong"
              id="modal-title"
              className="text-title-sm"
            >
              {title}
            </Title>
            {description && (
              <Body htmlVariant="p" size="md">
                {description}
              </Body>
            )}
          </div>
          <Button
            size="sm"
            intent="flat"
            color="default"
            iconRight="x"
            loading={false}
            className="h-fit"
            onClick={handleCrossButtonClick}
          />
        </div>
        {children && (
          <div className="p-md flex-grow overflow-y-auto">{children}</div>
        )}
        {(cancelLabel || confirmLabel) && (
          <div
            className={`flex justify-end p-md gap-xs border-t-stroke-divider border-t-stroke-thin border-opacity-md
              ${footerDirection === "column" ? "flex-col-reverse" : "flex-row"}`}
          >
            {cancelLabel && (
              <Button
                size="md"
                intent="flat"
                color="default"
                label={cancelLabel}
                loading={false}
                onClick={handleCancelClick}
              />
            )}
            {confirmLabel && (
              <Button
                size="md"
                intent="call-to-action"
                color={confirmColor || "main"}
                label={confirmLabel}
                loading={false}
                onClick={onConfirmClick}
              />
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

Modal.displayName = "KaizenModal";

export default Modal;
