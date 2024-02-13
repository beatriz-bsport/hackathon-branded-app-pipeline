import React from 'react';

import { PortalContainer } from '#Fabrique/PortalContainer';

import UniversalPassDetailsDrawer from '#libs/consumer-space/components/reworked/@MyPasses/UniversalPass/UniversalPassDetailsDrawer';
import PrivateConsumerPassDetailsDrawer from '#libs/consumer-space/components/reworked/@MyPasses/PrivateConsumerPass/PrivateConsumerPassDetailsDrawer';
import ConsumerPaymentPackDetailsDrawer from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPaymentPack/ConsumerPaymentPackDetailsDrawer';
import ConsumerPassTabsDrawer from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassTabsDrawer';

import type { ConsumerPaymentPackReworked } from '#libs/consumer-payment-pack/types';
import type { PrivateConsumerPassReworked } from '#libs/private-service/types';
import type { UniversalPassReworked } from '#libs/universal-pass/types';
import type { PassTab } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassTabs/types';
import { PassTabEnum } from '../ConsumerPassTabs/constants';

type Props = {
  isConsumerPaymentPackDetailsDrawerOpen: boolean;
  isPrivateConsumerPassDetailsDrawerOpen: boolean;
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
  isConsumerPaymentPackDetailsDrawerOpen,
  isPrivateConsumerPassDetailsDrawerOpen,
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
      {selectedPassTab === PassTabEnum.CONSUMER_PAYMENT_PACK && (
        <ConsumerPaymentPackDetailsDrawer
          handleTogglePassDetailsDrawer={handleTogglePassDetailsDrawer}
          isLoading={isLoading}
          isMetadataLoading={isMetadataLoading}
          isOpen={isConsumerPaymentPackDetailsDrawerOpen}
          selectedPass={selectedPass as ConsumerPaymentPackReworked}
        />
      )}
      {selectedPassTab === PassTabEnum.PRIVATE_CONSUMER_PASS && (
        <PrivateConsumerPassDetailsDrawer
          handleTogglePassDetailsDrawer={handleTogglePassDetailsDrawer}
          isLoading={isLoading}
          isMetadataLoading={isMetadataLoading}
          isOpen={isPrivateConsumerPassDetailsDrawerOpen}
          selectedPass={selectedPass as PrivateConsumerPassReworked}
        />
      )}
      {selectedPassTab === PassTabEnum.UNIVERSAL_PASS && (
        <UniversalPassDetailsDrawer
          handleTogglePassDetailsDrawer={handleTogglePassDetailsDrawer}
          isLoading={isLoading}
          isMetadataLoading={isMetadataLoading}
          isOpen={isUniversalPassDetailsDrawerOpen}
          selectedPass={selectedPass as UniversalPassReworked}
        />
      )}
      {isMobile && isPassTabDrawerOpen && (
        <ConsumerPassTabsDrawer
          handleClose={handleTogglePassTabDrawer}
          handleSetSelectedTab={handleSetSelectedTab}
          isOpen={isPassTabDrawerOpen}
          selectedPassTab={selectedPassTab}
        />
      )}
    </PortalContainer>
  );
};

export default React.memo(ConsumerPassModals);
