import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { GenericInfiniteScrollEnhancedCssOnly } from '#src/components/InfiniteScroll/GenericInfiniteScrollCssOnly.component';
import ConsumerPassCard from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPassCard';
import PrivateConsumerPassDetailsCard from '#src/libs/consumer-space/components/reworked/@MyPasses/PrivateConsumerPass/PrivateConsumerPassDetailsCard';
import ConsumerCardSkeleton from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSkeleton';
import PageInnerContentLayout from '#src/libs/consumer-space/components/reworked/@Layout/PageInnerContentLayout';

import { parsePrivateConsumerPassData } from '#src/libs/consumer-space/components/reworked/@MyPasses/PrivateConsumerPass/utils';
import { getExpirationDate } from '#src/libs/private-service/utils';
import { getCreditsDividedDisplay } from '#src/libs/theme/utils';

import type { PrivateConsumerPassReworked } from '#src/libs/private-service/types';
import type { PassFilterTab } from '#src/libs/consumer-space/components/reworked/@MyPasses/types';

import {
  MY_PASSES_LIST_CONTAINER_HEIGHT,
  MY_PASSES_MOBILE_LIST_CONTAINER_HEIGHT,
} from '#src/libs/consumer-space/components/reworked/@MyPasses/constants';

// Common stylesheet
import '#src/libs/consumer-space/components/reworked/@MyPasses/GenericPass/ListContainer/styles.css';

type Props = {
  handlePaginationFetchMore: () => void;
  hasNextPage?: boolean;
  isLoading?: boolean;
  isMetadataLoading?: boolean;
  isMobile?: boolean;
  onPassCardClick: (passId: number) => void;
  passList: PrivateConsumerPassReworked[];
  selectedFilterTab: PassFilterTab;
  selectedPass?: PrivateConsumerPassReworked;
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

  const isCurrentTabContentEmpty = !isLoading && !passList?.length;
  const handleSeeDetails = useCallback(
    (id: number) => () => onPassCardClick(id),
    [onPassCardClick],
  );

  return (
    <PageInnerContentLayout
      DetailComponent={
        <PrivateConsumerPassDetailsCard
          appointmentCompatibilities={appointmentCompatibilities}
          // TODO: Out of scope, needs product specs
          className={
            (isMobile || isCurrentTabContentEmpty) &&
            'bs-private-consumer-pass-details-card__root--hidden'
          }
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
      }
      emptyPlaceholder={t(
        `consumerSpace:reworked.myBookings.listContainer.placeholder.pass.${selectedFilterTab}`,
      )}
      InfiniteScrollComponent={
        <GenericInfiniteScrollEnhancedCssOnly<PrivateConsumerPassReworked>
          fetchMoreData={handlePaginationFetchMore}
          hasMore={hasNextPage}
          height={
            isMobile
              ? MY_PASSES_MOBILE_LIST_CONTAINER_HEIGHT
              : MY_PASSES_LIST_CONTAINER_HEIGHT
          }
          items={passList}
          loader={<ConsumerCardSkeleton />}
          renderItem={({ item }) => (
            <ConsumerPassCard
              key={item.id}
              creditsLeft={getCreditsDividedDisplay(
                item?.private_pass?.credits - item?.used_credits,
              )}
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
              totalCredits={getCreditsDividedDisplay(
                item?.private_pass?.credits,
              )}
            />
          )}
        />
      }
      isEmpty={isCurrentTabContentEmpty}
    />
  );
};

export default React.memo(ConsumerPassListContainer);
