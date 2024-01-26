import React, { useCallback } from 'react';

import { GenericInfiniteScrollEnhancedCssOnly } from '#components/InfiniteScroll/GenericInfiniteScrollCssOnly.component';
import CircularProgress from '#components/css-only/CircularProgress/CircularProgress.component';
import ConsumerPassCard from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassCard';
import PrivateConsumerPassDetailsCard from '#libs/consumer-space/components/reworked/@MyPasses/PrivateConsumerPass/PrivateConsumerPassDetailsCard';

import { parsePrivateConsumerPassData } from '#libs/consumer-space/components/reworked/@MyPasses/PrivateConsumerPass/utils';
import { getExpirationDate } from '#libs/private-service/utils';

import type { PrivateConsumerPassReworked } from '#libs/private-service/types';

// Common stylesheet
import '#libs/consumer-space/components/reworked/@MyPasses/GenericPass/ListContainer/styles.css';

type Props = {
  isLoading?: boolean;
  isMetadataLoading?: boolean;
  selectedPass?: PrivateConsumerPassReworked;
  passList: PrivateConsumerPassReworked[];
  hasNextPage?: boolean;
  onPassCardClick: (passId: number) => void;
  handlePaginationFetchMore: () => void;
};

export const ConsumerPassListContainer: React.FC<Props> = ({
  isLoading,
  isMetadataLoading,
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
          // TODO : height needs to be set to trigger fetchMoreData..
          // @ts-expect-error
          height="calc(100dvh - 24px - 44px - 42px - 16px - 56px - 16px - 64px)"
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
        compatibleEstablishments={null}
        creditsLeft={creditsLeft}
        description={description}
        expirationDate={expirationDate}
        isCompatibleWithVod={isCompatibleWithVod}
        isLoading={isLoading || isMetadataLoading}
        isSuspended={isSuspended}
        isUnlimited={isUnlimited}
        // TODO
        mobileVersion={null}
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
