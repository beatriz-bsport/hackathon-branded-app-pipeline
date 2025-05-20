import React from 'react';
import BottomDrawer from '#src/components/css-only/Fabrique/BottomDrawer';
import type { FranchiseMarketingPreferencesModalsAndDrawersProps } from '#src/components/css-only/Portals/types';
import FranchiseMarketingPreferences from './FranchiseMarketingPreferences.component';
import { PortalContainer } from '#Fabrique/PortalContainer';
import '#src/components/css-only/Portals/styles.css';

const FranchiseMarketingPreferencesDrawer: React.FC<
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
      <BottomDrawer
        blanketProps={{ isOpen, onClick: onClose }}
        className="bs-franchise-marketing-preferences-drawer__root"
        modalDialogProps={{
          classes: { content: 'bs-franchise-marketing-preferences__content' },
          cancelLabel,
          onClose,
          subtitle,
          title,
        }}
      >
        <FranchiseMarketingPreferences
          onSubmit={onSubmit}
          preferences={preferences}
        />
      </BottomDrawer>
    </PortalContainer>
  );
};

export default React.memo(FranchiseMarketingPreferencesDrawer);
