import React from 'react';

import type { FranchiseMarketingPreferencesProps } from '#src/components/css-only/Portals/types';
import {
  FranchiseMarketingPreferencesModal,
  FranchiseMarketingPreferencesDrawer,
} from '.';

const FranchiseMarketingPreferencesPortal: React.FC<
  FranchiseMarketingPreferencesProps
> = ({
  preferences,
  isMobile,
  isOpen,
  onClose,
  cancelLabel,
  title,
  subtitle,
  updateMyFranchiseMarketingPreferences,
}) => {
  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);

  if (isMobile) {
    return (
      <FranchiseMarketingPreferencesDrawer
        cancelLabel={cancelLabel}
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={updateMyFranchiseMarketingPreferences}
        preferences={preferences}
        subtitle={subtitle}
        title={title}
      />
    );
  }
  return (
    <FranchiseMarketingPreferencesModal
      cancelLabel={cancelLabel}
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={updateMyFranchiseMarketingPreferences}
      preferences={preferences}
      subtitle={subtitle}
      title={title}
    />
  );
};

export default React.memo(FranchiseMarketingPreferencesPortal);
