import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import Typography from '#Fabrique/Typography';
import { GenericInfiniteScrollEnhancedCssOnly } from '#components/InfiniteScroll/GenericInfiniteScrollCssOnly.component';
import ConsumerPassCard from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassCard';
import ConsumerPaymentPackDetailsCard from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPaymentPack/ConsumerPaymentPackDetailsCard';
import ConsumerCardSkeleton from '#libs/consumer-space/components/reworked/common/ConsumerCardSkeleton';

import { parseConsumerPaymentPackData } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPaymentPack/utils';
import {
  MY_BOOKINGS_LIST_CONTAINER_HEIGHT,
  MY_BOOKINGS_MOBILE_LIST_CONTAINER_HEIGHT,
} from '#libs/consumer-space/components/reworked/@MyBookings/constants';

import type { PassFilterTab } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassFilters/types';
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
  selectedFilterTab: PassFilterTab;
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
  selectedFilterTab,
}) => {
  const { t } = useTranslation('consumerSpace');

  const showPlaceholder = !isLoading && !passList?.length;

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
    <div
      className={classNames('bs-consumer-pass-page__content__list-container', {
        'bs-consumer-pass-page__content__list-container--empty':
          showPlaceholder,
      })}
    >
      {showPlaceholder && (
        <Typography variant="body-lg">
          {t(
            `consumerSpace:reworked.myBookings.listContainer.placeholder.pass.${selectedFilterTab}`,
          )}
        </Typography>
      )}
      <ul
        className={classNames(
          'bs-consumer-pass-page__content__list-container__list',
          {
            'bs-consumer-pass-page__content__list-container__list--hidden':
              showPlaceholder,
          },
        )}
      >
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
          loader={<ConsumerCardSkeleton />}
          renderItem={({ item }) => (
            <ConsumerPassCard
              key={item.id}
              creditsLeft={item.available_credits}
              expirationDate={item.ending_date}
              handleSeeDetails={handleSeeDetails(item.id)}
              isLoading={isLoading}
              isMultistudio={!!item.created_from_payment_pack_template_instance}
              isSelected={item.id === selectedPass?.id}
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
        className={
          (isMobile || showPlaceholder) &&
          'bs-consumer-payment-pack-details-card__root--hidden'
        }
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
