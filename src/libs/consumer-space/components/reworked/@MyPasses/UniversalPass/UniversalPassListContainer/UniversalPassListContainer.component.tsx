import React, { useCallback } from 'react';

import { GenericInfiniteScrollEnhancedCssOnly } from '#components/InfiniteScroll/GenericInfiniteScrollCssOnly.component';
import CircularProgress from '#components/css-only/CircularProgress/CircularProgress.component';
import ConsumerPassCard from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassCard';
import UniversalPassDetailsCard from '#libs/consumer-space/components/reworked/@MyPasses/UniversalPass/UniversalPassDetailsCard';

import { parseUniversalPassData } from '#libs/consumer-space/components/reworked/@MyPasses/UniversalPass/utils';

import type { UniversalPassReworked } from '#libs/universal-pass/types';

// Common stylesheet
import '#libs/consumer-space/components/reworked/@MyPasses/GenericPass/ListContainer/styles.css';

type Props = {
  isLoading?: boolean;
  isMetadataLoading?: boolean;
  selectedPass?: UniversalPassReworked;
  passList: UniversalPassReworked[];
  hasNextPage?: boolean;
  onPassCardClick: (passId: number) => void;
  handlePaginationFetchMore: () => void;
};

export const UniversalPassListContainer: React.FC<Props> = ({
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
    <div className="bs-consumer-pass-page__content__list-container">
      <ul className="bs-consumer-pass-page__content__list-container__list">
        <GenericInfiniteScrollEnhancedCssOnly<UniversalPassReworked>
          className="bs-consumer-pass-page__content__list-container__list__container"
          fetchMoreData={handlePaginationFetchMore}
          hasMore={hasNextPage}
          // TODO : height needs to be set to trigger fetchMoreData..
          // @ts-expect-error
          height="calc(100dvh - 24px - 44px - 42px - 16px - 56px - 16px - 64px)"
          items={passList}
          loader={<CircularProgress size="sm" />}
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
        // TODO: Out of scope, needs product specs
        compatibleEstablishments={null}
        creditsLeft={creditsLeft}
        description={description}
        expirationDate={expirationDate}
        isCompatibleWithBookingForGuest={isCompatibleWithBookingForGuest}
        isCompatibleWithVod={isCompatibleWithVod}
        isLoading={isLoading || isMetadataLoading}
        isSuspended={isSuspended}
        isUnlimited={isUnlimited}
        // TODO
        mobileVersion={false}
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
