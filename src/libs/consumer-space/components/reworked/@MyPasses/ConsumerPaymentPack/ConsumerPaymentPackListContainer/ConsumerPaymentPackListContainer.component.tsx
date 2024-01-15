import React, { useCallback } from 'react';

import { GenericInfiniteScrollEnhancedCssOnly } from '#components/InfiniteScroll/GenericInfiniteScrollCssOnly.component';
import CircularProgress from '#components/css-only/CircularProgress/CircularProgress.component';
import ConsumerPassCard from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassCard';
import { ConsumerPaymentPackReworked } from '#libs/consumer-payment-pack/types';
import ConsumerPaymentPackDetailsCard from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPaymentPack/ConsumerPaymentPackDetailsCard';
import { parseConsumerPaymentPackData } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPaymentPack/utils';

// Common stylesheet
import '#libs/consumer-space/components/reworked/@MyPasses/GenericPass/ListContainer/styles.css';

type Props = {
  isLoading?: boolean;
  selectedPass?: ConsumerPaymentPackReworked;
  passList: ConsumerPaymentPackReworked[];
  hasNextPage?: boolean;
  onPassCardClick: (passId: number) => void;
  handlePaginationFetchMore: () => void;
};

export const ConsumerPaymentPackListContainer: React.FC<Props> = ({
  isLoading,
  passList,
  selectedPass,
  hasNextPage,
  onPassCardClick,
  handlePaginationFetchMore,
}) => {
  const {
    activityCompatibilities,
    creditsLeft,
    description,
    expirationDate,
    isCompatibleWithBookingForGuest,
    isCompatibleWithVod,
    isSuspended,
    isUnlimited,
    name,
    restriction,
    sharedBy,
    sharedWith,
    startDate,
    timeSlots,
    totalCredits,
  } = parseConsumerPaymentPackData(selectedPass);

  const handleSeeDetails = useCallback(
    (id) => () => onPassCardClick(id),
    [onPassCardClick],
  );

  return (
    <div className="bs-consumer-pass-page__content__list-container">
      <ul className="bs-consumer-pass-page__content__list-container__list">
        <GenericInfiniteScrollEnhancedCssOnly<ConsumerPaymentPackReworked>
          className="bs-consumer-pass-page__content__list-container__list__container"
          fetchMoreData={handlePaginationFetchMore}
          hasMore={hasNextPage}
          // TODO: height needs to be set to trigger fetchMoreData..
          // @ts-expect-error
          height="calc(100dvh - 24px - 44px - 42px - 16px - 56px - 16px - 64px)"
          items={passList || []}
          loader={<CircularProgress size="sm" />}
          renderItem={({ item }) => (
            <ConsumerPassCard
              key={item.id}
              creditsLeft={item.available_credits}
              expirationDate={item.ending_date}
              handleSeeDetails={handleSeeDetails(item.id)}
              isLoading={isLoading}
              isMultistudio={!!item.created_from_payment_pack_template_instance}
              isShared={
                !!item.src_consumer_payment_pack?.length ||
                !!item.dst_consumer_payment_pack
              }
              isSuspended={item.disabled}
              isUnlimited={!item.payment_pack?.credits}
              passName={item.payment_pack?.name}
              startDate={item.starting_date}
              totalCredits={item.payment_pack?.credits}
            />
          )}
        />
      </ul>

      <ConsumerPaymentPackDetailsCard
        activityCompatibilities={activityCompatibilities}
        // TODO: Out of scope, needs product specs
        compatibleEstablishments={null}
        creditsLeft={creditsLeft}
        description={description}
        expirationDate={expirationDate}
        isCompatibleWithBookingForGuest={isCompatibleWithBookingForGuest}
        isCompatibleWithVod={isCompatibleWithVod}
        isLoading={isLoading}
        isSuspended={isSuspended}
        isUnlimited={isUnlimited}
        // TODO
        mobileVersion={null}
        name={name}
        restriction={restriction}
        sharedBy={sharedBy}
        sharedWith={sharedWith}
        showPlaceholder={!selectedPass}
        startDate={startDate}
        timeSlots={timeSlots}
        totalCredits={totalCredits}
      />
    </div>
  );
};

export default React.memo(ConsumerPaymentPackListContainer);
