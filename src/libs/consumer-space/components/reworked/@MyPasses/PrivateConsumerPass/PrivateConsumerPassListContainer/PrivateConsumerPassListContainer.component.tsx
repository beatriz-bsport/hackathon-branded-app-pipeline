import React, { useCallback } from 'react';
import classNames from 'classnames';

import { GenericInfiniteScrollEnhancedCssOnly } from '#components/InfiniteScroll/GenericInfiniteScrollCssOnly.component';
import CircularProgress from '#components/css-only/CircularProgress/CircularProgress.component';
import ConsumerPassCard from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassCard';
import PrivateConsumerPassDetailsCard from '#libs/consumer-space/components/reworked/@MyPasses/PrivateConsumerPass/PrivateConsumerPassDetailsCard';

import { parsePrivateConsumerPassData } from '#libs/consumer-space/components/reworked/@MyPasses/PrivateConsumerPass/utils';
import { getExpirationDate } from '#libs/private-service/utils';
import {
  MY_BOOKINGS_LIST_CONTAINER_HEIGHT,
  MY_BOOKINGS_MOBILE_LIST_CONTAINER_HEIGHT,
} from '#libs/consumer-space/components/reworked/@MyBookings/constants';

import type { PrivateConsumerPassReworked } from '#libs/private-service/types';

// Common stylesheet
import '#libs/consumer-space/components/reworked/@MyPasses/GenericPass/ListContainer/styles.css';

type Props = {
  isLoading?: boolean;
  isMetadataLoading?: boolean;
  isMobile?: boolean;
  selectedPass?: PrivateConsumerPassReworked;
  passList: PrivateConsumerPassReworked[];
  hasNextPage?: boolean;
  onPassCardClick: (passId: number) => void;
  handlePaginationFetchMore: () => void;
};

export const ConsumerPassListContainer: React.FC<Props> = ({
  isLoading,
  isMetadataLoading,
  isMobile,
  passList,
  selectedPass,
  hasNextPage,
  onPassCardClick,
  handlePaginationFetchMore,
}) => {
  const {
    appointmentCompatibilities,
    creditsLeft,
    description,
    expirationDate,
    isCompatibleWithVod,
    isSuspended,
    isUnlimited,
    name,
    sharedBy,
    sharedWith,
    startDate,
    totalCredits,
  } = parsePrivateConsumerPassData(selectedPass);

  const handleSeeDetails = useCallback(
    (id: number) => () => onPassCardClick(id),
    [onPassCardClick],
  );

  return (
    <div className="bs-consumer-pass-page__content__list-container">
      <ul className="bs-consumer-pass-page__content__list-container__list">
        <GenericInfiniteScrollEnhancedCssOnly<PrivateConsumerPassReworked>
          className="bs-consumer-pass-page__content__list-container__list__container"
          fetchMoreData={handlePaginationFetchMore}
          hasMore={hasNextPage}
          // @ts-expect-error
          height={
            isMobile
              ? MY_BOOKINGS_MOBILE_LIST_CONTAINER_HEIGHT
              : MY_BOOKINGS_LIST_CONTAINER_HEIGHT
          }
          items={passList}
          loader={<CircularProgress size="sm" />}
          renderItem={({ item }) => (
            <ConsumerPassCard
              key={item.id}
              creditsLeft={item?.private_pass?.credits - item?.used_credits}
              expirationDate={item ? getExpirationDate(item) : null}
              handleSeeDetails={handleSeeDetails(item.id)}
              isLoading={isLoading}
              isMultistudio={null}
              isShared={
                !!item?.dst_private_consumer_pass ||
                !!item?.src_private_consumer_pass?.length
              }
              isSuspended={item.disabled}
              isUnlimited={!item?.private_pass?.credits}
              passName={item?.private_pass?.name}
              startDate={item?.date_bought}
              totalCredits={item?.private_pass?.credits}
            />
          )}
        />
      </ul>

      <PrivateConsumerPassDetailsCard
        appointmentCompatibilities={appointmentCompatibilities}
        // TODO: Out of scope, needs product specs
        className={classNames('bs-private-consumer-pass-details-card__root', {
          'bs-private-consumer-pass-details-card__root--hidden': isMobile,
        })}
        compatibleEstablishments={null}
        creditsLeft={creditsLeft}
        description={description}
        expirationDate={expirationDate}
        isCompatibleWithVod={isCompatibleWithVod}
        isLoading={isLoading || isMetadataLoading}
        isMobile={isMobile}
        isSuspended={isSuspended}
        isUnlimited={isUnlimited}
        name={name}
        sharedBy={sharedBy}
        sharedWith={sharedWith}
        showPlaceholder={!selectedPass}
        startDate={startDate}
        totalCredits={totalCredits}
      />
    </div>
  );
};

export default React.memo(ConsumerPassListContainer);
