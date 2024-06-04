import React from 'react';
import BottomDrawer from '#Fabrique/BottomDrawer';
import Typography from '#Fabrique/Typography';
import type { TermsModalsAndDrawersProps } from '#csscomponents/Portals/types';
import { PortalContainer } from '#Fabrique/PortalContainer';

import '#csscomponents/Portals/styles.css';

const TermsAndConditionsDrawer: React.FC<TermsModalsAndDrawersProps> = ({
  cancelLabel,
  isOpen,
  onClose,
  subtitle,
  title,
  terms,
}) => {
  return (
    <PortalContainer wrapperId="bs-terms-and-conditions-portal-container">
      <BottomDrawer
        blanketProps={{ isOpen, onClick: onClose }}
        className="bs-terms-and-conditions-drawer__root"
        modalDialogProps={{
          classes: { content: 'bs-portals-modal__content' },
          cancelLabel,
          onClose,
          subtitle,
          title,
        }}
      >
        <Typography variant="body-md">{terms}</Typography>
      </BottomDrawer>
    </PortalContainer>
  );
};

export default React.memo(TermsAndConditionsDrawer);
