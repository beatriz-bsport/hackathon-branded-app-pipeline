import React from 'react';
import BottomDrawer from '#Fabrique/BottomDrawer';
import Typography from '#Fabrique/Typography';
import type { TermsModalsAndDrawersProps } from '#csscomponents/Portals/types';

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
  );
};

export default React.memo(TermsAndConditionsDrawer);
