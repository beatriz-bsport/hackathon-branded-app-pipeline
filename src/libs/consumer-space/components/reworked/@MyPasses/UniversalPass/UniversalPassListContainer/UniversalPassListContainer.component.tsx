import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import Typography from '#Fabrique/Typography';
import { GenericInfiniteScrollEnhancedCssOnly } from '#components/InfiniteScroll/GenericInfiniteScrollCssOnly.component';
import ConsumerPassCard from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassCard';
import UniversalPassDetailsCard from '#libs/consumer-space/components/reworked/@MyPasses/UniversalPass/UniversalPassDetailsCard';
import ConsumerCardSkeleton from '#libs/consumer-space/components/reworked/common/ConsumerCardSkeleton';

import { parseUniversalPassData } from '#libs/consumer-space/components/reworked/@MyPasses/UniversalPass/utils';
import {
  MY_BOOKINGS_LIST_CONTAINER_HEIGHT,
  MY_BOOKINGS_MOBILE_LIST_CONTAINER_HEIGHT,
} from '#libs/consumer-space/components/reworked/@MyBookings/constants';

import type { UniversalPassReworked } from '#libs/universal-pass/types';
import type { PassFilterTab } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassFilters/types';

// Common stylesheet
import '#libs/consumer-space/components/reworked/@MyPasses/GenericPass/ListContainer/styles.css';

type Props = {
  isLoading?: boolean;
  isMetadataLoading?: boolean;
  isMobile?: boolean;
  selectedPass?: UniversalPassReworked;
  passList: UniversalPassReworked[];
  hasNextPage?: boolean;
  onPassCardClick: (passId: number) => void;
  handlePaginationFetchMore: () => void;
  selectedFilterTab: PassFilterTab;
};

export const UniversalPassListContainer: React.FC<Props> = ({
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
  const { t } = useTranslation('consumerSpace');

  const showPlaceholder = !isLoading && !passList?.length;

  const {
    activityCompatibilities,
    appointmentCompatibilities,
    creditsLeft,
    isCompatibleWithBookingForGuest,
    description,
    expirationDate,
    isSuspended,
    isUnlimited,
    name,
    sharedBy,
    sharedWith,
    startDate,
    timeSlots,
    totalCredits,
    isCompatibleWithVod,
  } = parseUniversalPassData(selectedPass);

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
        <GenericInfiniteScrollEnhancedCssOnly<UniversalPassReworked>
          className="bs-consumer-pass-page__content__list-container__list__container"
          fetchMoreData={handlePaginationFetchMore}
          hasMore={hasNextPage}
          height={
            isMobile
              ? MY_BOOKINGS_MOBILE_LIST_CONTAINER_HEIGHT
              : MY_BOOKINGS_LIST_CONTAINER_HEIGHT
          }
          items={passList}
          loader={<ConsumerCardSkeleton />}
          renderItem={({ item }) => (
            <ConsumerPassCard
              key={item?.consumer_payment_pack?.id}
              creditsLeft={item?.consumer_payment_pack?.available_credits}
              expirationDate={item?.consumer_payment_pack?.ending_date}
              handleSeeDetails={handleSeeDetails(item?.id)}
              isLoading={isLoading}
              isMultistudio={
                !!item?.consumer_payment_pack
                  ?.created_from_payment_pack_template_instance
              }
              isSelected={item.id === selectedPass?.id}
              isShared={
                !!item?.consumer_payment_pack?.src_consumer_payment_pack
                  ?.length ||
                !!item?.consumer_payment_pack?.dst_consumer_payment_pack
              }
              isSuspended={item?.consumer_payment_pack?.disabled}
              isUnlimited={!item?.consumer_payment_pack?.payment_pack?.credits}
              passName={item?.consumer_payment_pack?.payment_pack?.name}
              startDate={item?.consumer_payment_pack?.starting_date}
              totalCredits={item?.consumer_payment_pack?.payment_pack?.credits}
            />
          )}
        />
      </ul>

      <UniversalPassDetailsCard
        activityCompatibilities={activityCompatibilities}
        appointmentCompatibilities={appointmentCompatibilities}
        className={
          (showPlaceholder || isMobile) &&
          'bs-universal-pass-details-card__root--hidden'
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

export default React.memo(UniversalPassListContainer);
