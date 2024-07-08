import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { GenericInfiniteScrollEnhancedCssOnly } from '#src/components/InfiniteScroll/GenericInfiniteScrollCssOnly.component';
import ConsumerPassCard from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPassCard';
import UniversalPassDetailsCard from '#src/libs/consumer-space/components/reworked/@MyPasses/UniversalPass/UniversalPassDetailsCard';
import ConsumerCardSkeleton from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSkeleton';
import PageInnerContentLayout from '#src/libs/consumer-space/components/reworked/@Layout/PageInnerContentLayout';

import { parseUniversalPassData } from '#src/libs/consumer-space/components/reworked/@MyPasses/UniversalPass/utils';
import {
  MY_PASSES_LIST_CONTAINER_HEIGHT,
  MY_PASSES_MOBILE_LIST_CONTAINER_HEIGHT,
} from '#src/libs/consumer-space/components/reworked/@MyPasses/constants';

import type { UniversalPassReworked } from '#src/libs/universal-pass/types';
import type { PassFilterTab } from '#src/libs/consumer-space/components/reworked/@MyPasses/types';

// Common stylesheet
import '#src/libs/consumer-space/components/reworked/@MyPasses/GenericPass/ListContainer/styles.css';
import { getCreditsDividedDisplay } from '#src/libs/theme/utils';

type Props = {
  handlePaginationFetchMore: () => void;
  hasNextPage?: boolean;
  isLoading?: boolean;
  isMetadataLoading?: boolean;
  isMobile?: boolean;
  onPassCardClick: (passId: number) => void;
  passList: UniversalPassReworked[];
  selectedFilterTab: PassFilterTab;
  selectedPass?: UniversalPassReworked;
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

  const isCurrentTabContentEmpty = !isLoading && !passList?.length;
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
    <PageInnerContentLayout
      DetailComponent={
        <UniversalPassDetailsCard
          activityCompatibilities={activityCompatibilities}
          appointmentCompatibilities={appointmentCompatibilities}
          className={
            (isCurrentTabContentEmpty || isMobile) &&
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
      }
      emptyPlaceholder={t(
        `consumerSpace:reworked.myBookings.listContainer.placeholder.pass.${selectedFilterTab}`,
      )}
      InfiniteScrollComponent={
        <GenericInfiniteScrollEnhancedCssOnly<UniversalPassReworked>
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
              key={item?.consumer_payment_pack?.id}
              creditsLeft={getCreditsDividedDisplay(
                item?.consumer_payment_pack?.available_credits,
              )}
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
              totalCredits={getCreditsDividedDisplay(
                item?.consumer_payment_pack?.payment_pack?.credits,
              )}
            />
          )}
        />
      }
      isEmpty={isCurrentTabContentEmpty}
    />
  );
};

export default React.memo(UniversalPassListContainer);
