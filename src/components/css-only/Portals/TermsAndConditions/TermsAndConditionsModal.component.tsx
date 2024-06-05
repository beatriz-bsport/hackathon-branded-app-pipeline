import React from 'react';
import { PortalContainer } from '#Fabrique/PortalContainer';
import Blanket from '#Fabrique/Blanket';
import ModalDialog from '#Fabrique/ModalDialog';

import Typography from '#Fabrique/Typography';
import type { TermsModalsAndDrawersProps } from '#src/components/css-only/Portals/types';
import '#src/components/css-only/Portals/styles.css';

const TermsAndConditionsModal: React.FC<TermsModalsAndDrawersProps> = ({
  isOpen,
  onClose,
  subtitle,
  title,
  cancelLabel,
  terms,
}) => {
  return (
    <PortalContainer wrapperId="bs-terms-and-conditions-portal-container">
      <Blanket className="bs-portals-blanket" isOpen={isOpen}>
        <ModalDialog
          cancelLabel={cancelLabel}
          classes={{ content: 'bs-portals-modal__content' }}
          className="bs-terms-and-conditions-modal"
          onCancel={onClose}
          onClose={onClose}
          subtitle={subtitle}
          title={title}
        >
          <Typography variant="body-md">{terms}</Typography>
        </ModalDialog>
      </Blanket>
    </PortalContainer>
  );
};

export default React.memo(TermsAndConditionsModal);
