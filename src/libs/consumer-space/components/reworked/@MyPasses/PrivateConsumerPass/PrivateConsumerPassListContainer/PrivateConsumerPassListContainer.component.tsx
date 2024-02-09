import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { GenericInfiniteScrollEnhancedCssOnly } from '#components/InfiniteScroll/GenericInfiniteScrollCssOnly.component';
import Typography from '#Fabrique/Typography';
import ConsumerPassCard from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassCard';
import PrivateConsumerPassDetailsCard from '#libs/consumer-space/components/reworked/@MyPasses/PrivateConsumerPass/PrivateConsumerPassDetailsCard';
import ConsumerCardSkeleton from '#libs/consumer-space/components/reworked/common/ConsumerCardSkeleton';

import { parsePrivateConsumerPassData } from '#libs/consumer-space/components/reworked/@MyPasses/PrivateConsumerPass/utils';
import { getExpirationDate } from '#libs/private-service/utils';
import {
  MY_BOOKINGS_LIST_CONTAINER_HEIGHT,
  MY_BOOKINGS_MOBILE_LIST_CONTAINER_HEIGHT,
} from '#libs/consumer-space/components/reworked/@MyBookings/constants';

import type { PrivateConsumerPassReworked } from '#libs/private-service/types';
import type { PassFilterTab } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassFilters/types';

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
  selectedFilterTab: PassFilterTab;
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
  selectedFilterTab,
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

  const { t } = useTranslation('consumerSpace');

  const showPlaceholder = !isLoading && !passList?.length;

  const handleSeeDetails = useCallback(
    (id: number) => () => onPassCardClick(id),
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
          loader={<ConsumerCardSkeleton />}
          renderItem={({ item }) => (
            <ConsumerPassCard
              key={item.id}
              creditsLeft={item?.private_pass?.credits - item?.used_credits}
              expirationDate={item ? getExpirationDate(item) : null}
              handleSeeDetails={handleSeeDetails(item.id)}
              isLoading={isLoading}
              isMultistudio={null}
              isSelected={item.id === selectedPass?.id}
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
          'bs-private-consumer-pass-details-card__root--hidden':
            isMobile || showPlaceholder,
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
