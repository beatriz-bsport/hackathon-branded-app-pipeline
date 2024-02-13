import React from 'react';

import MarketplacePageContent from '#csscomponents/MarketplacePageContent';
import ConsumerPassHeader from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassHeader';
import ConsumerPaymentPackListContainer from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPaymentPack/ConsumerPaymentPackListContainer';
import PrivateConsumerPassListContainer from '#libs/consumer-space/components/reworked/@MyPasses/PrivateConsumerPass/PrivateConsumerPassListContainer';
import UniversalPassListContainer from '#libs/consumer-space/components/reworked/@MyPasses/UniversalPass/UniversalPassListContainer';
import ConsumerPassModals from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassModals';
import { useConsumerPassesDataManager } from '#libs/consumer-space/components/reworked/@MyPasses/hooks';
import { PassTabEnum } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassTabs/constants';

import type {
  ConsumerPaymentPackREST,
  ConsumerPaymentPackReworked,
} from '#libs/consumer-payment-pack/types';
import type {
  PrivateConsumerPassREST,
  PrivateConsumerPassReworked,
} from '#libs/private-service/types';
import type { ConsumerPassReworked } from '#libs/consumer-space/types';
import type {
  UniversalPassREST,
  UniversalPassReworked,
} from '#libs/universal-pass/types';

import './styles.css';

type Props = {
  activeConsumerPaymentPacksList: ConsumerPaymentPackReworked[];
  activeConsumerPaymentPacksState: ConsumerPassReworked<ConsumerPaymentPackREST>;
  activePrivateConsumerPassesList: PrivateConsumerPassReworked[];
  activePrivateConsumerPassesState: ConsumerPassReworked<PrivateConsumerPassREST>;
  activeUniversalPassesList: UniversalPassReworked[];
  activeUniversalPassesState: ConsumerPassReworked<UniversalPassREST>;
  expiredConsumerPaymentPacksList: ConsumerPaymentPackReworked[];
  expiredConsumerPaymentPacksState: ConsumerPassReworked<ConsumerPaymentPackREST>;
  expiredPrivateConsumerPassesList: PrivateConsumerPassReworked[];
  expiredPrivateConsumerPassesState: ConsumerPassReworked<PrivateConsumerPassREST>;
  expiredUniversalPassesList: UniversalPassReworked[];
  expiredUniversalPassesState: ConsumerPassReworked<UniversalPassREST>;
  fetchActiveConsumerPaymentPacks: () => void;
  fetchActivePrivateConsumerPasses: () => void;
  fetchActiveUniversalPasses: () => void;
  fetchExpiredConsumerPaymentPacks: () => void;
  fetchExpiredPrivateConsumerPasses: () => void;
  fetchExpiredUniversalPasses: () => void;
  fetchFutureConsumerPaymentPacks: () => void;
  fetchFuturePrivateConsumerPasses: () => void;
  fetchFutureUniversalPasses: () => void;
  futureConsumerPaymentPacksList: ConsumerPaymentPackReworked[];
  futureConsumerPaymentPacksState: ConsumerPassReworked<ConsumerPaymentPackREST>;
  futurePrivateConsumerPassesList: PrivateConsumerPassReworked[];
  futurePrivateConsumerPassesState: ConsumerPassReworked<PrivateConsumerPassREST>;
  futureUniversalPassesList: UniversalPassReworked[];
  futureUniversalPassesState: ConsumerPassReworked<UniversalPassREST>;
  handleBookASessionClick: () => void;
  handleBuyPassClick: () => void;
  isLoading: boolean;
  isMetadataLoading: boolean;
  resetConsumerState: () => void;
};

