import React from 'react';

import { PortalContainer } from '#Fabrique/PortalContainer';
import ConsumerSubscriptionDetailsDrawer from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionDetailsDrawer';

import type { PaymentMethod } from '#src/libs/payment/types';
import type {
  SubscriptionREST,
  SubscriptionsInvoicesDetailsREST,
} from '#src/libs/subscription/types';
import type { SubscriptionTab } from '../types';

type Props = {
  /* DETAILS DRAWER */
  isSubscriptionDetailsDrawerOpen: boolean;
  hasDetailsNextPage: boolean;
  invoiceRetryNumber: number;
  isLoading?: boolean;
  areDetailsLoading?: boolean;
  isMobile?: boolean;
  paymentMethodUsed: PaymentMethod;
  selectedSubscription: SubscriptionREST;
  selectedSubscriptionInvoiceDetails: Omit<
    SubscriptionsInvoicesDetailsREST,
    'billing_plan_id'
  >[];
  selectedTab: SubscriptionTab;
  handleCloseSubscriptionDetailsDrawer: () => void;
  onSeeTermsClick: () => void;
  handleInvoiceDetailsPaginationFetchMore: () => void;
  handlePaymentModalOpen: () => void;
};

const ConsumerSubscriptionModals: React.FC<Props> = ({
  /* DETAILS DRAWER */
  isSubscriptionDetailsDrawerOpen,
  hasDetailsNextPage,
  invoiceRetryNumber,
  isLoading,
  areDetailsLoading,
  isMobile,
  paymentMethodUsed,
  selectedSubscription,
  selectedSubscriptionInvoiceDetails,
  selectedTab,
  handleCloseSubscriptionDetailsDrawer,
  onSeeTermsClick,
  handleInvoiceDetailsPaginationFetchMore,
  handlePaymentModalOpen,
}) => {
  return (
    <PortalContainer wrapperId="bs-consumer__subscription-page__portal-container">
      <ConsumerSubscriptionDetailsDrawer
        areDetailsLoading={areDetailsLoading}
        handleClose={handleCloseSubscriptionDetailsDrawer}
        handleInvoiceDetailsPaginationFetchMore={
          handleInvoiceDetailsPaginationFetchMore
        }
        handlePaymentModalOpen={handlePaymentModalOpen}
        hasDetailsNextPage={hasDetailsNextPage}
        invoiceRetryNumber={invoiceRetryNumber}
        isLoading={isLoading}
        isMobile={isMobile}
        isOpen={isMobile && isSubscriptionDetailsDrawerOpen}
        onSeeTermsClick={onSeeTermsClick}
        paymentMethodUsed={paymentMethodUsed}
        selectedSubscription={selectedSubscription}
        selectedSubscriptionInvoiceDetails={selectedSubscriptionInvoiceDetails}
        selectedTab={selectedTab}
      />
    </PortalContainer>
  );
};

export default React.memo(ConsumerSubscriptionModals);
