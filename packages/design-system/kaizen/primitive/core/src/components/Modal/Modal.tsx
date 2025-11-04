import { type FC } from "react";

import Body from "#src/components/Body";
import Button from "#src/components/Button";
import type {
  CancelButtonProps,
  ConfirmButtonProps,
} from "#src/components/ModalStepper/types";
import Title from "#src/components/Title";
import Dialog, {
  type DialogPosition,
  type DialogSize,
} from "#src/components/private/Dialog";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import Footer from "./Footer";
import type { FooterDirection } from "./types";

export type ModalProps = React.HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  size: DialogSize;
  title: string;
  description?: React.ReactNode;
  footerDirection?: FooterDirection;
  position?: DialogPosition;
  onClose?: () => void;
  onCloseButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClickOutside?: (event: React.MouseEvent<HTMLDivElement>) => void;
  confirmButton?: ConfirmButtonProps;
  cancelButton?: CancelButtonProps;
  children?: string | React.ReactNode;
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
 * @param props.position Position of the modal. Can be "centered" or "bottom". Defaults to "centered".
 * @param props.onClose Function to call when the modal is closed.
 * @param props.onCloseButtonClick Function to call when the cross button is clicked.
 * @param props.onClickOutside Function to call when the modal is clicked outside.
 * @param props.confirmButton Confirm button props.
 * @param props.cancelButton Cancel button props.
 * @param props.children Content in the middle of the modal.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-modal--docs
 */
const Modal: FC<ModalProps> = ({
  className,
  open,
  size,
  title,
  description,
  footerDirection = "row",
  position = "centered",
  onClose,
  onCloseButtonClick,
  onClickOutside,
  confirmButton,
  cancelButton,
  children,
  ...props
}) => {
  const i18n = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n });

  const handleClose = () => {
    onClose?.();
  };

  const handleCloseButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onCloseButtonClick?.(event);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      size={size}
      position={position}
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
          label={t("modal.close")}
          kind="icon-button"
          icon="x"
          className="h-fit"
          onClick={handleCloseButtonClick}
        />
      </div>

      {children !== undefined && (
        <div className="p-md flex-grow overflow-y-auto">
          {typeof children === "string" ? (
            <Body htmlVariant="p" size="md" weight="weak">
              {children}
            </Body>
          ) : (
            children
          )}
        </div>
      )}

      <Footer
        confirmButton={confirmButton}
        cancelButton={cancelButton}
        footerDirection={footerDirection}
      />
    </Dialog>
  );
};

Modal.displayName = "KaizenModal";

export default Modal;
