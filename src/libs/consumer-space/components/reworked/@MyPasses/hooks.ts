import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  PassTabEnum,
  PassFilterTabEnum,
} from '#src/libs/consumer-space/components/reworked/@MyPasses/constants';
import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from '#src/libs/consumer-space/constants';
import useViewport from '#Fabrique/hooks/useViewport';

import type { PrivateConsumerPassReworked } from '#src/libs/private-service/types';
import type {
  PassTab,
  PassFilterTab,
} from '#src/libs/consumer-space/components/reworked/@MyPasses/types';
import type { UniversalPassReworked } from '#src/libs/universal-pass/types';
import type { ConsumerPaymentPackReworked } from '#src/libs/consumer-payment-pack/types';
import type { ConsumerPassesTabDisplay } from '#src/libs/consumer-space/types';
import type { ConsumerPassPageReworkedProps } from './ConsumerPassPageReworked';

const consumerPassesTabDisplayMap = {
  consumer_payment_pack: PassTabEnum.CONSUMER_PAYMENT_PACK,
  private_consumer_pass: PassTabEnum.PRIVATE_CONSUMER_PASS,
  universal_pass: PassTabEnum.UNIVERSAL_PASS,
};

/** Provides all of the necessary data and fetch handlers for consumer passes page */
export function useConsumerPassesDataManager({
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
}: Omit<
  ConsumerPassPageReworkedProps,
  | 'isLoading'
  | 'handleBuyPassClick'
  | 'handleBookASessionClick'
  | 'isMetadataLoading'
  | 'isConsumerPassesTabDisplayLoading'
>) {
  const { width } = useViewport();

  const isMobile = width < CONSUMER_SPACE_MOBILE_BREAKPOINT;

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

  const defaultTabKey = Object.keys(consumerPassesTabDisplay)?.find(
    (key: keyof ConsumerPassesTabDisplay) =>
      consumerPassesTabDisplay[key] === true,
  );

  useEffect(() => {
    const defaultTab =
      consumerPassesTabDisplayMap?.[
        defaultTabKey as keyof ConsumerPassesTabDisplay
      ];
    !!defaultTab && setSelectedTab(defaultTab);
  }, [defaultTabKey]);

  /* MODAL/DRAWER STATES */
  const [
    isConsumerPaymentPackDetailsDrawerOpen,
    setIsConsumerPaymentPackDetailsDrawerOpen,
  ] = useState(false);
  const [
    isPrivateConsumerPassDetailsDrawerOpen,
    setIsPrivateConsumerPassDetailsDrawerOpen,
  ] = useState(false);
  const [
    isUniversalPassDetailsDrawerOpen,
    setIsUniversalPassDetailsDrawerOpen,
  ] = useState(false);
  const [isPassTabDrawerOpen, setIsPassTabDrawerOpen] = useState(false);

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
      resetConsumerState();
      handleFetchTabData?.(type);
      setSelectedTab(type);
      setSelectedPass(null);
    },
    [handleFetchTabData, resetConsumerState],
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
   * Toggle display the pass details drawer
   */
  const handleTogglePassDetailsDrawer = useCallback(() => {
    switch (selectedTab) {
      case PassTabEnum.CONSUMER_PAYMENT_PACK: {
        setIsConsumerPaymentPackDetailsDrawerOpen((state) => !state);
        break;
      }
      case PassTabEnum.PRIVATE_CONSUMER_PASS: {
        setIsPrivateConsumerPassDetailsDrawerOpen((state) => !state);
        break;
      }
      case PassTabEnum.UNIVERSAL_PASS: {
        setIsUniversalPassDetailsDrawerOpen((state) => !state);
        break;
      }
      default:
    }
  }, [
    setIsConsumerPaymentPackDetailsDrawerOpen,
    setIsPrivateConsumerPassDetailsDrawerOpen,
    setIsUniversalPassDetailsDrawerOpen,
    selectedTab,
  ]);

  /**
   * Toggle display the pass tab bottom drawer
   */
  const handleTogglePassTabDrawer = useCallback(() => {
    setIsPassTabDrawerOpen((state) => !state);
  }, []);
  /**
   * Update local state when clicking on a pass details\
   * Finds the associated pass from an ID and set it as the selectedPass
   * @param passId The ID of the selected pass
   */
  const handleSetSelectedPass = useCallback(
    (passId: number) => {
      const pass = passList.find((item) => item.id === passId) || null;
      setSelectedPass(pass);
      isMobile && handleTogglePassDetailsDrawer();
    },
    [passList, handleTogglePassDetailsDrawer, isMobile],
  );
  return {
    // LOCAL STATE
    selectedTab,
    selectedFilterTab,
    selectedPass,
    isConsumerPaymentPackDetailsDrawerOpen,
    isPrivateConsumerPassDetailsDrawerOpen,
    isUniversalPassDetailsDrawerOpen,
    isPassTabDrawerOpen,
    // STATE HANDLERS
    handleSetSelectedTab,
    handleSetSelectedFilterTab,
    handleSetSelectedPass,
    handleTogglePassDetailsDrawer,
    handleTogglePassTabDrawer,
    // DATA/USER ACTIONS HANDLERS
    handlePaginationFetchMore,
    // COMPUTED STATE
    futureItemsCount,
    activeItemsCount,
    nextPage,
    passList,
    isMobile,
  };
}
