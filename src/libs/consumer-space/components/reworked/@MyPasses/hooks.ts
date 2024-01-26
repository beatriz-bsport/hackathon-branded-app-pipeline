import { useCallback, useMemo, useState } from 'react';

import { PassTabEnum } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassTabs/constants';
import { PassFilterTabEnum } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassFilters/constants';

import type { PrivateConsumerPassReworked } from '#libs/private-service/types';
import type { PassTab } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassTabs/types';
import type { UniversalPassReworked } from '#libs/universal-pass/types';
import type { ConsumerPaymentPackReworked } from '#libs/consumer-payment-pack/types';
import type { PassFilterTab } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassFilters/types';
import type { ConsumerPassPageReworkedProps } from './ConsumerPassPageReworked';

/** Provides all of the necessary data and fetch handlers for consumer passes page */
export function useConsumerPassesDataManager({
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
}: Omit<
  ConsumerPassPageReworkedProps,
  | 'isLoading'
  | 'handleBuyPassClick'
  | 'handleBookASessionClick'
  | 'isMetadataLoading'
>) {
  /* PAGE STATES */
  const [selectedTab, setSelectedTab] = useState<PassTab>(
    PassTabEnum.CONSUMER_PAYMENT_PACK,
  );
  const [selectedFilterTab, setSelectedFilterTab] = useState<PassFilterTab>(
    PassFilterTabEnum.ACTIVE,
  );
  const [selectedPass, setSelectedPass] = useState<
    | ConsumerPaymentPackReworked
    | PrivateConsumerPassReworked
    | UniversalPassReworked
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
      [`${PassTabEnum.UNIVERSAL_PASS}-${PassFilterTabEnum.EXPIRED}`]:
        fetchExpiredUniversalPasses,
      [`${PassTabEnum.UNIVERSAL_PASS}-${PassFilterTabEnum.FUTURE}`]:
        fetchFutureUniversalPasses,
      [`${PassTabEnum.UNIVERSAL_PASS}-${PassFilterTabEnum.ACTIVE}`]:
        fetchActiveUniversalPasses,
    }),
    [
      fetchActiveConsumerPaymentPacks,
      fetchActivePrivateConsumerPasses,
      fetchActiveUniversalPasses,
      fetchExpiredConsumerPaymentPacks,
      fetchExpiredPrivateConsumerPasses,
      fetchExpiredUniversalPasses,
      fetchFutureConsumerPaymentPacks,
      fetchFuturePrivateConsumerPasses,
      fetchFutureUniversalPasses,
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
      [PassTabEnum.UNIVERSAL_PASS]: () => {
        fetchActiveUniversalPasses();
        fetchExpiredUniversalPasses();
        fetchFutureUniversalPasses();
      },
    }),
    [
      fetchActiveConsumerPaymentPacks,
      fetchActivePrivateConsumerPasses,
      fetchActiveUniversalPasses,
      fetchExpiredConsumerPaymentPacks,
      fetchExpiredPrivateConsumerPasses,
      fetchExpiredUniversalPasses,
      fetchFutureConsumerPaymentPacks,
      fetchFuturePrivateConsumerPasses,
      fetchFutureUniversalPasses,
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
    [`${PassTabEnum.UNIVERSAL_PASS}-${PassFilterTabEnum.EXPIRED}`]:
      expiredUniversalPassesState,
    [`${PassTabEnum.UNIVERSAL_PASS}-${PassFilterTabEnum.FUTURE}`]:
      futureUniversalPassesState,
    [`${PassTabEnum.UNIVERSAL_PASS}-${PassFilterTabEnum.ACTIVE}`]:
      activeUniversalPassesState,
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
      [`${PassTabEnum.UNIVERSAL_PASS}-${PassFilterTabEnum.EXPIRED}`]:
        expiredUniversalPassesList,
      [`${PassTabEnum.UNIVERSAL_PASS}-${PassFilterTabEnum.FUTURE}`]:
        futureUniversalPassesList,
      [`${PassTabEnum.UNIVERSAL_PASS}-${PassFilterTabEnum.ACTIVE}`]:
        activeUniversalPassesList,
    }),
    [
      futurePrivateConsumerPassesList,
      futureConsumerPaymentPacksList,
      futureUniversalPassesList,
      expiredPrivateConsumerPassesList,
      expiredConsumerPaymentPacksList,
      expiredUniversalPassesList,
      activePrivateConsumerPassesList,
      activeConsumerPaymentPacksList,
      activeUniversalPassesList,
    ],
  );

  const futurePassesCountMap = {
    [PassTabEnum.CONSUMER_PAYMENT_PACK]: futureConsumerPaymentPacksState.count,
    [PassTabEnum.PRIVATE_CONSUMER_PASS]: futurePrivateConsumerPassesState.count,
    [PassTabEnum.UNIVERSAL_PASS]: futureUniversalPassesState.count,
  };

  const activePassesCountMap = {
    [PassTabEnum.CONSUMER_PAYMENT_PACK]: activeConsumerPaymentPacksState.count,
    [PassTabEnum.PRIVATE_CONSUMER_PASS]: activePrivateConsumerPassesState.count,
    [PassTabEnum.UNIVERSAL_PASS]: activeUniversalPassesState.count,
  };

  const currentState = currentStateMap[`${selectedTab}-${selectedFilterTab}`];
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
    futureItemsCount,
    activeItemsCount,
    nextPage,
    passList,
  };
}
