import { useCallback, useMemo, useState } from 'react';
import { SubscriptionTabEnum } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/constants';
import useViewport from '#Fabrique/hooks/useViewport';
import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from '#src/libs/consumer-space/constants';

import type { SubscriptionTab } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/types';
import type {
  SubscriptionREST,
  SubscriptionsInvoicesDetailsREST,
} from '#src/libs/subscription/types';
import type {
  ConsumerSubscriptionInvoiceDetails,
  ConsumerSubscriptionReworked,
} from '#src/libs/consumer-space/types';
import type { OptionCallback } from '../../../../../../state/types';

type Data = {
  activeSubscriptionsState: ConsumerSubscriptionReworked;
  activeSubscriptionsList: SubscriptionREST[];
  futureSubscriptionsState: ConsumerSubscriptionReworked;
  expiredSubscriptionsList: SubscriptionREST[];
  expiredSubscriptionsState: ConsumerSubscriptionReworked;
  futureSubscriptionsList: SubscriptionREST[];
  fetchActiveSubscriptionsList: (
    page_size?: number,
    options?: OptionCallback<SubscriptionREST[]>,
  ) => void;
  fetchExpiredSubscriptionsList: (
    page_size?: number,
    options?: OptionCallback<SubscriptionREST[]>,
  ) => void;
  fetchFutureSubscriptionsList: (
    page_size?: number,
    options?: OptionCallback<SubscriptionREST[]>,
  ) => void;
  fetchConsumerSubscriptionInvoicesDetails: (
    params: { id: number; page_size?: number },
    options?: OptionCallback<SubscriptionsInvoicesDetailsREST[]>,
  ) => void;
  subscriptionsInvoicesDetailsState: ConsumerSubscriptionInvoiceDetails;
};

