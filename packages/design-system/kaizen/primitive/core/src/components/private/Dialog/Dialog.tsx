import { cva, cx } from "class-variance-authority";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import useEscapeKeydownListener from "#src/hooks/escape-keydown-listener.hook";
import { useFocusManagement } from "#src/hooks/use-focus-management";

import { useDocumentOverflow } from "./use-document-overflow";

const defaultClasses = [
  "rounded-lg shadow-xl",
  "bg-surface-default-elevated",
  "flex flex-col",
  "transition ease-out duration-default",
] as const;

const variants = {
  size: {
    sm: "w-[90%] sm:w-component-modal-min-sm",
    md: "w-[90%] md:w-component-modal-min-md",
    lg: "w-[90%] lg:w-component-modal-min-lg",
  },
  position: {
    centered:
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[70%]",
    bottom: "fixed bottom-[6px] left-1/2 -translate-x-1/2 max-h-[50vh]",
  },
  isVisible: {
    true: "opacity-100 pointer-events-auto",
    false: "opacity-0 pointer-events-none",
  },
} as const;

const dialog = cva(defaultClasses, {
  variants,
  compoundVariants: [
    {
      position: "centered",
      isVisible: true,
      className: "scale-100",
    },
    {
      position: "centered",
      isVisible: false,
      className: "scale-95",
    },
    {
      position: "bottom",
      isVisible: true,
      className: "translate-y-0",
    },
    {
      position: "bottom",
      isVisible: false,
      className: "translate-y-full",
    },
  ],
  defaultVariants: {
    position: "centered",
  },
});

export type DialogSize = "sm" | "md" | "lg";
export type DialogPosition = "centered" | "bottom";

export type DialogProps = React.HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  size: DialogSize;
  position?: DialogPosition;
  onClose?: () => void;
  onClickOutside?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

/**
 * A private component that handles the dialog behavior including portal creation,
 * backdrop, focus management, and animation states.
 * @param props.open Whether the dialog is open or not.
 * @param props.size Size of the dialog. Can be one of "sm", "md", or "lg".
 * @param props.position Position of the dialog. Can be "centered" or "bottom". Defaults to "centered".
 * @param props.onClose Function to call when the dialog is closed.
 * @param props.onClickOutside Function to call when the dialog is clicked outside.
 */
const Dialog: React.FC<DialogProps> = ({
  className,
  open,
  size,
  position = "centered",
  onClose,
  onClickOutside,
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { setOverflowHidden, resetOverflow } = useDocumentOverflow();
  const dialogRef = useFocusManagement<HTMLDivElement>(open && isVisible);
  const backdropRef = React.useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleTransitionEnd = () => {
    if (!isVisible && isMounted) {
      setIsMounted(false);
      onClose?.();

      resetOverflow();
    }
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      if (onClickOutside) {
        onClickOutside(event);
      } else {
        handleClose();
      }
    }
  };

  const handleDialogClick = (event: React.MouseEvent<HTMLDivElement>) =>
    event.stopPropagation();

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      setIsVisible(true);
      setOverflowHidden();
    } else {
      handleClose();
    }
  }, [open]);

  useEscapeKeydownListener(handleClose, open, backdropRef);

  if (!open && !isMounted) return null;

  return createPortal(
    <div
      ref={backdropRef}
      data-component="Kaizen-Dialog"
      className={cx(
        "fixed inset-[0] z-[999] bg-surface-blanket transition ease-out duration-default",
        { "opacity-0": !isVisible, "opacity-100": isVisible },
      )}
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cx(dialog({ className, size, position, isVisible }))}
        onClick={handleDialogClick}
        onTransitionEnd={handleTransitionEnd}
        ref={dialogRef}
        tabIndex={-1}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

Dialog.displayName = "KaizenDialog";

export default Dialog;
