import React from 'react';

import { PortalContainer } from '#Fabrique/PortalContainer';

import UniversalPassDetailsDrawer from '#libs/consumer-space/components/reworked/@MyPasses/UniversalPass/UniversalPassDetailsDrawer';
import ConsumerPassTabsDrawer from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassTabsDrawer';

import type { ConsumerPaymentPackReworked } from '#libs/consumer-payment-pack/types';
import type { PrivateConsumerPassReworked } from '#libs/private-service/types';
import type { UniversalPassReworked } from '#libs/universal-pass/types';
import type { PassTab } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassTabs/types';

type Props = {
  isUniversalPassDetailsDrawerOpen: boolean;
  isPassTabDrawerOpen: boolean;
  selectedPass:
    | ConsumerPaymentPackReworked
    | PrivateConsumerPassReworked
    | UniversalPassReworked;
  isMobile: boolean;
  handleSetSelectedTab: (passTab: PassTab) => void;
  handleTogglePassDetailsDrawer: () => void;
  handleTogglePassTabDrawer: () => void;
  isMetadataLoading?: boolean;
  isLoading?: boolean;
  selectedPassTab: PassTab;
};

const ConsumerPassModals: React.FC<Props> = ({
  isUniversalPassDetailsDrawerOpen,
  isPassTabDrawerOpen,
  selectedPass,
  isMobile,
  handleTogglePassDetailsDrawer,
  handleSetSelectedTab,
  handleTogglePassTabDrawer,
  isMetadataLoading,
  isLoading,
  selectedPassTab,
}) => {
  if (!isMobile) {
    return null;
  }

  return (
    <PortalContainer wrapperId="bs-consumer-pass-modals-portal-container">
      <UniversalPassDetailsDrawer
        handleTogglePassDetailsDrawer={handleTogglePassDetailsDrawer}
        isLoading={isLoading}
        isMetadataLoading={isMetadataLoading}
        isOpen={isUniversalPassDetailsDrawerOpen}
        selectedPass={selectedPass as UniversalPassReworked}
      />
      <ConsumerPassTabsDrawer
        handleClose={handleTogglePassTabDrawer}
        handleSetSelectedTab={handleSetSelectedTab}
        isOpen={isPassTabDrawerOpen}
        selectedPassTab={selectedPassTab}
      />
    </PortalContainer>
  );
};

export default React.memo(ConsumerPassModals);
