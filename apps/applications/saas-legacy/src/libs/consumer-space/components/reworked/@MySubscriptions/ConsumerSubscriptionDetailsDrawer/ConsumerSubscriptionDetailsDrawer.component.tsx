import React, { useMemo } from 'react';
import { DateTime, Interval } from 'luxon';
import { useTranslation } from 'react-i18next';

import BottomDrawer from '#Fabrique/BottomDrawer';
import ConsumerSubscriptionDetailsCard from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionDetailsCard';

import { formatAsDate } from '#src/utils/datetime';
import {
  getCommitmentPeriodDisplay,
  isPaused,
} from '#src/libs/subscription/utils';
import {
  getSubtitleCardDetailsDate,
  informationBasedOnCouponApplied,
} from '#src/libs/consumer-space/components/reworked/@MySubscriptions/utils';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';

import type {
  CommitmentPeriodDisplayReturnedValues,
  SubscriptionREST,
  SubscriptionsInvoicesDetailsREST,
} from '#src/libs/subscription/types';
import type { PaymentMethod } from '#src/libs/payment/types';
import type { SubscriptionFilter } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/types';
import {
  SubscriptionFilterEnum,
  SubscriptionStatusEnum,
} from '#src/libs/consumer-space/components/reworked/@MySubscriptions/constants';

type Props = {
  displayStopSubscriptionFromMemberSide?: boolean;
  hasDetailsNextPage: boolean;
  invoiceRetryNumber: number;
  isLoading: boolean;
  isMobile: boolean;
  isOpen?: boolean;
  areDetailsLoading?: boolean;
  showPlaceholder?: boolean;
  paymentMethodUsed: PaymentMethod;
  selectedSubscription: SubscriptionREST;
  selectedSubscriptionInvoiceDetails: Omit<
    SubscriptionsInvoicesDetailsREST,
    'billing_plan_id'
  >[];
  selectedFilter: SubscriptionFilter;
  handleClose: () => void;
  onSeeTermsClick: () => void;
  handleInvoiceDetailsPaginationFetchMore: () => void;
  handlePaymentModalOpen: () => void;
  onUnSubscribeClick: () => void;
};

