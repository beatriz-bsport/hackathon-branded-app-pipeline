import React from 'react';

import MarketplacePageContent from '#csscomponents/MarketplacePageContent';
import ConsumerPassHeader from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassHeader';
import ConsumerPaymentPackListContainer from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPaymentPack/ConsumerPaymentPackListContainer';
import PrivateConsumerPassListContainer from '#libs/consumer-space/components/reworked/@MyPasses/PrivateConsumerPass/PrivateConsumerPassListContainer';
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

import './styles.css';

type Props = {
  activeConsumerPaymentPacksList: ConsumerPaymentPackReworked[];
  activeConsumerPaymentPacksState: ConsumerPassReworked<ConsumerPaymentPackREST>;
  activePrivateConsumerPassesList: PrivateConsumerPassReworked[];
  activePrivateConsumerPassesState: ConsumerPassReworked<PrivateConsumerPassREST>;
  expiredConsumerPaymentPacksList: ConsumerPaymentPackReworked[];
  expiredConsumerPaymentPacksState: ConsumerPassReworked<ConsumerPaymentPackREST>;
  expiredPrivateConsumerPassesList: PrivateConsumerPassReworked[];
  expiredPrivateConsumerPassesState: ConsumerPassReworked<PrivateConsumerPassREST>;
  fetchActiveConsumerPaymentPacks: () => void;
  fetchActivePrivateConsumerPasses: () => void;
  fetchExpiredConsumerPaymentPacks: () => void;
  fetchExpiredPrivateConsumerPasses: () => void;
  fetchFutureConsumerPaymentPacks: () => void;
  fetchFuturePrivateConsumerPasses: () => void;
  futureConsumerPaymentPacksList: ConsumerPaymentPackReworked[];
  futureConsumerPaymentPacksState: ConsumerPassReworked<ConsumerPaymentPackREST>;
  futurePrivateConsumerPassesList: PrivateConsumerPassReworked[];
  futurePrivateConsumerPassesState: ConsumerPassReworked<PrivateConsumerPassREST>;
  handleBookASessionClick: () => void;
  handleBuyPassClick: () => void;
  isLoading: boolean;
};

export const ConsumerPassesPageReworkedComponent: React.FC<Props> = ({
  activeConsumerPaymentPacksList,
  activeConsumerPaymentPacksState,
  activePrivateConsumerPassesList,
  activePrivateConsumerPassesState,
  expiredConsumerPaymentPacksList,
  expiredConsumerPaymentPacksState,
  expiredPrivateConsumerPassesList,
  expiredPrivateConsumerPassesState,
  fetchActiveConsumerPaymentPacks,
  fetchActivePrivateConsumerPasses,
  fetchExpiredConsumerPaymentPacks,
  fetchExpiredPrivateConsumerPasses,
  fetchFutureConsumerPaymentPacks,
  fetchFuturePrivateConsumerPasses,
  futureConsumerPaymentPacksList,
  futureConsumerPaymentPacksState,
  futurePrivateConsumerPassesList,
  futurePrivateConsumerPassesState,
  handleBookASessionClick,
  handleBuyPassClick,
  isLoading,
}) => {
  const {
    selectedTab,
    selectedFilterTab,
    selectedPass,
    handleSetSelectedTab,
    handleSetSelectedFilterTab,
    handleSetSelectedPass,
    handlePaginationFetchMore,
    expiredItemsCount,
    futureItemsCount,
    activeItemsCount,
    nextPage,
    passList,
  } = useConsumerPassesDataManager({
    activeConsumerPaymentPacksList,
    activeConsumerPaymentPacksState,
    activePrivateConsumerPassesList,
    activePrivateConsumerPassesState,
    expiredConsumerPaymentPacksList,
    expiredConsumerPaymentPacksState,
    expiredPrivateConsumerPassesList,
    expiredPrivateConsumerPassesState,
    fetchActiveConsumerPaymentPacks,
    fetchActivePrivateConsumerPasses,
    fetchExpiredConsumerPaymentPacks,
    fetchExpiredPrivateConsumerPasses,
    fetchFutureConsumerPaymentPacks,
    fetchFuturePrivateConsumerPasses,
    futureConsumerPaymentPacksList,
    futureConsumerPaymentPacksState,
    futurePrivateConsumerPassesList,
    futurePrivateConsumerPassesState,
  });

  return (
    <MarketplacePageContent>
      <div className="bs-consumer-pass-page__root">
        <ConsumerPassHeader
          activeItemsCount={activeItemsCount}
          expiredItemsCount={expiredItemsCount}
          futureItemsCount={futureItemsCount}
          handleBookASessionClick={handleBookASessionClick}
          handleBuyPassClick={handleBuyPassClick}
          handleSetSelectedFilterTab={handleSetSelectedFilterTab}
          handleSetSelectedTab={handleSetSelectedTab}
          selectedFilterTab={selectedFilterTab}
          selectedTab={selectedTab}
        />
        {selectedTab === PassTabEnum.PRIVATE_CONSUMER_PASS && (
          <PrivateConsumerPassListContainer
            handlePaginationFetchMore={handlePaginationFetchMore}
            hasNextPage={!!nextPage}
            isLoading={isLoading}
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
            onPassCardClick={handleSetSelectedPass}
            passList={passList as ConsumerPaymentPackReworked[]}
            selectedPass={selectedPass as ConsumerPaymentPackReworked}
          />
        )}
      </div>
    </MarketplacePageContent>
  );
};

export default React.memo(ConsumerPassesPageReworkedComponent);
