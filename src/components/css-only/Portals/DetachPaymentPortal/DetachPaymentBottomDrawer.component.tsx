import React from 'react';
import type { ModalsAndDrawersProps } from '#csscomponents/Portals/types';
import BottomDrawer from '#Fabrique/BottomDrawer';
import { PortalContainer } from '#Fabrique/PortalContainer';
import '#csscomponents/Portals/styles.css';

const DetachPaymentBottomDrawer: React.FC<ModalsAndDrawersProps> = ({
  cancelLabel,
  confirmLabel,
  isOpen,
  onClose,
  onConfirm,
  subtitle,
  title,
}) => {
  return (
    <PortalContainer wrapperId="bs-detach-payment-portal-container">
      <BottomDrawer
        blanketProps={{ isOpen, onClick: onClose }}
        className="bs-detach-payment-drawer__root"
        modalDialogProps={{
          cancelLabel,
          confirmButtonColor: 'error',
          confirmLabel,
          onClose,
          onConfirm,
          subtitle,
          title,
        }}
      />
    </PortalContainer>
  );
};

export default React.memo(DetachPaymentBottomDrawer);
