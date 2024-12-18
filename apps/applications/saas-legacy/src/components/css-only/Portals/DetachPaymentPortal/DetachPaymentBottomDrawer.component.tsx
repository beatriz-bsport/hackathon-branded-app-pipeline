import React from 'react';
import classNames from 'classnames';

import type { ModalsAndDrawersProps } from '#src/components/css-only/Portals/types';
import BottomDrawer from '#Fabrique/BottomDrawer';
import Alert from '#Fabrique/Alert';
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
  errorMessage,
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
      >
        <Alert
          className={classNames('bs-detach-payment-modal__alert', {
            'bs-detach-payment-modal__alert--hidden': !errorMessage,
          })}
          color="error"
          variant="weak"
        >
          {errorMessage}
        </Alert>
      </BottomDrawer>
    </PortalContainer>
  );
};

export default React.memo(DetachPaymentBottomDrawer);