const ConsumerSubscriptionDetailsDrawer: React.FC<Props> = ({
  displayStopSubscriptionFromMemberSide,
  isOpen,
  hasDetailsNextPage,
  invoiceRetryNumber,
  isLoading,
  isMobile,
  paymentMethodUsed,
  selectedSubscription,
  selectedSubscriptionInvoiceDetails,
  selectedFilter,
  showPlaceholder,
  areDetailsLoading,
  handleClose,
  onSeeTermsClick,
  handleInvoiceDetailsPaginationFetchMore,
  handlePaymentModalOpen,
  onUnSubscribeClick,
}) => {
  const { t } = useTranslation(['consumerSpace', 'common']);

  const isStopSubscriptionFromMemberSideFeatureEnabled = useSafeFlag(
    FeatureFlags.STOP_SUBSCRIPTION_FROM_MEMBER_SIDE,
  );

  const selectedSubscriptionPauseEndDate = useMemo(
    () =>
      formatAsDate(
        selectedSubscription?.pauses?.find((pause) =>
          Interval.fromDateTimes(
            DateTime.fromISO(pause.from_date),
            DateTime.fromISO(pause.date_ended),
          ).contains(DateTime.now()),
        )?.date_ended,
      ),
    [selectedSubscription?.pauses],
  );

  const selectedSubscriptionsFuturePauses = useMemo(
    () =>
      selectedSubscription?.pauses?.filter(
        (pause) => DateTime.now() < DateTime.fromISO(pause.from_date),
      ),
    [selectedSubscription?.pauses],
  );

  const commitmentPeriodDisplay: CommitmentPeriodDisplayReturnedValues =
    useMemo(
      () =>
        getCommitmentPeriodDisplay(
          selectedSubscription,
          !!displayStopSubscriptionFromMemberSide &&
            isStopSubscriptionFromMemberSideFeatureEnabled,
        ),
      [
        selectedSubscription,
        displayStopSubscriptionFromMemberSide,
        isStopSubscriptionFromMemberSideFeatureEnabled,
      ],
    );

  return (
    <BottomDrawer
      blanketProps={{ isOpen, onClick: handleClose }}
      className="bs-consumer__subscription-page__details-drawer__root"
      modalDialogProps={{
        title: t(
          'consumerSpace:reworked.mySubscriptions.consumerSubscriptionCardDetails.drawerTitle',
        ),
        onClose: handleClose,
        onCancel: handleClose,
        cancelLabel: t('common:back'),
      }}
    >
      <ConsumerSubscriptionDetailsCard
        areDetailsLoading={areDetailsLoading}
        autoRenewalDate={formatAsDate(selectedSubscription?.last_billing_date)}
        commitmentPeriod={selectedSubscription?.commitment_period_unit}
        commitmentValue={selectedSubscription?.commitment_period_value}
        description={selectedSubscription?.description}
        displayStopSubscriptionFromMemberSide={
          displayStopSubscriptionFromMemberSide
        }
        expirationDate={selectedSubscription?.expiration_date}
        failedInvoices={selectedSubscription?.failed_payments_invoices}
        handleInvoiceDetailsPaginationFetchMore={
          handleInvoiceDetailsPaginationFetchMore
        }
        hasAutoRenewal={
          selectedFilter !== SubscriptionFilterEnum.EXPIRED &&
          selectedSubscription?.auto_renewal
        }
        hasDetailsNextPage={hasDetailsNextPage}
        hasMissingPaymentMethod={
          !selectedSubscription?.stripe_payment_method_id
        }
        invoiceRetryNumber={invoiceRetryNumber}
        isCommitmentPeriodSectionHidden={
          selectedFilter == SubscriptionFilterEnum.EXPIRED ||
          commitmentPeriodDisplay.isCommitmentPeriodSectionHidden
        }
        isLoading={isLoading}
        isMemberCancellationAllowed={
          commitmentPeriodDisplay.isMemberCancellationAllowed
        }
        isMobile={isMobile}
        isPaused={isPaused(selectedSubscription?.pauses)}
        isPaymentMethodSectionHidden={
          selectedFilter === SubscriptionFilterEnum.EXPIRED
        }
        isSubscriptionStopped={
          selectedSubscription?.status === SubscriptionStatusEnum.STOPPED
        }
        joiningFee={selectedSubscription?.flat_fee}
        lastInvoiceDateBeforeRenewal={informationBasedOnCouponApplied(
          selectedSubscription,
          formatAsDate(selectedSubscription?.last_billing_date),
        )}
        onPaymentMethodActionClick={handlePaymentModalOpen}
        onSeeClick={onSeeTermsClick}
        onUnSubscribeClick={onUnSubscribeClick}
        pauseEndDate={selectedSubscriptionPauseEndDate}
        paymentMethodType={paymentMethodUsed?.type}
        price={(selectedSubscription?.price_to_display_cts / 100).toFixed(2)}
        readableIdentifier={paymentMethodUsed?.readable_identifier}
        recurrenceBasis={selectedSubscription?.recurrence_basis}
        recurrentPrice={informationBasedOnCouponApplied(
          selectedSubscription,
          selectedSubscription?.recurrent_price,
        )}
        selectedSubscriptionInvoiceDetails={selectedSubscriptionInvoiceDetails}
        selectedSubscriptionsFuturePauses={selectedSubscriptionsFuturePauses}
        shouldDisplayCommitmentPeriodAlert={
          commitmentPeriodDisplay.shouldDisplayCommitmentPeriodAlert
        }
        shouldDisplayCommitmentPeriodSubtitle={
          commitmentPeriodDisplay.shouldDisplayCommitmentPeriodSubtitle
        }
        shouldDisplayUnsubscribeCaptionText={
          selectedFilter !== SubscriptionFilterEnum.EXPIRED &&
          !!displayStopSubscriptionFromMemberSide
        }
        showPlaceholder={showPlaceholder}
        subscriptionInterval={selectedSubscription?.interval}
        subscriptionName={selectedSubscription?.name_without_member_name}
        subscriptionNextPaymentDate={
          selectedFilter !== SubscriptionFilterEnum.EXPIRED &&
          selectedSubscription?.next_billing_date &&
          formatAsDate(selectedSubscription?.next_billing_date)
        }
        subtitleDate={getSubtitleCardDetailsDate(
          selectedFilter,
          selectedSubscription,
          t,
        )}
        termsDate={formatAsDate(
          selectedSubscription?.contract_terms_date_accepted,
        )}
      />
    </BottomDrawer>
  );
};

export default React.memo(ConsumerSubscriptionDetailsDrawer);
