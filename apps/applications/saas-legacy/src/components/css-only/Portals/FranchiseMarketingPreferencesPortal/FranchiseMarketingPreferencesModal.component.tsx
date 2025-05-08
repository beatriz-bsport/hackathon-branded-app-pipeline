import React from 'react';
import { PortalContainer } from '#Fabrique/PortalContainer';
import Blanket from '#Fabrique/Blanket';
import ModalDialog from '#Fabrique/ModalDialog';
import FranchiseMarketingPreferences from './FranchiseMarketingPreferences.component';
import type { FranchiseMarketingPreferencesModalsAndDrawersProps } from '#src/components/css-only/Portals/types';
import '#src/components/css-only/Portals/styles.css';

const FranchiseMarketingPreferencesModal: React.FC<
  FranchiseMarketingPreferencesModalsAndDrawersProps
> = ({
  preferences,
  cancelLabel,
  isOpen,
  onClose,
  subtitle,
  title,
  onSubmit,
}) => {
  return (
    <PortalContainer wrapperId="bs-franchise-marketing-preferences-portal-container">
      <Blanket className="bs-portals-blanket" isOpen={isOpen}>
        <ModalDialog
          cancelLabel={cancelLabel}
          classes={{
            content: 'bs-franchise-marketing-preferences__content',
          }}
          className="bs-franchise-marketing-preferences-modal"
          onCancel={onClose}
          onClose={onClose}
          subtitle={subtitle}
          title={title}
        >
          <FranchiseMarketingPreferences
            onSubmit={onSubmit}
            preferences={preferences}
          />
        </ModalDialog>
      </Blanket>
    </PortalContainer>
  );
};

export default React.memo(FranchiseMarketingPreferencesModal);
