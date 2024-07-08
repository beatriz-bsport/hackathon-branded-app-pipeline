import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { GenericInfiniteScrollEnhancedCssOnly } from '#src/components/InfiniteScroll/GenericInfiniteScrollCssOnly.component';
import ConsumerPassCard from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPassCard';
import ConsumerPaymentPackDetailsCard from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPaymentPack/ConsumerPaymentPackDetailsCard';
import ConsumerCardSkeleton from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSkeleton';
import { getCreditsDividedDisplay } from '#src/libs/theme/utils';
import PageInnerContentLayout from '#src/libs/consumer-space/components/reworked/@Layout/PageInnerContentLayout';

import { parseConsumerPaymentPackData } from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPaymentPack/utils';

import type { PassFilterTab } from '#src/libs/consumer-space/components/reworked/@MyPasses/types';
import type { ConsumerPaymentPackReworked } from '#src/libs/consumer-payment-pack/types';

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
  passList: ConsumerPaymentPackReworked[];
  selectedFilterTab: PassFilterTab;
  selectedPass?: ConsumerPaymentPackReworked;
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
  const isCurrentTabContentEmpty = !isLoading && !passList?.length;
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
    restrictions,
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
    <PageInnerContentLayout
      DetailComponent={
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
          restrictions={restrictions}
          sharedBy={sharedBy}
          sharedWith={sharedWith}
          showPlaceholder={!selectedPass}
          startDate={startDate}
          timeSlots={timeSlots}
          totalCredits={totalCredits}
        />
      }
      emptyPlaceholder={t(
        `consumerSpace:reworked.myBookings.listContainer.placeholder.pass.${selectedFilterTab}`,
      )}
      InfiniteScrollComponent={
        <GenericInfiniteScrollEnhancedCssOnly<ConsumerPaymentPackReworked>
          fetchMoreData={handlePaginationFetchMore}
          hasMore={hasNextPage}
          height={
            isMobile
              ? MY_PASSES_MOBILE_LIST_CONTAINER_HEIGHT
              : MY_PASSES_LIST_CONTAINER_HEIGHT
          }
          items={passList || []}
          loader={<ConsumerCardSkeleton />}
          renderItem={({ item }) => (
            <ConsumerPassCard
              key={item.id}
              creditsLeft={getCreditsDividedDisplay(item.available_credits)}
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
              totalCredits={getCreditsDividedDisplay(
                item.payment_pack?.credits,
              )}
            />
          )}
        />
      }
      isEmpty={isCurrentTabContentEmpty}
    />
  );
};

export default React.memo(ConsumerPaymentPackListContainer);
