import { useCallback, useMemo, useState } from 'react';
import { SubscriptionFilterEnum } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/constants';
import useViewport from '#Fabrique/hooks/useViewport';
import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from '#src/libs/consumer-space/constants';

import type { SubscriptionFilter } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/types';
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
  const [selectedFilter, setSelectedFilter] = useState<SubscriptionFilter>(
    SubscriptionFilterEnum.ACTIVE,
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
      [SubscriptionFilterEnum.ACTIVE]: fetchActiveSubscriptionsList,
      [SubscriptionFilterEnum.FUTURE]: fetchFutureSubscriptionsList,
      [SubscriptionFilterEnum.EXPIRED]: fetchExpiredSubscriptionsList,
    }),
    [
      fetchActiveSubscriptionsList,
      fetchFutureSubscriptionsList,
      fetchExpiredSubscriptionsList,
    ],
  );

  const currentSubscriptionsStateMap = {
    [SubscriptionFilterEnum.ACTIVE]: activeSubscriptionsState,
    [SubscriptionFilterEnum.FUTURE]: futureSubscriptionsState,
    [SubscriptionFilterEnum.EXPIRED]: expiredSubscriptionsState,
  };

  const subscriptionsListMap = useMemo(
    () => ({
      [SubscriptionFilterEnum.ACTIVE]: activeSubscriptionsList,
      [SubscriptionFilterEnum.FUTURE]: futureSubscriptionsList,
      [SubscriptionFilterEnum.EXPIRED]: expiredSubscriptionsList,
    }),
    [
      activeSubscriptionsList,
      futureSubscriptionsList,
      expiredSubscriptionsList,
    ],
  );

  const subscriptionsList = useMemo(
    () => subscriptionsListMap[`${selectedFilter}`],
    [selectedFilter, subscriptionsListMap],
  );

  const isLoading =
    activeSubscriptionsState.loading ||
    futureSubscriptionsState.loading ||
    expiredSubscriptionsState.loading;

  const areDetailsLoading = subscriptionsInvoicesDetailsState.loading;

  const currentState = currentSubscriptionsStateMap[`${selectedFilter}`];
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
      fetchDataHandlerMap[`${selectedFilter}`](page);
    },
    [fetchDataHandlerMap, selectedFilter],
  );

  const handleInvoiceDetailsPaginationFetchMore = useCallback(
    () =>
      selectedSubscription?.id &&
      fetchConsumerSubscriptionInvoicesDetails({
        id: selectedSubscription.id,
      }),
    [fetchConsumerSubscriptionInvoicesDetails, selectedSubscription],
  );

  const handleSetSelectedFilter = useCallback(
    (filter: SubscriptionFilter) => {
      setSelectedFilter(filter);
      setSelectedSubscription(null);
      fetchDataHandlerMap[`${selectedFilter}`](1); // Fetch page 1 when changing filter
    },
    [fetchDataHandlerMap, selectedFilter],
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
    handleSetSelectedFilter,
    isLoading,
    isMobile,
    nextPage,
    selectedSubscription,
    selectedSubscriptionInvoiceDetails,
    selectedFilter,
    subscriptionsList,
    setSelectedSubscription,
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
