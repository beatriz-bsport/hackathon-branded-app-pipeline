import React, { memo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import useViewport from '#Fabrique/hooks/useViewport';
import { MARKETPLACE_BREAKPOINT } from '#src/libs/marketplace/constants';
import ModalDialog from '#Fabrique/ModalDialog';
import Blanket from '#Fabrique/Blanket';
import { PortalContainer } from '#Fabrique/PortalContainer';
import BottomDrawer from '#Fabrique/BottomDrawer';
import './style.css';

type DetailModalContainerProps = {
  /** Whether the modal/drawer is currently open. */
  isModalOpen: boolean;
  /** Function to close the modal/drawer. */
  closeModal: () => void;
  /** Function to handle the confirmation action (e.g., adding to cart). */
  onConfirm: () => void;
  /** Indicates if the submit action is in progress (e.g., loading state). */
  isSubmitLoading: boolean;
  /** The title displayed in the modal/drawer header. */
  title: string;
  /** The content to be displayed within the modal/drawer body. */
  children: ReactNode;
};

/**
 * A container component that renders either a ModalDialog or a BottomDrawer
 * based on the viewport width.
 * It handles the open/close state, confirmation action, and loading state.
 *
 * @param {DetailModalContainerProps} props The component props.
 * @returns {React.ReactElement} The rendered component.
 */
const DetailModalContainer: React.FC<DetailModalContainerProps> = ({
  isModalOpen,
  closeModal,
  onConfirm,
  isSubmitLoading,
  title,
  children,
}) => {
  const { t } = useTranslation('marketplace');
  const { width } = useViewport();
  const isMobile = width < MARKETPLACE_BREAKPOINT.SM;

  if (isMobile) {
    return (
      <BottomDrawer
        blanketProps={{
          isOpen: isModalOpen,
          onClick: closeModal,
        }}
        className="bs-marketplace-detail-modal-drawer"
        modalDialogProps={{
          cancelLabel: t('passes.close'),
          confirmLabel: t('passes.addToCart'),
          isSubmitLoading: isSubmitLoading,
          onCancel: closeModal,
          onClose: closeModal,
          onConfirm: onConfirm,
          size: 'xl',
          title: title,
        }}
      >
        {children}
      </BottomDrawer>
    );
  }
  return (
    <PortalContainer wrapperId="bs-marketplace-detail-modal__portal-container">
      <Blanket
        className="bs-marketplace-detail-modal__blanket"
        isOpen={isModalOpen}
      >
        <ModalDialog
          cancelLabel={t('passes.close')}
          className="bs-marketplace-detail-modal__dialog"
          confirmLabel={t('passes.addToCart')}
          isSubmitLoading={isSubmitLoading}
          onCancel={closeModal}
          onClose={closeModal}
          onConfirm={onConfirm}
          size={'xl'}
          title={title}
        >
          {children}
        </ModalDialog>
      </Blanket>
    </PortalContainer>
  );
};

export default memo(DetailModalContainer);
