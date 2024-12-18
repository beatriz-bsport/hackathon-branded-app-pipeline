import React from 'react';
import classNames from 'classnames';

import { PortalContainer } from '#Fabrique/PortalContainer';
import Blanket from '#Fabrique/Blanket';
import ModalDialog from '#Fabrique/ModalDialog';
import Alert from '#Fabrique/Alert';

import type { ModalsAndDrawersProps } from '#src/components/css-only/Portals/types';
import '#src/components/css-only/Portals/styles.css';

const DetachPaymentModal: React.FC<ModalsAndDrawersProps> = ({
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
      <Blanket className="bs-portals-blanket" isOpen={isOpen}>
        <ModalDialog
          cancelLabel={cancelLabel}
          className="bs-detach-payment-modal"
          confirmButtonColor="error"
          confirmLabel={confirmLabel}
          isSubmitLoading={isLoading}
          onCancel={onClose}
          onClose={onClose}
          onConfirm={onConfirm}
          subtitle={subtitle}
          title={title}
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
        </ModalDialog>
      </Blanket>
    </PortalContainer>
  );
};

export default React.memo(DetachPaymentModal);
