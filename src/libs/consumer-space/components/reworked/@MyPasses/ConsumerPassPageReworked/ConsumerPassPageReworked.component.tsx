import React from 'react';

import MarketplacePageContent from '#src/components/css-only/MarketplacePageContent';
import ConsumerPassHeader from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPassHeader';
import ConsumerPaymentPackListContainer from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPaymentPack/ConsumerPaymentPackListContainer';
import PrivateConsumerPassListContainer from '#src/libs/consumer-space/components/reworked/@MyPasses/PrivateConsumerPass/PrivateConsumerPassListContainer';
import UniversalPassListContainer from '#src/libs/consumer-space/components/reworked/@MyPasses/UniversalPass/UniversalPassListContainer';
import ConsumerPassModals from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPassModals';
import { useConsumerPassesDataManager } from '#src/libs/consumer-space/components/reworked/@MyPasses/hooks';
import { PassTabEnum } from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPassTabs/constants';

import type {
  ConsumerPaymentPackREST,
  ConsumerPaymentPackReworked,
} from '#src/libs/consumer-payment-pack/types';
import type {
  PrivateConsumerPassREST,
  PrivateConsumerPassReworked,
} from '#src/libs/private-service/types';
import type {
  ConsumerPassReworked,
  ConsumerPassesTabDisplay,
} from '#src/libs/consumer-space/types';
import type {
  UniversalPassREST,
  UniversalPassReworked,
} from '#src/libs/universal-pass/types';

import './styles.css';

type Props = {
  activeConsumerPaymentPacksList: ConsumerPaymentPackReworked[];
  activeConsumerPaymentPacksState: ConsumerPassReworked<ConsumerPaymentPackREST>;
  activePrivateConsumerPassesList: PrivateConsumerPassReworked[];
  activePrivateConsumerPassesState: ConsumerPassReworked<PrivateConsumerPassREST>;
  activeUniversalPassesList: UniversalPassReworked[];
  activeUniversalPassesState: ConsumerPassReworked<UniversalPassREST>;
  consumerPassesTabDisplay: ConsumerPassesTabDisplay;
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
  isConsumerPassesTabDisplayLoading: boolean;
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
  consumerPassesTabDisplay,
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
  isConsumerPassesTabDisplayLoading,
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
    consumerPassesTabDisplay,
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
          consumerPassesTabDisplay={consumerPassesTabDisplay}
          futureItemsCount={futureItemsCount}
          handleBookASessionClick={handleBookASessionClick}
          handleBuyPassClick={handleBuyPassClick}
          handleSetSelectedFilterTab={handleSetSelectedFilterTab}
          handleSetSelectedTab={handleSetSelectedTab}
          handleTogglePassTabDrawer={handleTogglePassTabDrawer}
          isLoading={isConsumerPassesTabDisplayLoading}
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
            selectedFilterTab={selectedFilterTab}
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
            selectedFilterTab={selectedFilterTab}
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
            selectedFilterTab={selectedFilterTab}
            selectedPass={selectedPass as UniversalPassReworked}
          />
        )}
      </div>
    </MarketplacePageContent>
  );
};

export default React.memo(ConsumerPassesPageReworkedComponent);
