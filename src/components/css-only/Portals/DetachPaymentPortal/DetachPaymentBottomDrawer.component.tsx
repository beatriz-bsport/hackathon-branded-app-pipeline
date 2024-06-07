import React from 'react';
import type { ModalsAndDrawersProps } from '#src/components/css-only/Portals/types';
import BottomDrawer from '#Fabrique/BottomDrawer';
import { PortalContainer } from '#Fabrique/PortalContainer';

import '#src/components/css-only/Portals/styles.css';

const DetachPaymentBottomDrawer: React.FC<ModalsAndDrawersProps> = ({
  cancelLabel,
  confirmLabel,
  isOpen,
  onClose,
  onConfirm,
  subtitle,
  title,
  isLoading,
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
          isSubmitLoading: isLoading,
        }}
      />
    </PortalContainer>
  );
};

export default React.memo(DetachPaymentBottomDrawer);
