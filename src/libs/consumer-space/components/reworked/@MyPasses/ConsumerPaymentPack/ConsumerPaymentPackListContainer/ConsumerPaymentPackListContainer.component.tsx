import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CellMeasurerCache } from 'react-virtualized';

import ConsumerPassCard from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPassCard';
import ConsumerPaymentPackDetailsCard from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPaymentPack/ConsumerPaymentPackDetailsCard';
import { getCreditsDividedDisplay } from '#src/libs/theme/utils';
import PageInnerContentLayout from '#src/libs/consumer-space/components/reworked/@Layout/PageInnerContentLayout';
import ConsumerSpaceVirtualizedList from '#src/libs/consumer-space/components/reworked/@Layout/ConsumerSpaceVirtualizedList';

import useConsumerPaymentPackData from '#src/libs/consumer-space/hooks/consumerPaymentPackData.hook';

import type { PassFilterTab } from '#src/libs/consumer-space/components/reworked/@MyPasses/types';
import type { ConsumerPaymentPackReworked } from '#src/libs/consumer-payment-pack/types';

// Common stylesheet
import '#src/libs/consumer-space/components/reworked/@MyPasses/GenericPass/ListContainer/styles.css';

type Props = {
  handleChangePage: (page: number) => void;
  isLoading?: boolean;
  isMetadataLoading?: boolean;
  isMobile?: boolean;
  onPassCardClick: (passId: number) => void;
  passList: ConsumerPaymentPackReworked[];
  selectedFilterTab: PassFilterTab;
  selectedPass?: ConsumerPaymentPackReworked;
  cache: CellMeasurerCache;
  currentPage: number;
  currentCount: number;
};

type ConsumerPaymentPackListContainerRowProps = {
  selectedPassId?: number;
  handleSeeDetails: (id: number) => () => void;
  item: ConsumerPaymentPackReworked;
};

const ConsumerPaymentPackListContainerRow: React.FC<
  ConsumerPaymentPackListContainerRowProps
> = ({ selectedPassId, handleSeeDetails, item }) => {
  return (
    <ConsumerPassCard
      creditsLeft={getCreditsDividedDisplay(item.available_credits)}
      expirationDate={item.ending_date}
      handleSeeDetails={handleSeeDetails(item.id)}
      isMultistudio={!!item.created_from_payment_pack_template_instance}
      isSelected={item.id === selectedPassId}
      isShared={
        !!item.src_consumer_payment_pack?.length ||
        !!item.dst_consumer_payment_pack
      }
      isSuspended={item.disabled}
      isUnlimited={!item.payment_pack?.credits}
      passName={item.payment_pack?.name}
      startDate={item.starting_date}
      totalCredits={getCreditsDividedDisplay(item.payment_pack?.credits)}
    />
  );
};

export const ConsumerPaymentPackListContainer: React.FC<Props> = ({
  isMobile,
  isLoading,
  isMetadataLoading,
  passList,
  selectedPass,
  onPassCardClick,
  handleChangePage,
  selectedFilterTab,
  cache,
  currentPage,
  currentCount,
}) => {
  const { t } = useTranslation('consumerSpace');

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
  } = useConsumerPaymentPackData(selectedPass);

  const handleSeeDetails = useCallback(
    (id) => () => onPassCardClick(id),
    [onPassCardClick],
  );

  return (
    <PageInnerContentLayout
      count={currentCount}
      DetailComponent={
        <ConsumerPaymentPackDetailsCard
          activityCompatibilities={activityCompatibilities}
          className={
            (isMobile || isCurrentTabContentEmpty) &&
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
      isEmpty={isCurrentTabContentEmpty}
      isLoading={isLoading || isMetadataLoading}
      onPageChange={handleChangePage}
      page={currentPage}
      VirtualizedListComponent={
        <ConsumerSpaceVirtualizedList<ConsumerPaymentPackReworked>
          cache={cache}
          data={passList}
          isLoading={isLoading || isMetadataLoading}
          rowCount={passList?.length ?? 0}
          rowRenderer={({ item }) => (
            <ConsumerPaymentPackListContainerRow
              handleSeeDetails={handleSeeDetails}
              item={item}
              selectedPassId={selectedPass?.id}
            />
          )}
        />
      }
    />
  );
};

export default React.memo(ConsumerPaymentPackListContainer);
