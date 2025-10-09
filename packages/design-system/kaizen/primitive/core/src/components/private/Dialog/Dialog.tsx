import { cva, cx } from "class-variance-authority";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import useEscapeKeydownListener from "#src/hooks/escape-keydown-listener.hook";
import { useFocusManagement } from "#src/hooks/use-focus-management";

import { useDocumentOverflow } from "./use-document-overflow";

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

const dialog = cva(defaultClasses, { variants });

export type DialogSize = "sm" | "md" | "lg";

export type DialogProps = React.HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  size: DialogSize;
  onClose?: () => void;
  onClickOutside?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

/**
 * A private component that handles the dialog behavior including portal creation,
 * backdrop, focus management, and animation states.
 */
const Dialog: React.FC<DialogProps> = ({
  className,
  open,
  size,
  onClose,
  onClickOutside,
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { setOverflowHidden, resetOverflow } = useDocumentOverflow();
  const dialogRef = useFocusManagement<HTMLDivElement>(open && isVisible);

  const handleClose = () => {
    // Trigger CSS transition by changing the isVisible state
    // Component will be unmounted when transition completes via onTransitionEnd
    setIsVisible(false);
  };

  // Handle the transition end event to complete unmounting
  const handleTransitionEnd = () => {
    // Only handle transition end when closing (not visible)
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

  useEscapeKeydownListener(handleClose, open);

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
        className={cx(dialog({ className, size, isVisible }))}
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