const useConsumerSubscriptionsDataManager = ({
  activeSubscriptionsState,
  activeSubscriptionsList,
  futureSubscriptionsState,
  futureSubscriptionsList,
  expiredSubscriptionsState,
  expiredSubscriptionsList,
  fetchActiveSubscriptionsList,
  fetchFutureSubscriptionsList,
  fetchExpiredSubscriptionsList,
  fetchConsumerSubscriptionInvoicesDetails,
  subscriptionsInvoicesDetailsState,
}: Data) => {
  const [selectedTab, setSelectedTab] = useState<SubscriptionTab>(
    SubscriptionTabEnum.ACTIVE,
  );

  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionREST | null>(null);

  const selectedSubscriptionInvoiceDetails =
    !subscriptionsInvoicesDetailsState.loading &&
    selectedSubscription?.id &&
    subscriptionsInvoicesDetailsState.bySubscriptionId[
      `${selectedSubscription?.id}`
    ]?.invoices;

  const { width } = useViewport();

  const isMobile = width < CONSUMER_SPACE_MOBILE_BREAKPOINT;

  const fetchDataHandlerMap = useMemo(
    () => ({
      [SubscriptionTabEnum.ACTIVE]: fetchActiveSubscriptionsList,
      [SubscriptionTabEnum.FUTURE]: fetchFutureSubscriptionsList,
      [SubscriptionTabEnum.EXPIRED]: fetchExpiredSubscriptionsList,
    }),
    [
      fetchActiveSubscriptionsList,
      fetchFutureSubscriptionsList,
      fetchExpiredSubscriptionsList,
    ],
  );

  const currentSubscriptionsStateMap = {
    [SubscriptionTabEnum.ACTIVE]: activeSubscriptionsState,
    [SubscriptionTabEnum.FUTURE]: futureSubscriptionsState,
    [SubscriptionTabEnum.EXPIRED]: expiredSubscriptionsState,
  };

  const subscriptionsListMap = useMemo(
    () => ({
      [SubscriptionTabEnum.ACTIVE]: activeSubscriptionsList,
      [SubscriptionTabEnum.FUTURE]: futureSubscriptionsList,
      [SubscriptionTabEnum.EXPIRED]: expiredSubscriptionsList,
    }),
    [
      activeSubscriptionsList,
      futureSubscriptionsList,
      expiredSubscriptionsList,
    ],
  );

  const subscriptionsList = useMemo(
    () => subscriptionsListMap[`${selectedTab}`],
    [selectedTab, subscriptionsListMap],
  );

  const isLoading =
    activeSubscriptionsState.loading ||
    futureSubscriptionsState.loading ||
    expiredSubscriptionsState.loading;

  const areDetailsLoading = subscriptionsInvoicesDetailsState.loading;

  const nextPage = currentSubscriptionsStateMap[`${selectedTab}`].next_page;

  const detailsNextPage =
    subscriptionsInvoicesDetailsState.bySubscriptionId?.[
      selectedSubscription?.id
    ]?.next_page || null;

  // MODALS STATE
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubscriptionDetailsDrawerOpen, setIsSubscriptionDetailsDrawerOpen] =
    useState(false);

  // MODALS HANDLERS
  const handleTermsModalClose = useCallback(
    () => setIsTermsModalOpen(false),
    [],
  );

  const handleTermsModalOpen = useCallback(() => setIsTermsModalOpen(true), []);

  const handlePaymentModalOpen = useCallback(
    () => setIsPaymentModalOpen(true),
    [],
  );

  const handlePaymentModalClose = useCallback(
    () => setIsPaymentModalOpen(false),
    [],
  );

  const handleOpenSubscriptionDetailsDrawer = useCallback(
    () => setIsSubscriptionDetailsDrawerOpen(true),
    [],
  );

  const handleCloseSubscriptionDetailsDrawer = useCallback(
    () => setIsSubscriptionDetailsDrawerOpen(false),
    [],
  );

  const handlePaginationFetchMore = useCallback(
    () => fetchDataHandlerMap[`${selectedTab}`](),
    [fetchDataHandlerMap, selectedTab],
  );

  const handleInvoiceDetailsPaginationFetchMore = useCallback(
    () =>
      selectedSubscription?.id &&
      fetchConsumerSubscriptionInvoicesDetails({
        id: selectedSubscription.id,
      }),
    [fetchConsumerSubscriptionInvoicesDetails, selectedSubscription],
  );

  const handleSetSelectedTab = useCallback((tab: SubscriptionTab) => {
    setSelectedTab(tab);
    setSelectedSubscription(null);
  }, []);

  const handleSetSelectedSubscriptions = useCallback(
    (subscriptionId: number | null) => {
      const subscription =
        subscriptionsList.find((item) => item.id === subscriptionId) || null;
      setSelectedSubscription(subscription);
      !subscriptionsInvoicesDetailsState.bySubscriptionId[subscription?.id] &&
        subscription?.id &&
        fetchConsumerSubscriptionInvoicesDetails({ id: subscription.id });

      !!isMobile && handleOpenSubscriptionDetailsDrawer();
    },
    [
      subscriptionsList,
      subscriptionsInvoicesDetailsState.bySubscriptionId,
      fetchConsumerSubscriptionInvoicesDetails,
      isMobile,
      handleOpenSubscriptionDetailsDrawer,
    ],
  );

  return {
    areDetailsLoading,
    detailsNextPage,
    handleInvoiceDetailsPaginationFetchMore,
    handlePaginationFetchMore,
    handleSetSelectedSubscriptions,
    handleSetSelectedTab,
    isLoading,
    isMobile,
    nextPage,
    selectedSubscription,
    selectedSubscriptionInvoiceDetails,
    selectedTab,
    subscriptionsList,
    // MODAL STATE
    isTermsModalOpen,
    isPaymentModalOpen,
    isSubscriptionDetailsDrawerOpen,
    // MODAL HANDLERS
    handleTermsModalClose,
    handleTermsModalOpen,
    handlePaymentModalOpen,
    handlePaymentModalClose,
    handleOpenSubscriptionDetailsDrawer,
    handleCloseSubscriptionDetailsDrawer,
  };
};

export default useConsumerSubscriptionsDataManager;
