import React, { useCallback } from 'react';
import classNames from 'classnames';

import { GenericInfiniteScrollEnhancedCssOnly } from '#components/InfiniteScroll/GenericInfiniteScrollCssOnly.component';
import CircularProgress from '#components/css-only/CircularProgress/CircularProgress.component';
import ConsumerPassCard from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassCard';
import ConsumerPaymentPackDetailsCard from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPaymentPack/ConsumerPaymentPackDetailsCard';

import { parseConsumerPaymentPackData } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPaymentPack/utils';
import {
  MY_BOOKINGS_LIST_CONTAINER_HEIGHT,
  MY_BOOKINGS_MOBILE_LIST_CONTAINER_HEIGHT,
} from '#libs/consumer-space/components/reworked/@MyBookings/constants';

import type { ConsumerPaymentPackReworked } from '#libs/consumer-payment-pack/types';

// Common stylesheet
import '#libs/consumer-space/components/reworked/@MyPasses/GenericPass/ListContainer/styles.css';

type Props = {
  isMobile?: boolean;
  isLoading?: boolean;
  isMetadataLoading?: boolean;
  selectedPass?: ConsumerPaymentPackReworked;
  passList: ConsumerPaymentPackReworked[];
  hasNextPage?: boolean;
  onPassCardClick: (passId: number) => void;
  handlePaginationFetchMore: () => void;
};

export const ConsumerPaymentPackListContainer: React.FC<Props> = ({
  isMobile,
  isLoading,
  isMetadataLoading,
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
          // @ts-expect-error
          height={
            isMobile
              ? MY_BOOKINGS_MOBILE_LIST_CONTAINER_HEIGHT
              : MY_BOOKINGS_LIST_CONTAINER_HEIGHT
          }
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
        className={classNames('bs-consumer-payment-pack-details-card__root', {
          'bs-consumer-payment-pack-details-card__root--hidden': isMobile,
        })}
        // TODO: Out of scope, needs product specs
        compatibleEstablishments={null}
        creditsLeft={creditsLeft}
        description={description}
        expirationDate={expirationDate}
        isCompatibleWithBookingForGuest={isCompatibleWithBookingForGuest}
        isCompatibleWithVod={isCompatibleWithVod}
        isLoading={isLoading || isMetadataLoading}
        isMobile={isMobile}
        isSuspended={isSuspended}
        isUnlimited={isUnlimited}
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