export const ConsumerPassesPageReworkedComponent: React.FC<Props> = ({
  activeConsumerPaymentPacksList,
  activeConsumerPaymentPacksState,
  activePrivateConsumerPassesList,
  activePrivateConsumerPassesState,
  activeUniversalPassesList,
  activeUniversalPassesState,
  expiredConsumerPaymentPacksList,
  expiredConsumerPaymentPacksState,
  expiredPrivateConsumerPassesList,
  expiredPrivateConsumerPassesState,
  expiredUniversalPassesList,
  expiredUniversalPassesState,
  fetchActiveConsumerPaymentPacks,
  fetchActivePrivateConsumerPasses,
  fetchActiveUniversalPasses,
  fetchExpiredConsumerPaymentPacks,
  fetchExpiredPrivateConsumerPasses,
  fetchExpiredUniversalPasses,
  fetchFutureConsumerPaymentPacks,
  fetchFuturePrivateConsumerPasses,
  fetchFutureUniversalPasses,
  futureConsumerPaymentPacksList,
  futureConsumerPaymentPacksState,
  futurePrivateConsumerPassesList,
  futurePrivateConsumerPassesState,
  futureUniversalPassesList,
  futureUniversalPassesState,
  handleBookASessionClick,
  handleBuyPassClick,
  isLoading,
  isMetadataLoading,
  resetConsumerState,
}) => {
  const {
    selectedTab,
    selectedFilterTab,
    selectedPass,
    isConsumerPaymentPackDetailsDrawerOpen,
    isPrivateConsumerPassDetailsDrawerOpen,
    isUniversalPassDetailsDrawerOpen,
    isPassTabDrawerOpen,
    handleSetSelectedTab,
    handleSetSelectedFilterTab,
    handleSetSelectedPass,
    handlePaginationFetchMore,
    handleTogglePassDetailsDrawer,
    handleTogglePassTabDrawer,
    futureItemsCount,
    activeItemsCount,
    nextPage,
    passList,
    isMobile,
  } = useConsumerPassesDataManager({
    activeConsumerPaymentPacksList,
    activeConsumerPaymentPacksState,
    activePrivateConsumerPassesList,
    activePrivateConsumerPassesState,
    activeUniversalPassesList,
    activeUniversalPassesState,
    expiredConsumerPaymentPacksList,
    expiredConsumerPaymentPacksState,
    expiredPrivateConsumerPassesList,
    expiredPrivateConsumerPassesState,
    expiredUniversalPassesList,
    expiredUniversalPassesState,
    fetchActiveConsumerPaymentPacks,
    fetchActivePrivateConsumerPasses,
    fetchActiveUniversalPasses,
    fetchExpiredConsumerPaymentPacks,
    fetchExpiredPrivateConsumerPasses,
    fetchExpiredUniversalPasses,
    fetchFutureConsumerPaymentPacks,
    fetchFuturePrivateConsumerPasses,
    fetchFutureUniversalPasses,
    futureConsumerPaymentPacksList,
    futureConsumerPaymentPacksState,
    futurePrivateConsumerPassesList,
    futurePrivateConsumerPassesState,
    futureUniversalPassesList,
    futureUniversalPassesState,
    resetConsumerState,
  });

  return (
    <MarketplacePageContent>
      <div className="bs-consumer-pass-page__root">
        <ConsumerPassModals
          handleSetSelectedTab={handleSetSelectedTab}
          handleTogglePassDetailsDrawer={handleTogglePassDetailsDrawer}
          handleTogglePassTabDrawer={handleTogglePassTabDrawer}
          isConsumerPaymentPackDetailsDrawerOpen={
            isConsumerPaymentPackDetailsDrawerOpen
          }
          isLoading={isLoading}
          isMetadataLoading={isMetadataLoading}
          isMobile={isMobile}
          isPassTabDrawerOpen={isPassTabDrawerOpen}
          isPrivateConsumerPassDetailsDrawerOpen={
            isPrivateConsumerPassDetailsDrawerOpen
          }
          isUniversalPassDetailsDrawerOpen={isUniversalPassDetailsDrawerOpen}
          selectedPass={selectedPass}
          selectedPassTab={selectedTab}
        />
        <ConsumerPassHeader
          activeItemsCount={activeItemsCount}
          futureItemsCount={futureItemsCount}
          handleBookASessionClick={handleBookASessionClick}
          handleBuyPassClick={handleBuyPassClick}
          handleSetSelectedFilterTab={handleSetSelectedFilterTab}
          handleSetSelectedTab={handleSetSelectedTab}
          handleTogglePassTabDrawer={handleTogglePassTabDrawer}
          isMobile={isMobile}
          selectedFilterTab={selectedFilterTab}
          selectedTab={selectedTab}
        />
        {selectedTab === PassTabEnum.PRIVATE_CONSUMER_PASS && (
          <PrivateConsumerPassListContainer
            handlePaginationFetchMore={handlePaginationFetchMore}
            hasNextPage={!!nextPage}
            isLoading={isLoading}
            isMetadataLoading={isMetadataLoading}
            isMobile={isMobile}
            onPassCardClick={handleSetSelectedPass}
            passList={passList as PrivateConsumerPassReworked[]}
            selectedPass={selectedPass as PrivateConsumerPassReworked}
          />
        )}
        {selectedTab === PassTabEnum.CONSUMER_PAYMENT_PACK && (
          <ConsumerPaymentPackListContainer
            handlePaginationFetchMore={handlePaginationFetchMore}
            hasNextPage={!!nextPage}
            isLoading={isLoading}
            isMetadataLoading={isMetadataLoading}
            isMobile={isMobile}
            onPassCardClick={handleSetSelectedPass}
            passList={passList as ConsumerPaymentPackReworked[]}
            selectedPass={selectedPass as ConsumerPaymentPackReworked}
          />
        )}
        {selectedTab === PassTabEnum.UNIVERSAL_PASS && (
          <UniversalPassListContainer
            handlePaginationFetchMore={handlePaginationFetchMore}
            hasNextPage={!!nextPage}
            isLoading={isLoading}
            isMetadataLoading={isMetadataLoading}
            isMobile={isMobile}
            onPassCardClick={handleSetSelectedPass}
            passList={passList as UniversalPassReworked[]}
            selectedPass={selectedPass as UniversalPassReworked}
          />
        )}
      </div>
    </MarketplacePageContent>
  );
};

export default React.memo(ConsumerPassesPageReworkedComponent);
