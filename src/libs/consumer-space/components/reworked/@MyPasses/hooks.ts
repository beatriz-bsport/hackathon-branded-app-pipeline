import { useCallback, useMemo, useState } from 'react';

import { PassTabEnum } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassTabs/constants';
import { PassFilterTabEnum } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassFilters/constants';

import type { PrivateConsumerPassReworked } from '#libs/private-service/types';
import type { PassTab } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassTabs/types';
import type { ConsumerPaymentPackReworked } from '#libs/consumer-payment-pack/types';
import type { PassFilterTab } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassFilters/types';
import type { ConsumerPassPageReworkedProps } from './ConsumerPassPageReworked';

/** Provides all of the necessary data and fetch handlers for consumer passes page */
export function useConsumerPassesDataManager({
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
}: Omit<
  ConsumerPassPageReworkedProps,
  'isLoading' | 'handleBuyPassClick' | 'handleBookASessionClick'
>) {
  /* PAGE STATES */
  const [selectedTab, setSelectedTab] = useState<PassTab>(
    PassTabEnum.CONSUMER_PAYMENT_PACK,
  );
  const [selectedFilterTab, setSelectedFilterTab] = useState<PassFilterTab>(
    PassFilterTabEnum.ACTIVE,
  );
  const [selectedPass, setSelectedPass] = useState<
    ConsumerPaymentPackReworked | PrivateConsumerPassReworked | null
  >(null);

  const fetchMoreDataHandlerMap = useMemo(
    () => ({
      [`${PassTabEnum.CONSUMER_PAYMENT_PACK}-${PassFilterTabEnum.EXPIRED}`]:
        fetchExpiredConsumerPaymentPacks,
      [`${PassTabEnum.CONSUMER_PAYMENT_PACK}-${PassFilterTabEnum.FUTURE}`]:
        fetchFutureConsumerPaymentPacks,
      [`${PassTabEnum.CONSUMER_PAYMENT_PACK}-${PassFilterTabEnum.ACTIVE}`]:
        fetchActiveConsumerPaymentPacks,
      [`${PassTabEnum.PRIVATE_CONSUMER_PASS}-${PassFilterTabEnum.EXPIRED}`]:
        fetchExpiredPrivateConsumerPasses,
      [`${PassTabEnum.PRIVATE_CONSUMER_PASS}-${PassFilterTabEnum.FUTURE}`]:
        fetchFuturePrivateConsumerPasses,
      [`${PassTabEnum.PRIVATE_CONSUMER_PASS}-${PassFilterTabEnum.ACTIVE}`]:
        fetchActivePrivateConsumerPasses,
    }),
    [
      fetchActiveConsumerPaymentPacks,
      fetchActivePrivateConsumerPasses,
      fetchExpiredConsumerPaymentPacks,
      fetchExpiredPrivateConsumerPasses,
      fetchFutureConsumerPaymentPacks,
      fetchFuturePrivateConsumerPasses,
    ],
  );

  const fetchTabDataHandlerMap = useMemo(
    () => ({
      [PassTabEnum.CONSUMER_PAYMENT_PACK]: () => {
        fetchActiveConsumerPaymentPacks();
        fetchExpiredConsumerPaymentPacks();
        fetchFutureConsumerPaymentPacks();
      },
      [PassTabEnum.PRIVATE_CONSUMER_PASS]: () => {
        fetchActivePrivateConsumerPasses();
        fetchExpiredPrivateConsumerPasses();
        fetchFuturePrivateConsumerPasses();
      },
    }),
    [
      fetchActiveConsumerPaymentPacks,
      fetchActivePrivateConsumerPasses,
      fetchExpiredConsumerPaymentPacks,
      fetchExpiredPrivateConsumerPasses,
      fetchFutureConsumerPaymentPacks,
      fetchFuturePrivateConsumerPasses,
    ],
  );

  const currentStateMap = {
    [`${PassTabEnum.CONSUMER_PAYMENT_PACK}-${PassFilterTabEnum.EXPIRED}`]:
      expiredConsumerPaymentPacksState,
    [`${PassTabEnum.CONSUMER_PAYMENT_PACK}-${PassFilterTabEnum.FUTURE}`]:
      futureConsumerPaymentPacksState,
    [`${PassTabEnum.CONSUMER_PAYMENT_PACK}-${PassFilterTabEnum.ACTIVE}`]:
      activeConsumerPaymentPacksState,
    [`${PassTabEnum.PRIVATE_CONSUMER_PASS}-${PassFilterTabEnum.EXPIRED}`]:
      expiredPrivateConsumerPassesState,
    [`${PassTabEnum.PRIVATE_CONSUMER_PASS}-${PassFilterTabEnum.FUTURE}`]:
      futurePrivateConsumerPassesState,
    [`${PassTabEnum.PRIVATE_CONSUMER_PASS}-${PassFilterTabEnum.ACTIVE}`]:
      activePrivateConsumerPassesState,
  };

  const passesListMap = useMemo(
    () => ({
      [`${PassTabEnum.CONSUMER_PAYMENT_PACK}-${PassFilterTabEnum.EXPIRED}`]:
        expiredConsumerPaymentPacksList,
      [`${PassTabEnum.CONSUMER_PAYMENT_PACK}-${PassFilterTabEnum.FUTURE}`]:
        futureConsumerPaymentPacksList,
      [`${PassTabEnum.CONSUMER_PAYMENT_PACK}-${PassFilterTabEnum.ACTIVE}`]:
        activeConsumerPaymentPacksList,
      [`${PassTabEnum.PRIVATE_CONSUMER_PASS}-${PassFilterTabEnum.EXPIRED}`]:
        expiredPrivateConsumerPassesList,
      [`${PassTabEnum.PRIVATE_CONSUMER_PASS}-${PassFilterTabEnum.FUTURE}`]:
        futurePrivateConsumerPassesList,
      [`${PassTabEnum.PRIVATE_CONSUMER_PASS}-${PassFilterTabEnum.ACTIVE}`]:
        activePrivateConsumerPassesList,
    }),
    [
      futurePrivateConsumerPassesList,
      futureConsumerPaymentPacksList,
      expiredPrivateConsumerPassesList,
      expiredConsumerPaymentPacksList,
      activePrivateConsumerPassesList,
      activeConsumerPaymentPacksList,
    ],
  );

  const expiredPassesCountMap = {
    [PassTabEnum.CONSUMER_PAYMENT_PACK]: expiredConsumerPaymentPacksState.count,
    [PassTabEnum.PRIVATE_CONSUMER_PASS]:
      expiredPrivateConsumerPassesState.count,
  };

  const futurePassesCountMap = {
    [PassTabEnum.CONSUMER_PAYMENT_PACK]: futureConsumerPaymentPacksState.count,
    [PassTabEnum.PRIVATE_CONSUMER_PASS]: futurePrivateConsumerPassesState.count,
  };

  const activePassesCountMap = {
    [PassTabEnum.CONSUMER_PAYMENT_PACK]: activeConsumerPaymentPacksState.count,
    [PassTabEnum.PRIVATE_CONSUMER_PASS]: activePrivateConsumerPassesState.count,
  };

  const currentState = currentStateMap[`${selectedTab}-${selectedFilterTab}`];
  const expiredItemsCount = expiredPassesCountMap[selectedTab] || 0;
  const futureItemsCount = futurePassesCountMap[selectedTab] || 0;
  const activeItemsCount = activePassesCountMap[selectedTab] || 0;
  const nextPage = currentState.next_page;
  const passList = useMemo(
    () => passesListMap[`${selectedTab}-${selectedFilterTab}`] || [],
    [passesListMap, selectedFilterTab, selectedTab],
  );

  /**
   * Function used to fetch data from pagination
   * @param type The selected pass tab
   */
  const handlePaginationFetchMore = useCallback(
    (type?: PassTab) =>
      fetchMoreDataHandlerMap[
        `${type ?? selectedTab}-${selectedFilterTab}`
      ]?.(),
    [fetchMoreDataHandlerMap, selectedFilterTab, selectedTab],
  );

  /**
   * Function triggered when changing tab
   *  We fetch Active/Future/Expired so we can retrieve/display count
   */
  const handleFetchTabData = useCallback(
    (type?: PassTab) => fetchTabDataHandlerMap[`${type ?? selectedTab}`]?.(),
    [fetchTabDataHandlerMap, selectedTab],
  );

  /**
   * Fetch associated objects when changing tab ConsumerPaymentPacks/PrivateConsumerPasses/UniversalPasses
   * @param type The new tab that will be selected
   */
  const handleSetSelectedTab = useCallback(
    (type: PassTab) => {
      setSelectedTab(type);
      handleFetchTabData?.(type);
      setSelectedPass(null);
    },
    [handleFetchTabData],
  );

  /**
   * Update local state when clicking on a filter tab Active/Future/Expired
   * @param type The selected pass filter tab
   */
  const handleSetSelectedFilterTab = useCallback(
    (type: PassFilterTab) => setSelectedFilterTab(type),
    [],
  );

  /**
   * Update local state when clicking on a pass details\
   * Finds the associated pass from an ID and set it as the selectedPass
   * @param passId The ID of the selected pass
   */
  const handleSetSelectedPass = useCallback(
    (passId: number) => {
      // @ts-ignore
      const pass = passList.find((item) => item.id === passId) || null;
      setSelectedPass(pass);
    },
    [passList],
  );
  return {
    // LOCAL STATE
    selectedTab,
    selectedFilterTab,
    selectedPass,
    // STATE HANDLERS
    handleSetSelectedTab,
    handleSetSelectedFilterTab,
    handleSetSelectedPass,
    // DATA/USER ACTIONS HANDLERS
    handlePaginationFetchMore,
    // COMPUTED STATE
    expiredItemsCount,
    futureItemsCount,
    activeItemsCount,
    nextPage,
    passList,
  };
}
