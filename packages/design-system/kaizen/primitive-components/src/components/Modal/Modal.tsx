import React, { useCallback } from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import type { SetRequired } from "type-fest";
import mapValues from "lodash/mapValues";
import Title from "../Title";
import Body from "../Body";
import Button from "../Button";

const defaultClasses = [
  "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  "rounded-lg shadow-xl overflow-hidden",
  "bg-surface-default-elevated",
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
    onCrossButtonClick?: () => void;
    onClickOutside?: () => void;
  } & ({
    confirmLabel: string;
    confirmColor: (typeof confirmColors)[number];
    onConfirmClick: () => void;
  } | null) &
  ({
    cancelLabel?: string;
    onCancelClick?: () => void;
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
  if (!open) return null;

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClickOutside?.();
        onClose?.();
      }
    },
    [onClickOutside, onClose],
  );
  const handleCrossButtonClick = useCallback(() => {
    onCrossButtonClick?.();
    onClose?.();
  }, [onCrossButtonClick, onClose]);
  const handleCancelClick = useCallback(() => {
    onCancelClick?.();
    onClose?.();
  }, [onCancelClick, onClose]);

  const handleModalClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation(),
    [],
  );

  return createPortal(
    <div className="fixed inset-[0]" onClick={handleBackdropClick}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={modal({ className, size })}
        onClick={handleModalClick}
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
        {children && <div className="p-md">{children}</div>}
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
