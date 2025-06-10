import React, { useCallback } from "react";

import Body from "#src/components/Body";
import Button from "#src/components/Button";
import Title from "#src/components/Title";
import Dialog, { type DialogSize } from "#src/components/private/Dialog";

import Footer from "./Footer";
import type { ConfirmColor, FooterDirection } from "./types";

export type ModalProps = React.HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  size: DialogSize;
  title: string;
  description?: React.ReactNode;
  footerDirection?: FooterDirection;
  onClose?: () => void;
  onCrossButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClickOutside?: (event: React.MouseEvent<HTMLDivElement>) => void;
  confirmLabel?: string;
  confirmColor?: ConfirmColor;
  onConfirmClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  cancelLabel?: string;
  onCancelClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
};

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
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleCrossButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onCrossButtonClick?.(event);
      handleClose();
    },
    [onCrossButtonClick, handleClose],
  );

  return (
    <Dialog
      open={open}
      size={size}
      onClose={onClose}
      onClickOutside={onClickOutside}
      className={className}
      aria-labelledby="modal-title"
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

      {children && (
        <div className="p-md flex-grow overflow-y-auto">{children}</div>
      )}

      <Footer
        cancelLabel={cancelLabel}
        confirmLabel={confirmLabel}
        confirmColor={confirmColor}
        onConfirmClick={onConfirmClick}
        onCancelClick={onCancelClick}
        footerDirection={footerDirection}
      />
    </Dialog>
  );
};

Modal.displayName = "KaizenModal";

export default Modal;
