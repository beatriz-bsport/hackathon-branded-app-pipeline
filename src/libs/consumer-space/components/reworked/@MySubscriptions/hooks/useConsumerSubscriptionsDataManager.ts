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
import type { OptionCallback, PaginatedResponse } from '#src/state/types';

type Data = {
  activeSubscriptionsState: ConsumerSubscriptionReworked;
  activeSubscriptionsList: SubscriptionREST[];
  futureSubscriptionsState: ConsumerSubscriptionReworked;
  expiredSubscriptionsList: SubscriptionREST[];
  expiredSubscriptionsState: ConsumerSubscriptionReworked;
  futureSubscriptionsList: SubscriptionREST[];
  fetchActiveSubscriptionsList: (
    page?: number,
    page_size?: number,
    options?: OptionCallback<PaginatedResponse<SubscriptionREST>>,
  ) => void;
  fetchExpiredSubscriptionsList: (
    page?: number,
    page_size?: number,
    options?: OptionCallback<PaginatedResponse<SubscriptionREST>>,
  ) => void;
  fetchFutureSubscriptionsList: (
    page?: number,
    page_size?: number,
    options?: OptionCallback<PaginatedResponse<SubscriptionREST>>,
  ) => void;
  fetchConsumerSubscriptionInvoicesDetails: (
    params: { id: number; page_size?: number },
    options?: OptionCallback<{
      billing_plan_id: number;
      data: PaginatedResponse<SubscriptionsInvoicesDetailsREST>;
    }>,
  ) => void;
  subscriptionsInvoicesDetailsState: ConsumerSubscriptionInvoiceDetails;
  resetVirtualizedListCache: () => void;
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
  resetVirtualizedListCache,
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

  const currentState = currentSubscriptionsStateMap[`${selectedTab}`];
  const nextPage = currentState.next_page;
  const currentCount = currentState.count;
  const currentPage = currentState.page;

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

  const handleChangePage = useCallback(
    (page?: number) => {
      resetVirtualizedListCache();
      fetchDataHandlerMap[`${selectedTab}`](page);
    },
    [fetchDataHandlerMap, resetVirtualizedListCache, selectedTab],
  );

  const handleInvoiceDetailsPaginationFetchMore = useCallback(
    () =>
      selectedSubscription?.id &&
      fetchConsumerSubscriptionInvoicesDetails({
        id: selectedSubscription.id,
      }),
    [fetchConsumerSubscriptionInvoicesDetails, selectedSubscription],
  );

  const handleSetSelectedTab = useCallback(
    (tab: SubscriptionTab) => {
      setSelectedTab(tab);
      setSelectedSubscription(null);
      resetVirtualizedListCache();
    },
    [resetVirtualizedListCache],
  );

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
    handleChangePage,
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
    // COMPUTED STATE
    currentCount,
    currentPage,
  };
};

export default useConsumerSubscriptionsDataManager;
